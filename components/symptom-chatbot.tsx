'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Loader2, X } from 'lucide-react'
import { useAirQuality } from '@/contexts/air-quality-context'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import LoginPrompt from '@/components/login-prompt'
import { useSession } from 'next-auth/react'
import { useSymptomTracking } from '@/contexts/symptom-tracking-context'
import { useRef } from 'react'

export default function SymptomChatbot() {
  const {
    selectedSymptoms,
    setShowSymptomChatbot,
    symptomResponse,
    setSymptomResponse,
    isAnalyzing,
    setIsAnalyzing,
    hasAnalyzed,
    setHasAnalyzed,
    symptomError,
    setSymptomError,
  } = useSymptomTracking()
  const { airQualityData } = useAirQuality()
  const { data: session } = useSession()
  const hasTriggeredAnalysis = useRef(false)

  const [lastAnalyzedSymptoms, setLastAnalyzedSymptoms] = useState<string[]>([])

  useEffect(() => {
    if (
      selectedSymptoms.length > 0 &&
      !hasTriggeredAnalysis.current &&
      !hasAnalyzed &&
      !symptomResponse
    ) {
      hasTriggeredAnalysis.current = true
      generateResponse()
    }
  }, [selectedSymptoms, hasAnalyzed, symptomResponse])

  const generateResponse = async () => {
    if (selectedSymptoms.length === 0) return

    setIsAnalyzing(true)
    setSymptomError(null)
    setSymptomResponse('')
    setHasAnalyzed(true)

    try {
      const prompt = constructPrompt(selectedSymptoms, airQualityData)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          context: {
            location: airQualityData?.location || 'unknown location',
            aqi: airQualityData?.aqi || 0,
            category: airQualityData?.category || 'unknown',
            mainPollutant: airQualityData?.mainPollutant || 'unknown',
            healthImplications: airQualityData?.healthImplications || '',
            pollutants: airQualityData?.pollutants || {},
            timestamp: airQualityData?.timestamp || new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate response')
      }

      const data = await response.json()
      setSymptomResponse(cleanResponseMarkdown(data.response))
      setLastAnalyzedSymptoms([...selectedSymptoms])
    } catch (err) {
      console.error('Error generating symptom explanation:', err)
      setSymptomError(
        "Sorry, I couldn't generate an explanation right now. Please try again later.",
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  const constructPrompt = (symptoms: string[], airQualityData: any) => {
    const symptomsText = symptoms.join(', ')
    const aqi = airQualityData?.aqi || 'unknown'
    const category = airQualityData?.category || 'unknown'
    const mainPollutant = airQualityData?.mainPollutant || 'unknown'

    return `I'm experiencing the following symptoms: ${symptomsText}. The current air quality index (AQI) is ${aqi} (${category}) with ${mainPollutant} as the main pollutant. Could you explain how these symptoms might be related to air quality, what I should do about them, and when I should consider seeing a doctor? Please provide clear, actionable advice.`
  }

  const cleanResponseMarkdown = (text: string) => {
    return text.replace(/[*_`]/g, '')
  }

  const haveSymptomsChanged = () => {
    if (selectedSymptoms.length !== lastAnalyzedSymptoms.length) return true
    return selectedSymptoms.some((symptom) => !lastAnalyzedSymptoms.includes(symptom))
  }

  return (
    <Card className="w-full mt-4 border-sky-200 shadow-md">
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium">Selected Symptoms:</h3>
          <div className="flex items-center gap-2">
            {hasAnalyzed && session?.user && (
              <Button
                variant="default"
                size="sm"
                onClick={generateResponse}
                disabled={isAnalyzing || !haveSymptomsChanged()}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze'
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowSymptomChatbot(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {selectedSymptoms.map((symptom, index) => (
            <Badge key={index} variant="secondary">
              {symptom}
            </Badge>
          ))}
        </div>

        <Separator className="my-3" />

        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 text-sky-600 animate-spin mb-2" />
            <p className="text-sm text-gray-600">Analyzing your symptoms...</p>
          </div>
        ) : symptomError ? (
          <div className="bg-red-50 p-3 rounded-md text-sm text-red-800">
            <p>{symptomError}</p>
          </div>
        ) : symptomResponse ? (
          <div className="text-sm space-y-3">
            <div className="bg-sky-50 p-3 rounded-md">
              <p className="text-sky-800 whitespace-pre-line">{symptomResponse}</p>
            </div>

            <div className="bg-amber-50 p-3 rounded-md">
              <p className="text-amber-800 text-xs font-medium mb-1">Important Note:</p>
              <p className="text-amber-800 text-xs">
                This information is for educational purposes only and is not a substitute for
                professional medical advice. If symptoms are severe or persistent, please consult a
                healthcare professional.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-sm text-gray-600">No symptoms analyzed yet.</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-0"></CardFooter>
    </Card>
  )
}
