import { NextResponse } from 'next/server'
import 'dotenv/config'
import fetch from 'node-fetch'
import { geocodeLocation } from '../geocoding/geocoding'
import { getAqiInfo } from '@/utils/air-quality-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location')
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  try {
    const data = await forecastAirQualityData({ location, lat, lon })
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching air quality data:', error)
    return NextResponse.json({ error: 'Failed to fetch air quality data' }, { status: 500 })
  }
}

type forecastResult = {
  aqi: number
  category: string
  color: string
  pollutants?: {
    pm25: number
    pm10: number
    o3: number
    no2: number
    so2: number
    co: number
  }
  mainPollutant?: string
}

type CombinedAQI = {
  tomorrow: forecastResult
  day_after: forecastResult
}

async function forecastAirQualityData({
  location,
  lat,
  lon,
}: {
  location?: string
  lat?: string | null
  lon?: string | null
}): Promise<CombinedAQI> {
  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) throw new Error('Missing OpenWeather API key in environment variables')

  let coordinates = { lat: null, lon: null }

  if (lat && lon) {
    coordinates = { lat, lon }
  } else if (location) {
    const loc = await geocodeLocation(location)
    if (!loc || !loc.lat || !loc.lon) {
      throw new Error(`Location not found for: ${location}`)
    }
    coordinates = { lat: loc.lat, lon: loc.lon }
  } else {
    throw new Error('No valid location or coordinates provided')
  }

  const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`
  const airRes = await fetch(airQualityUrl)
  const airData = await airRes.json()

  if (!airData?.list || airData.list.length < 49) {
    throw new Error('Insufficient air quality forecast data received')
  }

  const components24 = airData.list[24].components
  const components48 = airData.list[48].components

  // --- Conversion functions ---
  const ugm3ToPPM_CO = (ugm3: number) => parseFloat((((ugm3 / 1000) * 24.45) / 28.01).toFixed(1))
  const ugm3ToPPB_O3 = (ugm3: number) => parseFloat(((ugm3 * 24.45) / 48).toFixed(1))
  const ugm3ToPPB_NO2 = (ugm3: number) => parseFloat(((ugm3 * 24.45) / 46.01).toFixed(1))
  const ugm3ToPPB_SO2 = (ugm3: number) => parseFloat(((ugm3 * 24.45) / 64.06).toFixed(1))

  const convertPollutants = (components: any) => ({
    pm25: parseFloat(components.pm2_5.toFixed(1)),
    pm10: parseFloat(components.pm10.toFixed(1)),
    o3: ugm3ToPPB_O3(components.o3),
    no2: ugm3ToPPB_NO2(components.no2),
    so2: ugm3ToPPB_SO2(components.so2),
    co: ugm3ToPPM_CO(components.co),
  })

  const pollutantValues24 = convertPollutants(components24)
  const pollutantValues48 = convertPollutants(components48)

  // --- AQI Breakpoints ---
  const breakpoints = {
    pm25: [
      { c_low: 0.0, c_high: 12.0, i_low: 0, i_high: 50 },
      { c_low: 12.1, c_high: 35.4, i_low: 51, i_high: 100 },
      { c_low: 35.5, c_high: 55.4, i_low: 101, i_high: 150 },
      { c_low: 55.5, c_high: 150.4, i_low: 151, i_high: 200 },
      { c_low: 150.5, c_high: 250.4, i_low: 201, i_high: 300 },
      { c_low: 250.5, c_high: 350.4, i_low: 301, i_high: 400 },
      { c_low: 350.5, c_high: 500.4, i_low: 401, i_high: 500 },
    ],
    pm10: [
      { c_low: 0, c_high: 54, i_low: 0, i_high: 50 },
      { c_low: 55, c_high: 154, i_low: 51, i_high: 100 },
      { c_low: 155, c_high: 254, i_low: 101, i_high: 150 },
      { c_low: 255, c_high: 354, i_low: 151, i_high: 200 },
      { c_low: 355, c_high: 424, i_low: 201, i_high: 300 },
      { c_low: 425, c_high: 504, i_low: 301, i_high: 400 },
      { c_low: 505, c_high: 604, i_low: 401, i_high: 500 },
    ],
    o3: [
      { c_low: 0, c_high: 54, i_low: 0, i_high: 50 },
      { c_low: 55, c_high: 70, i_low: 51, i_high: 100 },
      { c_low: 71, c_high: 85, i_low: 101, i_high: 150 },
      { c_low: 86, c_high: 105, i_low: 151, i_high: 200 },
      { c_low: 106, c_high: 200, i_low: 201, i_high: 300 },
    ],
    no2: [
      { c_low: 0, c_high: 53, i_low: 0, i_high: 50 },
      { c_low: 54, c_high: 100, i_low: 51, i_high: 100 },
      { c_low: 101, c_high: 360, i_low: 101, i_high: 150 },
      { c_low: 361, c_high: 649, i_low: 151, i_high: 200 },
      { c_low: 650, c_high: 1249, i_low: 201, i_high: 300 },
    ],
    so2: [
      { c_low: 0, c_high: 35, i_low: 0, i_high: 50 },
      { c_low: 36, c_high: 75, i_low: 51, i_high: 100 },
      { c_low: 76, c_high: 185, i_low: 101, i_high: 150 },
      { c_low: 186, c_high: 304, i_low: 151, i_high: 200 },
      { c_low: 305, c_high: 604, i_low: 201, i_high: 300 },
    ],
    co: [
      { c_low: 0, c_high: 4.4, i_low: 0, i_high: 50 },
      { c_low: 4.5, c_high: 9.4, i_low: 51, i_high: 100 },
      { c_low: 9.5, c_high: 12.4, i_low: 101, i_high: 150 },
      { c_low: 12.5, c_high: 15.4, i_low: 151, i_high: 200 },
      { c_low: 15.5, c_high: 30.4, i_low: 201, i_high: 300 },
    ],
  }

  const getAQI = (pollutant: keyof typeof breakpoints, value: number) => {
    for (const bp of breakpoints[pollutant]) {
      if (value >= bp.c_low && value <= bp.c_high) {
        return Math.round(
          ((bp.i_high - bp.i_low) / (bp.c_high - bp.c_low)) * (value - bp.c_low) + bp.i_low,
        )
      }
    }
    return -1
  }

  const computeAQIValues = (pollutants: any) => ({
    pm25: getAQI('pm25', pollutants.pm25),
    pm10: getAQI('pm10', pollutants.pm10),
    o3: getAQI('o3', pollutants.o3),
    no2: getAQI('no2', pollutants.no2),
    so2: getAQI('so2', pollutants.so2),
    co: getAQI('co', pollutants.co),
  })

  const aqiValues24 = computeAQIValues(pollutantValues24)
  const aqiValues48 = computeAQIValues(pollutantValues48)

  const aqi24 = Math.max(...Object.values(aqiValues24))
  const aqi48 = Math.max(...Object.values(aqiValues48))

  const { category: category24, color: color24 } = getAqiInfo(aqi24)
  const { category: category48, color: color48 } = getAqiInfo(aqi48)

  const getMainPollutant = (aqiValues: Record<string, number>) => {
    const maxAqi = Math.max(...Object.values(aqiValues))
    return (
      Object.entries(aqiValues)
        .find(([_, val]) => val === maxAqi)?.[0]
        .toUpperCase() || 'Unknown'
    )
  }

  return {
    tomorrow: {
      aqi: aqi24,
      category: category24,
      color: color24,
      pollutants: pollutantValues24,
      mainPollutant: getMainPollutant(aqiValues24),
    },
    day_after: {
      aqi: aqi48,
      category: category48,
      color: color48,
      pollutants: pollutantValues48,
      mainPollutant: getMainPollutant(aqiValues48),
    },
  }
}
