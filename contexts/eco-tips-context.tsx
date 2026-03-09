'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useAirQuality } from '@/contexts/air-quality-context'
import { useSession } from 'next-auth/react'
import type { EcoTip } from '@/lib/types'

interface EcoTipsContextType {
  currentTip: EcoTip | null
  isLoading: boolean
  refreshTip: () => Promise<void>
}

const EcoTipsContext = createContext<EcoTipsContextType | undefined>(undefined)

export function EcoTipsProvider({ children }: { children: ReactNode }) {
  const [currentTip, setCurrentTip] = useState<EcoTip | null>(null)
  const [tipHistory, setTipHistory] = useState<EcoTip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  const { airQualityData } = useAirQuality()
  const { data: session } = useSession()

  const getAqiLevel = (
    aqi: number,
  ): 'good' | 'moderate' | 'unhealthy' | 'very-unhealthy' | 'hazardous' => {
    if (aqi <= 50) return 'good'
    if (aqi <= 100) return 'moderate'
    if (aqi <= 150) return 'unhealthy'
    if (aqi <= 300) return 'very-unhealthy'
    return 'hazardous'
  }

  const refreshTip = useCallback(async () => {
    if (!airQualityData || isFetching) return

    setIsFetching(true)
    setIsLoading(true)

    try {
      const aqiLevel = getAqiLevel(airQualityData.aqi)
      const response = await fetch(`/api/eco-tips?aqiLevel=${aqiLevel}`)

      if (!response.ok) {
        throw new Error('Failed to fetch eco-tip')
      }

      const data = await response.json()
      if (data.tip) {
        setCurrentTip(data.tip)
        setTipHistory((prev) => [data.tip, ...prev])
      }
    } catch (error) {
      console.error('Error fetching eco-tip:', error)
    } finally {
      setIsFetching(false)
      setIsLoading(false)
    }
  }, [airQualityData, isFetching])

  // Fetch tip on initial load or if AQI level changes
  useEffect(() => {
    if (!airQualityData) return

    const currentAqiLevel = getAqiLevel(airQualityData.aqi)

    if (!currentTip || (currentTip.aqiLevel !== 'all' && currentTip.aqiLevel !== currentAqiLevel)) {
      refreshTip()
    }
  }, [airQualityData, currentTip, refreshTip])

  return (
    <EcoTipsContext.Provider
      value={{
        currentTip,
        isLoading,
        refreshTip,
      }}
    >
      {children}
    </EcoTipsContext.Provider>
  )
}

export function useEcoTips() {
  const context = useContext(EcoTipsContext)
  if (context === undefined) {
    throw new Error('useEcoTips must be used within an EcoTipsProvider')
  }
  return context
}
