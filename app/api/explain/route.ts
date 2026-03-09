import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini API client with the provided key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request: Request) {
  try {
    const { prompt, context } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Create a Gemini model instance
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

    // Add context to the prompt if available
    let enhancedPrompt = prompt
    if (context) {
      enhancedPrompt = `${prompt}

Current air quality context:
- Location: ${context.location}
- Current AQI: ${context.aqi} (${context.category})
- Main pollutant: ${context.mainPollutant}
- Health implications: ${context.healthImplications}

Please reference this current air quality information in your explanation.`
    }

    // Generate content
    const result = await model.generateContent(enhancedPrompt)
    const response = result.response
    const text = response.text()

    return NextResponse.json({ explanation: text })
  } catch (error) {
    console.error('Error in explain API:', error)
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 })
  }
}
