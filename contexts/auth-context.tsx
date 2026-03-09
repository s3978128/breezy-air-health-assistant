'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react'
import { Games, NotificationSettings, Questions, User, UserPreferences } from '@/lib/types'
interface ModalState {
  login: boolean
  register: boolean
  notifications: boolean
  preferences: boolean
  changePassword: boolean
  deleteAccount: boolean
  information: boolean
}

interface AuthContextType {
  userId: string | null
  userName: string | null | undefined
  isAuthenticated: boolean
  isUserExisted: (email: string, provider: string) => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  changePassword: (
    email: string,
    password: string,
    code: string,
    verification: { uuid: string; expires: number },
  ) => Promise<boolean>
  updateInformation: (name: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  deleteAccount: () => Promise<void>
  getUser: (id: string) => Promise<User | null>
  loading: boolean
  open: ModalState
  setOpen: React.Dispatch<React.SetStateAction<ModalState>>

  preferences: UserPreferences | null
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences | null>>
  updatePreferences: (data: UserPreferences) => Promise<boolean>

  notifications: NotificationSettings | null
  setNotifications: React.Dispatch<React.SetStateAction<NotificationSettings | null>>
  updateNotifications: (data: NotificationSettings) => Promise<boolean>

  games: Games | null
  setGames: React.Dispatch<React.SetStateAction<Games | null>>
  updateGames: (data: Games) => Promise<boolean>
  questions: Questions[] | null
  setQuestions: React.Dispatch<React.SetStateAction<Questions[] | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession()
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null | undefined>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [open, setOpen] = useState<ModalState>({
    login: false,
    register: false,
    notifications: false,
    preferences: false,
    changePassword: false,
    deleteAccount: false,
    information: false,
  })
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [notifications, setNotifications] = useState<NotificationSettings | null>(null)
  const [games, setGames] = useState<Games | null>(null)
  const [questions, setQuestions] = useState<Questions[] | null>(null)

  useEffect(() => {
    setLoading(status === 'loading')
    if (status === 'authenticated' && session?.user?.id) {
      setUserId(session.user.id)
      setUserName(session.user.name || '')
      setIsAuthenticated(true)
      fetchPreferences()
      fetchNotifications()
      fetchGames()
    } else {
      setUserId(null)
      setUserName(null)
      setIsAuthenticated(false)
    }
  }, [session, status])

  const isUserExisted = async (email: string, provider: string): Promise<boolean> => {
    const res = await fetch('api/user/userExists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        provider: 'credentials',
      }),
    })

    const { user } = await res.json()
    if (user) return true
    return false
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await nextAuthSignIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (!res?.error) {
      await update()
      return true
    } else {
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const res = await fetch('api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })

    if (res?.ok) {
      const isRegister = await login(email, password)
      return isRegister
    }
    return false
  }

  const changePassword = async (
    email: string,
    password: string,
    code: string,
    verification: { uuid: string; expires: number },
  ): Promise<boolean> => {
    const res = await fetch('api/user/changePassword', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        code,
        verification,
      }),
    })

    if (res.ok) {
      // After submit
      const isChangePassword = await login(email, password)
      return isChangePassword
    }
    return false
  }

  const updateInformation = async (name: string, password: string): Promise<boolean> => {
    const res = await fetch('api/user/information', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        password,
      }),
    })

    if (res.ok) {
      return true
    }
    return false
  }

  const logout = async () => {
    await nextAuthSignOut({ redirect: false })
    await update()
  }

  const deleteAccount = async () => {
    try {
      const res = await fetch('/api/user/deleteAccount', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) throw new Error('Failed to delete account')

      await logout()
    } catch (error) {
      console.error('Delete account error:', error)
    }
  }

  const fetchUser = async (id: string): Promise<User | null> => {
    try {
      const res = await fetch(`/api/user/${id}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch user')
      const data = await res.json()
      return data.user
    } catch (error) {
      console.error('getUser error:', error)
      return null
    }
  }

  const fetchPreferences = async () => {
    try {
      const res = await fetch('/api/user/preferences', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch preferences')
      const { preferences } = await res.json()
      setPreferences(preferences)
    } catch (error) {
      console.error('Failed to load preferences:', error)
    }
  }

  const updatePreferences = async (data: UserPreferences): Promise<boolean> => {
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: data }),
      })

      if (!res.ok) throw new Error('Failed to update preferences')
      setPreferences(data)
      return true
    } catch (error) {
      console.error('Update preferences error:', error)
      return false
    }
  }

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/user/notifications', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch notificationSettings')
      const { notificationSettings } = await res.json()
      setNotifications(notificationSettings)
    } catch (error) {
      console.error('Failed to load notificationSettings:', error)
    }
  }

  const updateNotifications = async (data: NotificationSettings): Promise<boolean> => {
    try {
      const res = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationSettings: data }),
      })

      if (!res.ok) throw new Error('Failed to update notificationSettings')
      setNotifications(data)
      return true
    } catch (error) {
      console.error('Update notificationSettings error:', error)
      return false
    }
  }

  const fetchGames = async () => {
    try {
      const res = await fetch('api/user/games', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch user quiz')
      const { questAvailable, games } = await res.json()
      setGames(games)
      setQuestions(questAvailable)
    } catch (error) {
      console.error('Failed to load user quiz:', error)
    }
  }

  const updateGames = async (data: Games): Promise<boolean> => {
    try {
      const res = await fetch('/api/user/games', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ games: data }),
      })

      if (!res.ok) throw new Error('Failed to update user score')
      setGames(data)
      return true
    } catch (error) {
      console.error('Update user score error:', error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        userId,
        userName,
        isAuthenticated,
        isUserExisted,
        login,
        register,
        changePassword,
        updateInformation,
        logout,
        deleteAccount,
        getUser: fetchUser,
        loading,
        open,
        setOpen,
        preferences,
        setPreferences,
        updatePreferences,
        notifications,
        setNotifications,
        updateNotifications,
        games,
        setGames,
        updateGames,
        questions,
        setQuestions,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
