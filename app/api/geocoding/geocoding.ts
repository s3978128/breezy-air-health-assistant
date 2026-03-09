import 'dotenv/config'
import fetch from 'node-fetch'

export async function geocodeLocation(city: string) {
  const apiKey = process.env.OPENWEATHER_API_KEY
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`

  const response = await fetch(url)

  type GeocodingResponse = {
    name: string
    local_names?: Record<string, string>
    lat: number
    lon: number
    country: string
    state?: string
  }[]

  const results = (await response.json()) as GeocodingResponse
  //test only
  //   console.log("API KEY:", url);
  // console.log("Results:", results);
  // console.log("First result:", results[0]);
  if (!results || results.length === 0) {
    throw new Error('Location not found')
  }

  const { name, lat, lon, country, state } = results[0]

  return { name, lat, lon, country, state }
}
