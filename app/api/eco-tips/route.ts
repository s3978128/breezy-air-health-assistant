import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { v4 as uuidv4 } from 'uuid'
import { auth } from '@/auth'
import type { EcoTip } from '@/lib/types'

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Sample eco-tips for fallback
const fallbackTips: Record<string, string[]> = {
  good: [
    'Take advantage of the good air quality today by walking or biking instead of driving.',
    'Open your windows to let in fresh air and reduce indoor air pollution.',
    'Plant a tree or start a garden to help maintain good air quality in your area.',
    'Consider using a push mower instead of a gas-powered one for lawn maintenance.',
    'Start a compost bin to reduce waste and create natural fertilizer for plants.',
  ],
  moderate: [
    'Combine errands to reduce driving time and emissions.',
    'Consider using public transportation or carpooling to reduce vehicle emissions.',
    'Avoid idling your vehicle for more than 30 seconds to reduce unnecessary pollution.',
    'Use energy-efficient appliances to reduce power plant emissions.',
    'Opt for natural cleaning products to reduce indoor air pollution.',
  ],
  unhealthy: [
    'Postpone outdoor burning activities to avoid adding to air pollution.',
    'Work from home if possible to reduce commuting emissions.',
    'Use a HEPA air purifier in your home to improve indoor air quality.',
    'Reduce electricity usage during peak hours to lower power plant emissions.',
    'Choose products with minimal packaging to reduce waste incineration.',
  ],
  'very-unhealthy': [
    'Avoid using gas-powered lawn equipment and opt for electric or manual alternatives.',
    'Seal gaps around windows and doors to prevent outdoor pollutants from entering.',
    'Reduce meat consumption, as livestock production contributes to air pollution.',
    'Use public transportation or carpool to reduce the number of vehicles on the road.',
    'Support clean air policies and regulations in your community.',
  ],
  hazardous: [
    'Stay indoors and use air purifiers with HEPA filters to maintain clean indoor air.',
    'Avoid burning candles or using wood-burning fireplaces which can worsen indoor air quality.',
    'Consider installing solar panels to reduce reliance on fossil fuel energy.',
    'Use smart thermostats to optimize energy usage and reduce emissions.',
    'Support local initiatives for cleaner air and environmental protection.',
  ],
}

// In-memory cache to avoid duplicates (for now)
const recentTips: string[] = []

// Dynamic prompt templates
const promptTemplates = [
  `You're a cheerful eco-assistant! Suggest one quirky but practical pollution-reducing tip for a day with "{aqiLevel}" air quality. Be playful and clear—think helpful sidekick energy. Add a dash of humor or emoji if it fits. Stay under 800 characters. No generic advice. No markdown, lists, headings, or quotes.`,

  `Act like a fun and helpful environmental buddy. Give one creative, non-obvious action someone can take when the air quality is "{aqiLevel}". Keep it short, real, and maybe even make them smile 😊. Tip must reduce pollution. Under 800 characters. No generic tips. No formatting like markdown or lists.`,

  `You're a smart, upbeat AI assistant who loves clean air and corny jokes. Share a single, fresh eco-friendly idea for someone on a "{aqiLevel}" air quality day. Keep it light, pollution-reducing, and to the point (max 800 characters). Be friendly, avoid generic advice or formatting fluff.`,

  `Imagine you're texting a friend to help them do one cool, pollution-reducing thing today. Air quality is "{aqiLevel}". What’s a clever tip you’d send that’s useful, surprising, and makes them grin? Stay under 800 characters. No markdown. No lists. No quotes. No headings.`,

  `You're a peppy AI giving one helpful and unexpected eco-tip to someone living through a "{aqiLevel}" AQI day. Be energetic and witty if it suits, but keep it real and actionable. Pollution-reducing only! Tip must be under 800 characters. No markdown, no formatting extras.`,

  `You're an environmental cheerleader 🤸. Give a practical, smile-worthy tip that helps someone reduce pollution during a "{aqiLevel}" air quality day. Avoid common suggestions. Keep it short and helpful (max 800 characters). No formatting tricks—just the tip.`,

  `Pretend you're writing an eco-tip on a post-it note for someone dealing with "{aqiLevel}" air quality. Be lively, clever, and offer something they haven't heard a thousand times. Keep it practical, friendly, and under 800 characters. Absolutely no formatting.`,

  `You’re the happy AI sidekick of a climate-conscious hero. Give one useful and fun tip they can actually do when the AQI is "{aqiLevel}". Bonus if it’s surprising or punny. Must help reduce pollution. Keep it short (800 characters), plain-text only.`,

  `Craft a pollution-fighting eco-tip for someone living through a "{aqiLevel}" air day. Be as upbeat as a squirrel on cold brew ☀️. The tip must be practical, clever, and under 800 characters. No markdown, quotes, or lists—just the tip.`,

  `As a perky AI pal, give one non-generic, action-ready eco-tip for someone dealing with "{aqiLevel}" air quality. Keep it fresh, light, and under 800 characters. Don’t use formatting or citations—just one honest, cheerful, pollution-reducing idea.`,
]

function cleanTipText(text: string): string {
  return text.replace(/\*/g, '').trim()
}

function getRandomPrompt(aqiLevel: string) {
  const template = promptTemplates[Math.floor(Math.random() * promptTemplates.length)]
  return template.replace('{aqiLevel}', aqiLevel)
}

function isDuplicateTip(tip: string) {
  return recentTips.some((prev) => tip.includes(prev) || prev.includes(tip))
  // Optionally: fuzzy check with Levenshtein
  // return recentTips.some(prev => distance(tip, prev) < 20)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const aqiLevel = searchParams.get('aqiLevel') || 'good'

  try {
    const session = await auth()
    const userId = session?.user?.id

    let tipContent: string

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
      let attempt = 0
      let success = false
      while (attempt < 1 && !success) {
        const prompt = getRandomPrompt(aqiLevel)
        const result = await model.generateContent(prompt)
        const raw = result.response.text()
        const generated = cleanTipText(raw)

        if (!isDuplicateTip(generated)) {
          tipContent = generated
          recentTips.push(generated)
          if (recentTips.length > 10) recentTips.shift() // Keep cache small
          success = true
        } else {
          attempt++
        }
      }

      if (!success) {
        // All generated tips were too similar
        const fallback = fallbackTips[aqiLevel as keyof typeof fallbackTips] || fallbackTips.good
        tipContent = fallback[Math.floor(Math.random() * fallback.length)]
      }
    } catch (error) {
      console.error('Error generating eco-tip:', error)
      const fallback = fallbackTips[aqiLevel as keyof typeof fallbackTips] || fallbackTips.good
      tipContent = fallback[Math.floor(Math.random() * fallback.length)]
    }

    const ecoTip: EcoTip = {
      id: uuidv4(),
      content: tipContent!,
      aqiLevel: aqiLevel as any,
      createdAt: new Date().toISOString(),
      isRead: false,
      source: 'ai-generated',
    }

    return NextResponse.json({ tip: ecoTip })
  } catch (error) {
    console.error('Error in eco-tips API:', error)
    return NextResponse.json({ error: 'Failed to generate eco-tip' }, { status: 500 })
  }
}
