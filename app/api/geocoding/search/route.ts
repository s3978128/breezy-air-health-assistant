// /app/api/geocode/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 })
  }

  const apiKey = process.env.OPENWEATHER_API_KEY
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions')
    }

    const data = await response.json()

    const suggestions = data.map((item: any) => {
      let name = item.name
      if (item.state) name += `, ${item.state}`
      if (item.country) name += `, ${item.country}`
      return name
    })

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Geocode error:', error)
    return NextResponse.json({ error: 'Failed to get location suggestions' }, { status: 500 })
  }
}
