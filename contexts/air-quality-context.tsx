'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { AirQualityData } from '@/utils/air-quality-data'
import { useLocation } from '@/contexts/location-context'
import { useToast } from '@/hooks/use-toast'

interface AirQualityContextType {
  airQualityData: AirQualityData | null
  isLoading: boolean
  refreshData: (location?: string) => Promise<void>
  setUserLocation: (location: string) => void
  userLocation: string
  isUsingDetectedLocation: boolean
}

const AirQualityContext = createContext<AirQualityContextType | undefined>(undefined)

export function AirQualityProvider({ children }: { children: ReactNode }) {
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocationState] = useState('')
  const [isUsingDetectedLocation, setIsUsingDetectedLocation] = useState(true)
  const { currentLocation, coordinates, isDetectingLocation } = useLocation()
  const { toast } = useToast()

  // Whenever detected location changes and we're using it, update and refresh
  useEffect(() => {
    if (currentLocation && isUsingDetectedLocation) {
      setUserLocationState(currentLocation)
      refreshData(currentLocation)
    }
  }, [currentLocation, isUsingDetectedLocation])

  const refreshData = useCallback(
  async (location?: string) => {
    setIsLoading(true)
    try {
      const queryParams: string[] = []

      // Use explicit location if provided, otherwise fallback to userLocation
      if (location || userLocation) {
        const locationToUse = location || userLocation
        if (locationToUse.trim()) {
          queryParams.push(`location=${encodeURIComponent(locationToUse)}`)
        }
      } else if (currentLocation && isUsingDetectedLocation) {
        queryParams.push(`location=${encodeURIComponent(currentLocation)}`)
      }

      if (coordinates?.lat && coordinates?.lon) {
        queryParams.push(`lat=${coordinates.lat}`, `lon=${coordinates.lon}`)
      }

      let url = '/api/air-quality'
      if (queryParams.length > 0) {
        url += '?' + queryParams.join('&')
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch air quality data')
      }

      const data = await response.json()
      setAirQualityData(data)
    } catch (error) {
      console.error('Error fetching air quality data:', error)
    } finally {
      setIsLoading(false)
    }
  },
  [userLocation, currentLocation, coordinates, isUsingDetectedLocation, toast]
)


  // Manual location setter (no longer resets automatically)
  const setManualUserLocation = (location: string) => {
    setUserLocationState(location)
    setIsUsingDetectedLocation(false)
    refreshData(location)
  }

  // Initial and interval-based fetch
  useEffect(() => {
    // Only trigger when location is known (not detecting) and we’re using it
    if (!isDetectingLocation && (userLocation || currentLocation)) {
      refreshData()
    }

    const intervalId = setInterval(
      () => {
        if (!isDetectingLocation && (userLocation || currentLocation)) {
          refreshData()
        }
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(intervalId)
  }, [userLocation, currentLocation, isDetectingLocation, refreshData])

  return (
    <AirQualityContext.Provider
      value={{
        airQualityData,
        isLoading,
        refreshData,
        userLocation: userLocation || currentLocation,
        setUserLocation: setManualUserLocation,
        isUsingDetectedLocation,
      }}
    >
      {children}
    </AirQualityContext.Provider>
  )
}

export function useAirQuality() {
  const context = useContext(AirQualityContext)
  if (!context) {
    throw new Error('useAirQuality must be used within an AirQualityProvider')
  }
  return context
}
