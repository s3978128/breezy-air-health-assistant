'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useAirQuality } from '@/contexts/air-quality-context'
import { getAqiRelatedSymptoms } from '@/lib/get-aqi-symptoms'

interface SymptomTrackingContextType {
  checkedSymptoms: { [key: string]: boolean }
  setCheckedSymptoms: (symptoms: { [key: string]: boolean }) => void
  selectedSymptoms: string[]
  showSymptomChatbot: boolean
  setShowSymptomChatbot: (show: boolean) => void
  symptomResponse: string
  setSymptomResponse: (response: string) => void
  isAnalyzing: boolean
  setIsAnalyzing: (isAnalyzing: boolean) => void
  hasAnalyzed: boolean
  setHasAnalyzed: (hasAnalyzed: boolean) => void
  clearSymptoms: () => void
  availableSymptoms: string[]
  symptomError: string | null
  setSymptomError: (error: string | null) => void
}

const SymptomTrackingContext = createContext<SymptomTrackingContextType | undefined>(undefined)

export function SymptomTrackingProvider({ children }: { children: ReactNode }) {
  const [checkedSymptoms, setCheckedSymptoms] = useState<{ [key: string]: boolean }>({})
  const [showSymptomChatbot, setShowSymptomChatbot] = useState(false)
  const [symptomResponse, setSymptomResponse] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [availableSymptoms, setAvailableSymptoms] = useState<string[]>([])
  const [symptomError, setSymptomError] = useState<string | null>(null)
  const { airQualityData } = useAirQuality()

  // Update available symptoms when AQI changes
  useEffect(() => {
    if (airQualityData) {
      const newAqi = airQualityData.aqi
      const symptoms = getAqiRelatedSymptoms(newAqi)
      setAvailableSymptoms(symptoms)

      // Filter out symptoms that are no longer relevant
      setCheckedSymptoms((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((symptom) => {
          if (!symptoms.includes(symptom)) {
            delete updated[symptom]
          }
        })
        return updated
      })

      // If all checked symptoms are gone, reset the chatbot
      if (Object.keys(checkedSymptoms).length === 0) {
        setShowSymptomChatbot(false)
        setSymptomResponse('')
        setHasAnalyzed(false)
      }
    }
  }, [airQualityData])

  // Compute selected symptoms
  const selectedSymptoms = Object.entries(checkedSymptoms)
    .filter(([_, isChecked]) => isChecked)
    .map(([symptom]) => symptom)

  // Clear all symptoms
  const clearSymptoms = () => {
    setCheckedSymptoms({})
    setShowSymptomChatbot(false)
    setSymptomResponse('')
    setHasAnalyzed(false)
    setSymptomError(null)
  }

  return (
    <SymptomTrackingContext.Provider
      value={{
        checkedSymptoms,
        setCheckedSymptoms,
        selectedSymptoms,
        showSymptomChatbot,
        setShowSymptomChatbot,
        symptomResponse,
        setSymptomResponse,
        isAnalyzing,
        setIsAnalyzing,
        hasAnalyzed,
        setHasAnalyzed,
        clearSymptoms,
        availableSymptoms,
        symptomError,
        setSymptomError,
      }}
    >
      {children}
    </SymptomTrackingContext.Provider>
  )
}

export function useSymptomTracking() {
  const context = useContext(SymptomTrackingContext)
  if (context === undefined) {
    throw new Error('useSymptomTracking must be used within a SymptomTrackingProvider')
  }
  return context
}
