'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info, Wind, Droplets, Sun, Activity, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAirQuality } from '@/contexts/air-quality-context'
import { getPollutantCategory, getPollutantName, getPollutantUnit } from '@/utils/air-quality-data'
import ExplainFeature from '@/components/explain-feature'

export default function AirQualityDisplay() {
  const { airQualityData, isLoading, refreshData } = useAirQuality()
  const [formattedTime, setFormattedTime] = useState<string>('')
  const [isRefreshing, setIsRefreshing] = useState(false)
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

  // Get pollutant icon
  const getPollutantIcon = (pollutant: string) => {
    switch (pollutant) {
      case 'pm25':
      case 'PM2.5':
      case 'pm10':
      case 'PM10':
        return <Droplets className="h-4 w-4" />
      case 'o3':
      case 'Ozone':
        return <Sun className="h-4 w-4" />
      case 'no2':
      case 'NO₂':
      case 'so2':
      case 'SO₂':
      case 'co':
      case 'CO':
        return <Wind className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  if (isLoading && !airQualityData) {
    return <div className="p-4 text-center">Loading air quality data...</div>
  }

  if (!airQualityData) {
    return <div className="p-4 text-center">Failed to load air quality data</div>
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Current Air Quality in {airQualityData.location}</h3>
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

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <div className="text-5xl font-bold">{airQualityData.aqi}</div>
                <ExplainFeature type="aqi" variant="text" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`text-xl font-medium ${getTextColorClass(airQualityData.aqi)}`}>
                  {airQualityData.category}
                </div>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                OpenWeather AQI:{' '}
                <span className="font-medium">{airQualityData.openWeatherAQI}</span> (
                {getOpenWeatherRating(airQualityData.openWeatherAQI)})
              </div>
            </div>

            <div className="w-full md:w-2/3">
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

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <h4 className="font-medium mb-1">Health Impact</h4>
              <ExplainFeature type="health" />
            </div>
            <p className="text-sm">{airQualityData.healthImplications}</p>

            {airQualityData.cautionaryStatement !== 'None' && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-sm font-medium text-amber-700">
                  {airQualityData.cautionaryStatement}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(airQualityData.pollutants).map(([key, value]) => {
                const { category, color } = getPollutantCategory(key, value)
                const unit = getPollutantUnit(key)
                const name = getPollutantName(key)
                const icon = getPollutantIcon(key)

                return (
                  <div key={key} className="border rounded-lg p-3 bg-white shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-1.5 items-center">
                        <div className={`p-1.5 rounded-full bg-${color}-100`}>{icon}</div>
                        <span className="font-medium text-sm">{name}</span>
                      </div>
                      <ExplainFeature
                        type="pollutant"
                        pollutantId={key}
                        pollutantValue={value}
                        variant="minimal"
                      />
                    </div>
                    <div className="mt-2 flex items-end gap-1">
                      <span className="text-2xl font-bold">
                        {typeof value === 'number' ? value.toFixed(1) : value}
                      </span>
                      <span className="text-xs text-gray-500 mb-1">{unit}</span>
                    </div>
                    <div
                      className={`text-xs ${
                        color === 'green'
                          ? 'text-green-600'
                          : color === 'yellow'
                            ? 'text-yellow-600'
                            : color === 'orange'
                              ? 'text-orange-600'
                              : color === 'red'
                                ? 'text-red-600'
                                : 'text-purple-600'
                      }`}
                    >
                      {category}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
