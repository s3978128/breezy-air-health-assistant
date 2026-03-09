'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import type { UserPreferences } from '@/lib/types'

interface UserPreferencesContextType {
  preferences: UserPreferences | null
  isLoading: boolean
  refreshPreferences: () => Promise<void>
  hasPreferencesChanged: boolean
  setHasPreferencesChanged: (value: boolean) => void
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined)

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasPreferencesChanged, setHasPreferencesChanged] = useState(false)

  const refreshPreferences = async () => {
    if (!session?.user) {
      setPreferences(null)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/user/preferences', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      })

      if (response.ok) {
        const data = await response.json()
        setPreferences(data.preferences)
      } else {
        console.error('Failed to fetch user preferences')
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error)
    } finally {
      setIsLoading(false)
      setHasPreferencesChanged(false)
    }
  }

  // Initial load of preferences
  useEffect(() => {
    refreshPreferences()
  }, [session])

  // Refresh when preferences have changed
  useEffect(() => {
    if (hasPreferencesChanged) {
      refreshPreferences()
    }
  }, [hasPreferencesChanged])

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        isLoading,
        refreshPreferences,
        hasPreferencesChanged,
        setHasPreferencesChanged,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext)
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider')
  }
  return context
}
