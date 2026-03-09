'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'

interface LocationContextType {
  currentLocation: string
  coordinates: { lat: number; lon: number } | null
  isDetectingLocation: boolean
  isUsingDefaultLocation: boolean
  isLocationPermissionDenied: boolean
  detectLocation: () => Promise<void>
  setManualLocation: (location: string) => void
  saveLocationPreference: (location: string) => Promise<void>
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

// Default location - Ho Chi Minh City
const DEFAULT_LOCATION = 'Ho Chi Minh City'
const DEFAULT_COORDINATES = { lat: 10.8231, lon: 106.6297 }

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<string>('')
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false)
  const [isUsingDefaultLocation, setIsUsingDefaultLocation] = useState<boolean>(false)
  const [isLocationPermissionDenied, setIsLocationPermissionDenied] = useState<boolean>(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(`/api/geocoding/reverse?lat=${lat}&lon=${lon}`)
      if (!response.ok) throw new Error('Failed to reverse geocode')
      const data = await response.json()
      return data.location || DEFAULT_LOCATION
    } catch (error) {
      console.error('Error reverse geocoding:', error)
      return DEFAULT_LOCATION
    }
  }

  const detectLocation = useCallback(async () => {
    setIsDetectingLocation(true)

    try {
      if (!navigator.geolocation) throw new Error('Geolocation is not supported by your browser')

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        })
      })

      const { latitude, longitude } = position.coords
      const locationName = await reverseGeocode(latitude, longitude)

      setCurrentLocation(locationName)
      setCoordinates({ lat: latitude, lon: longitude })
      setIsUsingDefaultLocation(false)
      setIsLocationPermissionDenied(false)

      if (session?.user) await saveLocationPreference(locationName)

      toast({
        title: 'Location detected',
        description: `Your location has been set to ${locationName}`,
      })
    } catch (error) {
      console.error('Error detecting location:', error)

      if (error instanceof GeolocationPositionError && error.code === error.PERMISSION_DENIED) {
        setIsLocationPermissionDenied(true)
        toast({
          title: 'Location permission denied',
          description: 'Using default location. You can change this in your browser settings.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Location detection failed',
          description: `Using default location: ${DEFAULT_LOCATION}`,
          variant: 'destructive',
        })
      }

      // Fallback to default
      setCurrentLocation(DEFAULT_LOCATION)
      setCoordinates(DEFAULT_COORDINATES)
      setIsUsingDefaultLocation(true)
    } finally {
      setIsDetectingLocation(false)
    }
  }, [session, toast])

  const setManualLocation = (location: string) => {
    setCurrentLocation(location)
    setIsUsingDefaultLocation(false)
  }

  const saveLocationPreference = async (location: string) => {
    if (!session?.user) return
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: { defaultLocation: location } }),
      })
      if (!response.ok) throw new Error('Failed to save location preference')
    } catch (error) {
      console.error('Error saving location preference:', error)
    }
  }

  useEffect(() => {
  const loadLocationPreference = async () => {
    if (!session?.user) return

    // Don't override location if already set (by detection or manually)
    if (currentLocation || coordinates) return

    try {
      const response = await fetch('/api/user/preferences', { cache: 'no-store' })
      if (!response.ok) throw new Error('Failed to fetch user preferences')

      const { preferences } = await response.json()

      if (preferences?.defaultLocation) {
        setCurrentLocation(preferences.defaultLocation)
        setIsUsingDefaultLocation(true)
      } else {
        detectLocation().catch(console.error)
      }
    } catch (error) {
      console.error('Error loading location preference:', error)
      detectLocation().catch(console.error)
    }
  }

  loadLocationPreference()
}, [session, detectLocation, currentLocation, coordinates])

  useEffect(() => {
    if (!session?.user && navigator.geolocation) {
      const hasLocationPermissionDenied =
        localStorage.getItem('locationPermissionDenied') === 'true'
      if (!hasLocationPermissionDenied) {
        detectLocation().catch(console.error)
      } else {
        setIsLocationPermissionDenied(true)
        setCurrentLocation(DEFAULT_LOCATION)
        setCoordinates(DEFAULT_COORDINATES)
        setIsUsingDefaultLocation(true)
      }
    }
  }, [session, detectLocation])

  useEffect(() => {
    if (isLocationPermissionDenied) {
      localStorage.setItem('locationPermissionDenied', 'true')
    }
  }, [isLocationPermissionDenied])

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        coordinates,
        isDetectingLocation,
        isUsingDefaultLocation,
        isLocationPermissionDenied,
        detectLocation,
        setManualLocation,
        saveLocationPreference,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}
