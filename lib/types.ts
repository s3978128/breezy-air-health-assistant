export interface AirQualityData {
  location: string
  aqi: number
  category: string
  color: string
  pollutants: {
    pm25: number
    pm10: number
    o3: number
    no2: number
    so2: number
    co: number
  }
  timestamp: string
  mainPollutant: string
  healthImplications: string
  cautionaryStatement: string
  openWeatherAQI: number
}

export interface Pollutant {
  id: string
  name: string
  fullName: string
  description: string
  healthEffects: string
  sources: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface User {
  id: string
  name: string
  email: string
  preferences: UserPreferences
  notificationSettings: NotificationSettings
  games: Games
}

export interface UserPreferences {
  healthConditions: {
    asthma: boolean
    copd: boolean
    heartDisease: boolean
    allergies: boolean
  }
  sensitiveGroup: boolean
}

export interface NotificationSettings {
  emailNotifications: boolean
  email: string
  location: string
  dailyUpdates: boolean
  alertThreshold: number
  alertFrequency: 'immediate' | 'hourly' | 'daily'
}

export interface Games {
  level: number
  score: number
  correctAnswers: string[]
  questionsLimitedPerDay: number
  currentCompleted: {
    questions: { questionId: string; answer: number }[]
    expires: number
  }
}

export interface Questions {
  question: string
  options: string[]
  answer: number
}

export interface CreateUserOptions {
  name: string
  email: string
  provider: 'credentials' | 'google'
  password?: string // required only for credentials
}

export interface UserSearchOptions {
  id?: string
  email?: string
  password?: string
  provider?: string
}

export interface VerificationPassword {
  resendId: string
  userId: string
  verificationCode: string
  expires?: Date
}

export interface ForecastDay {
  day: string
  aqi: number
  category: string
  icon: string
  trend: 'improving' | 'worsening' | 'stable'
}

export interface Forecast {
  tomorrow: {
    aqi: number
    category: string
    color: string
    pollutants: {
      pm25: number
      pm10: number
      o3: number
      no2: number
      so2: number
      co: number
    }
    mainPollutant: 'O₃' | 'PM2.5' | 'PM10' | 'NO₂' | 'SO₂' | 'CO'
  }
  day_after: {
    aqi: number
    category: string
    color: string
    pollutants: {
      pm25: number
      pm10: number
      o3: number
      no2: number
      so2: number
      co: number
    }
    mainPollutant: 'O₃' | 'PM2.5' | 'PM10' | 'NO₂' | 'SO₂' | 'CO'
  }
}

export interface HealthAdvisory {
  general: {
    title: string
    description: string
    recommendations: string[]
  }
  sensitive: {
    title: string
    description: string
    recommendations: string[]
  }
  symptoms: string[]
}

export interface EcoTip {
  id: string
  content: string
  aqiLevel: 'good' | 'moderate' | 'unhealthy' | 'very-unhealthy' | 'hazardous' | 'all'
  createdAt: string
  source?: string
}
