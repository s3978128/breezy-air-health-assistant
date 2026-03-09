import { NextResponse } from 'next/server'
import 'dotenv/config'
import fetch from 'node-fetch'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 })
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch location data')
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      return NextResponse.json({ location: 'Unknown Location' })
    }

    const { name, country, state } = data[0]
    let location = name

    // Add state for US locations
    if (country === 'US' && state) {
      location = `${name}, ${state}`
    }
    // Add country for non-US locations
    else if (country && country !== 'US') {
      location = `${name}, ${country}`
    }

    return NextResponse.json({ location })
  } catch (error) {
    console.error('Error in reverse geocoding:', error)
    return NextResponse.json({ error: 'Failed to reverse geocode' }, { status: 500 })
  }
}
