'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Sparkles, AlertCircle, Loader2, MessageSquare } from 'lucide-react'
import { useAirQuality } from '@/contexts/air-quality-context'
import { getPollutantName, getPollutantUnit } from '@/utils/air-quality-data'
import { getPollutantCategory } from '@/utils/air-quality-data'
import { useAi } from '@/contexts/ai-context'

interface ExplainFeatureProps {
  type: 'aqi' | 'pollutant' | 'health'
  pollutantId?: string
  pollutantValue?: number
  variant?: 'button' | 'icon' | 'minimal'
  className?: string
}

// Create a custom event to open the enhanced chat
const openEnhancedChatEvent = new CustomEvent('openEnhancedChat')

export default function ExplainFeature({
  type,
  pollutantId,
  pollutantValue,
  variant = 'minimal',
  className = '',
}: ExplainFeatureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { airQualityData } = useAirQuality()
  const { addMessage } = useAi()

  const handleExplain = async () => {
    setIsOpen(true)
    setIsLoading(true)

    try {
      let prompt = ''
      let explainTopic = ''

      if (type === 'aqi' && airQualityData) {
        explainTopic = `AQI of ${airQualityData.aqi} in ${airQualityData.location}`
        const pollutantInfo = airQualityData.pollutants
          ? Object.entries(airQualityData.pollutants)
              .map(([key, value]) => `${getPollutantName(key)}: ${value} ${getPollutantUnit(key)}`)
              .join(', ')
          : 'not available'

        prompt = `Give a clear and friendly explanation of the current Air Quality Index (AQI) of ${airQualityData.aqi} (${airQualityData.category}) in ${airQualityData.location}. Break the explanation into these sections with line breaks between them:
  - What it means
  - Who is affected
  - Main pollutants detected (${pollutantInfo})
  - Simple safety tips
  
  Always start with a greeting, then each sections will have the header in a paragraph and the explanation under it. Keep the tone conversational and under 150 words. Use this tone: bubbly, like a cheerful weather app, with a light emoji sprinkle (but not too much, 1-2)! Keep it clear and under 150 words. Don't use asterisks or list numbers, just clear headings and short paragraphs.`
      } else if (type === 'pollutant' && pollutantId && pollutantValue !== undefined) {
        const pollutantName = getPollutantName(pollutantId)
        const pollutantUnit = getPollutantUnit(pollutantId)
        const { category } = getPollutantCategory(pollutantId, pollutantValue)
        explainTopic = `${pollutantName} at ${pollutantValue} ${pollutantUnit}`

        prompt = `Give a clear and friendly explanation of what ${pollutantName} at ${pollutantValue} ${pollutantUnit} (${category}) means in ${airQualityData?.location || 'this area'}. Break it into these sections with line breaks between them:
  - What it is
  - Is this level good or bad?
  - Health effects
  - Safety tips
  
  Always start with a greeting, then each sections will have the header in a paragraph and the explanation under it. Keep the tone conversational and under 150 words. Use this tone: bubbly, like a cheerful weather app, with a light emoji sprinkle (but not too much, 1-2)! Keep it clear and under 150 words. Avoid asterisks and numbered lists. Use short headings and friendly language.`
      } else if (type === 'health' && airQualityData) {
        explainTopic = `Health risks at AQI ${airQualityData.aqi} in ${airQualityData.location}`

        prompt = `Explain how AQI ${airQualityData.aqi} (${airQualityData.category}) in ${airQualityData.location} may affect people's health. Break it into these sections:
  - Risk overview
  - Groups at higher risk
  - Symptoms to watch for
  - Practical tips
  
  Always start with a greeting, then each sections will have the header in a paragraph and the explanation under it. Make the tone simple, friendly, and helpful. Use this tone: bubbly, like a cheerful weather app, with a light emoji sprinkle (but not too much, 1-2)! Keep it clear and under 150 words. Avoid technical jargon. Format the response with clear line breaks and short paragraphs for readability.`
      }

      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) throw new Error('Failed to get explanation')

      const data = await response.json()
      const cleanExplanation = removeAsterisks(data.explanation.trim())

      setExplanation(cleanExplanation)

      addMessage({
        role: 'user',
        content: `Can you explain about ${explainTopic}?`,
        source: 'explanation',
      })

      addMessage({
        role: 'model',
        content: cleanExplanation,
        source: 'explanation',
      })
    } catch (error) {
      console.error('Error getting explanation:', error)
      setExplanation("Sorry, I couldn't generate an explanation right now. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to continue the conversation in the enhanced chat
  const handleContinueInChat = () => {
    setIsOpen(false)
    // Dispatch the custom event to open the enhanced chat
    document.dispatchEvent(openEnhancedChatEvent)
  }

  // Render different button variants
  const renderButton = () => {
    if (variant === 'button') {
      return (
        <Button
          onClick={handleExplain}
          size="sm"
          className={`gap-1 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white ${className}`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Explain</span>
        </Button>
      )
    } else if (variant === 'icon') {
      return (
        <Button
          onClick={handleExplain}
          variant="outline"
          size="sm"
          className={`h-8 gap-1 border-sky-200 bg-gradient-to-r from-sky-50 to-sky-100 text-sky-700 hover:from-sky-100 hover:to-sky-200 shadow-sm ${className}`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Explain</span>
        </Button>
      )
    } else {
      // Minimal version - just the icon with a pulse animation
      return (
        <button
          onClick={handleExplain}
          className={`inline-flex items-center justify-center rounded-full w-6 h-6 bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700 transition-colors shadow-sm relative ${className}`}
          title="Get AI explanation"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span
            className="absolute inset-0 rounded-full animate-ping bg-sky-400 opacity-75"
            style={{ animationDuration: '3s' }}
          ></span>
          <span className="sr-only">Get AI explanation</span>
        </button>
      )
    }
  }

  function removeAsterisks(text: string): string {
    return text.replace(/\*/g, '')
  }

  return (
    <>
      {renderButton()}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-white to-sky-50 shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-sky-800">
              <Sparkles className="h-5 w-5 text-sky-500" />
              {type === 'aqi'
                ? "Air Quality: Let's Break It Down!"
                : type === 'pollutant'
                  ? 'Pollutant Peek'
                  : 'Health Tips'}
            </DialogTitle>
            <DialogDescription className="text-sm text-sky-700">
              {type === 'aqi'
                ? `What's up with AQI ${airQualityData?.aqi} in ${airQualityData?.location}?`
                : type === 'pollutant'
                  ? `${getPollutantName(pollutantId || '')} at ${Math.round((pollutantValue || 0) * 10) / 10} ${getPollutantUnit(pollutantId || '')} — here's what that means!`
                  : `How AQI ${airQualityData?.aqi} might affect your health in ${airQualityData?.location}`}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-4 text-sm text-gray-800 leading-relaxed">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-sky-600">
                <Loader2 className="h-6 w-6 animate-spin mb-2" />
                <p>Cooking up an explanation for you...</p>
              </div>
            ) : (
              <>
                {explanation ? (
                  <div className="rounded-lg bg-white/70 p-3 max-h-[45vh] overflow-y-auto shadow-inner whitespace-pre-wrap border border-sky-100">
                    {explanation
                      .split('\n')
                      .filter((line) => line.trim() !== '')
                      .map((line, index) => {
                        const isTitle =
                          (index % 2 !== 0)

                        return (
                          <p
                            key={index}
                            className={`${
                              isTitle ? 'font-semibold text-sky-800' : 'text-700'
                            } ${index !== 0 ? 'mt-2' : ''}`}
                          >
                            {line}
                          </p>
                        )
                      })}

                    <p className="text-xs text-gray-500 mt-2">
                      (If you want to know more, just ask Breezy in the chat!)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-700 bg-amber-100 p-3 rounded-md border border-amber-200">
                    <AlertCircle className="h-5 w-5" />
                    <p>Oops! Couldn't explain that just now. Try again later?</p>
                  </div>
                )}

                {explanation && (
                  <Button
                    onClick={handleContinueInChat}
                    variant="outline"
                    className="w-full gap-2 border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800"
                  >
                    <MessageSquare className="h-4 w-4 text-sky-600" />
                    <span>Chat more with Breezy</span>
                  </Button>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
