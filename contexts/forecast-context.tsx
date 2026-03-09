// forecast-context.tsx

'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Forecast } from '@/lib/types'
import { useLocation } from '@/contexts/location-context'
import { useToast } from '@/hooks/use-toast'

interface ForecastContextType {
  forecastData: Forecast | null
  isLoading: boolean
  refreshForecast: (location?: string) => Promise<void>
}

const ForecastContext = createContext<ForecastContextType | undefined>(undefined)

export function ForecastProvider({ children }: { children: ReactNode }) {
  const [forecastData, setForecastData] = useState<Forecast | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { currentLocation, coordinates } = useLocation()
  const { toast } = useToast()

  const refreshForecast = useCallback(
    async (location?: string) => {
      setIsLoading(true)
      try {
        let url = '/api/forecast'

        if (coordinates?.lat && coordinates?.lon) {
          url += `?lat=${coordinates.lat}&lon=${coordinates.lon}`
        } else if (location || currentLocation) {
          const loc = location || currentLocation
          url += `?location=${encodeURIComponent(loc)}`
        } else {
          throw new Error('No location or coordinates provided')
        }

        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch forecast data')

        const data = await response.json()
        setForecastData(data)
      } catch (error) {
        console.error('Error fetching forecast data:', error)
        toast({
          title: 'Forecast unavailable',
          description: "We couldn't fetch the air quality forecast right now.",
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [currentLocation, coordinates, toast],
  )

  useEffect(() => {
    if (currentLocation) {
      refreshForecast()
    }
  }, [currentLocation, refreshForecast])

  return (
    <ForecastContext.Provider value={{ forecastData, isLoading, refreshForecast }}>
      {children}
    </ForecastContext.Provider>
  )
}

export function useForecast() {
  const context = useContext(ForecastContext)
  if (context === undefined) {
    throw new Error('useForecast must be used within a ForecastProvider')
  }
  return context
}
