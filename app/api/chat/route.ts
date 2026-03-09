import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API client with the provided key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request: Request) {
  try {
    const { message, chatHistory, context } = await request.json()

    // Create a Gemini model instance
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

    // Construct a system instruction that includes the air quality context
    let systemInstruction = `You are Breezy, a friendly and bubbly air quality assistant with a conversational style like talking to a friend. NO MARKDOWN.

RESPONSE FORMAT:
- Use plain text only, NO markdown formatting, NO asterisks, NO code blocks
- Always start with a friendly greeting and a smiley emoji
- Keep responses concise and intuitive in length (2-4 sentences for simple questions, 4-6 for complex ones)
- Use a friendly, casual tone with occasional emojis
- Simplify technical concepts into everyday language
- Offer practical, user-friendly protective measures

PERSONALITY:
- Friendly, approachable, and slightly bubbly
- Speak like a helpful friend, not a technical manual
- Use simple analogies to explain complex air quality concepts
- Show enthusiasm about helping people understand air quality
- Use conversational phrases like "Hey there!" "You know what?" "Guess what?"

KNOWLEDGE:
- AQI scale: 0-50 (Good), 51-100 (Moderate), 101-150 (Unhealthy for Sensitive Groups), 151-200 (Unhealthy), 201-300 (Very Unhealthy), 301+ (Hazardous)
- Common pollutants: PM2.5, PM10, Ozone, NO2, SO2, CO
- Health impacts of different pollutants
- Protective measures for different air quality levels
- Air quality trends and patterns`

    // Add more detailed context information to the system instruction
    if (context) {
      const pollutantInfo = context.pollutants
        ? Object.entries(context.pollutants)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        : "Not available"

      systemInstruction += `

CURRENT AIR QUALITY CONTEXT:
- Location: ${context.location}
- Current AQI: ${context.aqi} (${context.category})
- Main pollutant: ${context.mainPollutant}
- All pollutants: ${pollutantInfo}
- Health implications: ${context.healthImplications}
- Last updated: ${new Date(context.timestamp || Date.now()).toLocaleString()}

When answering questions, reference this current air quality information when relevant. For example, if someone asks about the air quality today or what they should do, mention the current AQI and provide appropriate advice based on the level. If they ask about specific pollutants, provide information about the current levels in their area.`
    }

    // Use provided chat history or create default history
    const history = chatHistory || [
      {
        role: "user",
        parts: [{ text: "Hi, I'd like to learn about air quality." }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Hey there! I'm Breezy, your friendly air quality buddy! 😊 What would you like to know about air quality today? I can tell you about AQI levels, pollutants, or how to protect yourself when the air gets yucky!",
          },
        ],
      },
    ]

    // Set up the chat with specific instructions for response format and tone
    const chat = model.startChat({
      history: history,
      systemInstruction: {
        role: "system",
        parts: [
          {
            text: systemInstruction,
          },
        ],
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    })

    // Send the message and get a response
    const result = await chat.sendMessage(message)
    const text = result.response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
