import { NextResponse } from 'next/server'
import 'dotenv/config'
import fetch from 'node-fetch'
import { geocodeLocation } from '../geocoding/geocoding'
import type { AirQualityData } from '@/utils/air-quality-data'
import {
  getAqiInfo,
  getHealthImplications,
  getCautionaryStatement,
  getMainPollutant,
} from '@/utils/air-quality-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location') || 'Ho Chi Minh City'
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  try {
    const data = await fetchAirQualityData(
      location,
      lat ? Number.parseFloat(lat) : undefined,
      lon ? Number.parseFloat(lon) : undefined,
    )
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching air quality data:', error)
    return NextResponse.json({ error: 'Failed to fetch air quality data' }, { status: 500 })
  }
}

async function fetchAirQualityData(
  city: string,
  providedLat?: number,
  providedLon?: number,
): Promise<AirQualityData> {
  const apiKey = process.env.OPENWEATHER_API_KEY

  // Use provided coordinates if available, otherwise geocode the location
  let lat: number, lon: number

  if (providedLat !== undefined && providedLon !== undefined) {
    lat = providedLat
    lon = providedLon
    console.log('Using provided coordinates:', lat, lon)
  } else {
    const location = await geocodeLocation(city)
    lat = location.lat
    lon = location.lon
    console.log('Geocoded location:', location)
  }

  if (!lat || !lon) {
    throw new Error(`Location not found for: ${city}`)
  }

  const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`

  const airRes = await fetch(airQualityUrl)
  const airData = await airRes.json()

  console.log('raw OpenWeather AQI (0–5 scale):', airData.list[0].main.aqi)

  const components = airData.list[0].components

  // --- CONVERSION FUNCTIONS ---
  function ugm3ToPPM_CO(ugm3: number): number {
    const mgm3 = ugm3 / 1000
    return (mgm3 * 24.45) / 28.01
  }

  function ugm3ToPPB_O3(ugm3: number): number {
    return (ugm3 * 24.45) / 48
  }

  function ugm3ToPPB_NO2(ugm3: number): number {
    return (ugm3 * 24.45) / 46.01
  }

  function ugm3ToPPB_SO2(ugm3: number): number {
    return (ugm3 * 24.45) / 64.06
  }

  // --- Converted pollutant values ---
  const pollutantValues = {
    pm25: components.pm2_5, // μg/m³
    pm10: components.pm10, // μg/m³
    o3: ugm3ToPPB_O3(components.o3), // μg/m³ to ppb
    no2: ugm3ToPPB_NO2(components.no2), // μg/m³ to ppb
    so2: ugm3ToPPB_SO2(components.so2), // μg/m³ to ppb
    co: ugm3ToPPM_CO(components.co), // ug/m³ to ppm
  }

  // --- Breakpoints for AQI ---
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

  function getAQI(pollutant: keyof typeof breakpoints, value: number): number {
    for (const bp of breakpoints[pollutant]) {
      if (value >= bp.c_low && value <= bp.c_high) {
        return Math.round(
          ((bp.i_high - bp.i_low) / (bp.c_high - bp.c_low)) * (value - bp.c_low) + bp.i_low,
        )
      }
    }
    return -1
  }

  const aqiValues = {
    pm25: getAQI('pm25', pollutantValues.pm25),
    pm10: getAQI('pm10', pollutantValues.pm10),
    o3: getAQI('o3', pollutantValues.o3),
    no2: getAQI('no2', pollutantValues.no2),
    so2: getAQI('so2', pollutantValues.so2),
    co: getAQI('co', pollutantValues.co),
  }

  const aqi = Math.max(...Object.values(aqiValues).filter((val) => val >= 0))

  const mainPollutant = getMainPollutant(pollutantValues)
  const { category, color } = getAqiInfo(aqi)
  const healthImplications = getHealthImplications(aqi)
  const cautionaryStatement = getCautionaryStatement(aqi)
  const openWeatherAQI = Math.round(airData.list[0].main.aqi)

  return {
    location: city,
    aqi,
    category,
    color,
    pollutants: {
      pm25: pollutantValues.pm25,
      pm10: pollutantValues.pm10,
      o3: pollutantValues.o3,
      no2: pollutantValues.no2,
      so2: pollutantValues.so2,
      co: pollutantValues.co,
    },
    timestamp: new Date().toISOString(),
    mainPollutant,
    healthImplications,
    cautionaryStatement,
    openWeatherAQI,
  }
}
