'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAirQuality } from '@/contexts/air-quality-context'
import ExplainFeature from '@/components/explain-feature'

interface HeroSectionProps {
  onChatClick: () => void
}

export default function HeroSection({ onChatClick }: HeroSectionProps) {
  // State for client-side timestamp display
  const [formattedTime, setFormattedTime] = useState<string>('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { airQualityData, refreshData } = useAirQuality()
  const getOpenWeatherRating = (aqi: number) => {
    switch (aqi) {
      case 1:
        return 'Good'
      case 2:
        return 'Fair'
      case 3:
        return 'Moderate'
      case 4:
        return 'Poor'
      case 5:
        return 'Very Poor'
      default:
        return 'Unknown'
    }
  }

  // Only update the time on the client after initial render
  useEffect(() => {
    if (airQualityData) {
      setFormattedTime(new Date(airQualityData.timestamp).toLocaleTimeString())
    }
  }, [airQualityData])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshData()
    setIsRefreshing(false)
  }

  // Determine color based on AQI
  const getColorClass = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-500'
    if (aqi <= 100) return 'bg-yellow-500'
    if (aqi <= 150) return 'bg-orange-500'
    if (aqi <= 200) return 'bg-red-500'
    if (aqi <= 300) return 'bg-purple-500'
    return 'bg-rose-900'
  }

  const getTextColorClass = (aqi: number) => {
    if (aqi <= 50) return 'text-green-600'
    if (aqi <= 100) return 'text-yellow-600'
    if (aqi <= 150) return 'text-orange-600'
    if (aqi <= 200) return 'text-red-600'
    if (aqi <= 300) return 'text-purple-600'
    return 'text-rose-900'
  }

  if (!airQualityData) {
    return <div className="h-64 flex items-center justify-center">Loading air quality data...</div>
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-sky-50 to-white border border-sky-100 shadow-md">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sky-100/50 to-transparent rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-sky-100/50 to-transparent rounded-full transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="relative z-10 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Breezy Mascot */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative mb-4">
              <Image
                src="/breezy-avatar.png"
                alt="Breezy Mascot"
                width={180}
                height={180}
                className="rounded-full shadow-lg border-4 border-sky-100"
                priority
              />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-sky-800 mb-2">Hello, I'm Breezy!</h1>
            <p className="text-sky-700 mb-4 text-center md:text-left">
              Your personal air quality assistant
            </p>

            <Button
              onClick={onChatClick}
              className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-md"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with me
            </Button>
          </div>

          {/* AQI Display */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-sky-800">Current Air Quality</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {formattedTime ? `Updated: ${formattedTime}` : ''}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="sr-only">Refresh data</span>
                </Button>
              </div>
            </div>

            <Card className="overflow-hidden border-sky-100">
              <CardContent className="p-0">
                <div className="flex items-center p-4 border-b border-sky-50">
                  <div className="mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-5xl font-bold">{airQualityData.aqi}</div>
                      <ExplainFeature type="aqi" />
                    </div>
                    <div className={`text-xl font-medium ${getTextColorClass(airQualityData.aqi)}`}>
                      {airQualityData.category}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      OpenWeather AQI:{' '}
                      <span className="font-medium">{airQualityData.openWeatherAQI}</span> (
                      {getOpenWeatherRating(airQualityData.openWeatherAQI)})
                    </div>

                    <div className="text-sm text-gray-500">in {airQualityData.location}</div>
                  </div>

                  <div className="flex-grow">
                    <div className="h-8 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getColorClass(airQualityData.aqi)}`}
                        style={{ width: `${Math.min(airQualityData.aqi / 3, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>0</span>
                      <span>50</span>
                      <span>100</span>
                      <span>150</span>
                      <span>200</span>
                      <span>300+</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-sky-50">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">Health Impact</h3>
                    <ExplainFeature type="health" />
                  </div>
                  <p className="text-sm">{airQualityData.healthImplications}</p>
                  {airQualityData.mainPollutant && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Main pollutant:</span>{' '}
                      {airQualityData.mainPollutant}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
