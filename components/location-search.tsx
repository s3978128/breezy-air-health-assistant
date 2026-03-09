'use client'

import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { MapPin } from 'lucide-react'
import { useAirQuality } from '@/contexts/air-quality-context'
import { useLocation } from '@/contexts/location-context'
import { useSession } from 'next-auth/react'
import SearchResultCard from '@/components/search-result-card'
import { AirQualityData } from '@/lib/types'

interface LocationSearchProps {
  location: string
  setLocation: React.Dispatch<React.SetStateAction<string>>
  searchResult: AirQualityData | null
  setSearchResult: React.Dispatch<React.SetStateAction<AirQualityData | null>>
}

export default function LocationSearch({
  location,
  setLocation,
  searchResult,
  setSearchResult,
}: LocationSearchProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const skipSuggestionFetch = useRef(false)
  const lastSelectedRef = useRef<string | null>(null)

  const { setUserLocation, refreshData } = useAirQuality()
  const { setManualLocation, saveLocationPreference } = useLocation()
  const { data: session } = useSession()

  // Fetch suggestions
  useEffect(() => {
    if (skipSuggestionFetch.current) {
      skipSuggestionFetch.current = false
      return
    }

    const fetchSuggestions = async () => {
      if (location.trim().length < 2) {
        setSuggestions([])
        return
      }

      try {
        const res = await fetch(`/api/geocoding/search?q=${encodeURIComponent(location.trim())}`)
        const data = await res.json()
        if (data?.suggestions) {
          setSuggestions(data.suggestions)
        } else {
          setSuggestions([])
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err)
        setSuggestions([])
      }
    }

    const timeout = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timeout)
  }, [location])

  // Search and preview location
  const searchLocation = async (loc: string) => {
    setIsSearching(true)
    setError('')
    setSuggestions([])
    setSearchResult(null)

    try {
      const res = await fetch(`/api/air-quality?location=${encodeURIComponent(loc)}`)
      if (!res.ok) throw new Error('No data')

      const data = await res.json()
      setSearchResult(data)
    } catch (error) {
      console.error('Error searching location:', error)
      setError('Could not find air quality data for this location. Please try another city.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelect = (value: string) => {
    skipSuggestionFetch.current = true
    lastSelectedRef.current = value
    setLocation(value)
    setSuggestions([])
    setError('')
    searchLocation(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const match = suggestions.find((s) => s.toLowerCase() === location.toLowerCase())

      if (match) {
        handleSelect(match)
      } else if (lastSelectedRef.current?.toLowerCase() === location.toLowerCase()) {
        // Do nothing, valid previous selection
      } else {
        setError('Please enter and select a valid location from the list.')
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSuggestions([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="mb-6" ref={wrapperRef}>
      <h2 className="text-xl font-semibold text-sky-700 mb-3">Check Air Quality</h2>
      <div className="relative flex space-x-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            className="pl-9"
            type="text"
            placeholder="Enter city name..."
            value={location}
            onChange={(e) => {
              setLocation(e.target.value)
              setError('')
            }}
            onKeyDown={handleKeyDown}
          />
          {(suggestions.length > 0 || error) && (
            <ul className="absolute z-10 w-full bg-white border border-sky-200 mt-1 rounded-md shadow-md max-h-56 overflow-y-auto text-sm">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSelect(s)}
                  className="px-3 py-2 cursor-pointer hover:bg-sky-100"
                >
                  {s}
                </li>
              ))}
              {suggestions.length === 0 && error && (
                <li className="px-3 py-2 text-red-600 cursor-default">{error}</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {searchResult && (
        <SearchResultCard
          data={searchResult}
          onApply={() => {
            setUserLocation(searchResult.city)
            setManualLocation(searchResult.city)
            refreshData(searchResult.city)
            setSearchResult(null)
            lastSelectedRef.current = searchResult.city
          }}
          onDismiss={() => setSearchResult(null)}
        />
      )}
    </div>
  )
}
