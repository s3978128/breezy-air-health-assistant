import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AiProvider } from '@/contexts/ai-context'
import { AirQualityProvider } from '@/contexts/air-quality-context'
import { EcoTipsProvider } from '@/contexts/eco-tips-context'
import { LocationProvider } from '@/contexts/location-context'
import { UserPreferencesProvider } from '@/contexts/user-preferences-context'
import { ForecastProvider } from '@/contexts/forecast-context'
import { SymptomTrackingProvider } from '@/contexts/symptom-tracking-context'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Breezy - AI-Powered Air Health Assistant',
  description: 'Get real-time air quality information and personalized health recommendations',
  keywords: 'air quality, AQI, health, pollution, air health, air quality index',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body className={inter.className}>
        <SessionProvider>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <AiProvider>
                <LocationProvider>
                  <AirQualityProvider>
                    <UserPreferencesProvider>
                      <ForecastProvider>
                        <EcoTipsProvider>
                          <SymptomTrackingProvider>
                            {children}
                            <Toaster />
                          </SymptomTrackingProvider>
                        </EcoTipsProvider>
                      </ForecastProvider>
                    </UserPreferencesProvider>
                  </AirQualityProvider>
                </LocationProvider>
              </AiProvider>
            </ThemeProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
