'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Info, Wind, Droplets, Sun } from 'lucide-react'
import { getPollutantCategory, getPollutantName, getPollutantUnit } from '@/utils/air-quality-data'
import ExplainFeature from '@/components/explain-feature'

interface AirQualityData {
  city: string
  aqi: number
  category: string
  openWeatherAQI: number
  healthImplications: string
  cautionaryStatement: string
  pollutants: Record<string, number>
  timestamp: string
}

interface SearchResultCardProps {
  data: AirQualityData
  onApply: () => void
  onDismiss?: () => void
}

export default function SearchResultCard({ data, onApply, onDismiss }: SearchResultCardProps) {
  const [formattedTime, setFormattedTime] = useState('')

  useEffect(() => {
    if (data?.timestamp) {
      setFormattedTime(new Date(data.timestamp).toLocaleTimeString())
    }
  }, [data])

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

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Search Result: {data.city}</h3>
        <span className="text-sm text-gray-500">
          {formattedTime ? `Updated: ${formattedTime}` : ''}
        </span>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <div className="text-5xl font-bold">{data.aqi}</div>
                {/* <ExplainFeature
                  type="aqi"
                  locationOverride={data.city}
                  aqiOverride={data.aqi}
                  categoryOverride={data.category}
                  pollutantsOverride={data.pollutants}
                /> */}
              </div>
              <div className={`text-xl font-medium ${getTextColorClass(data.aqi)} mt-1`}>
                {data.category}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                OpenWeather AQI: <span className="font-medium">{data.openWeatherAQI}</span> (
                {getOpenWeatherRating(data.openWeatherAQI)})
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <div className="h-8 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getColorClass(data.aqi)}`}
                  style={{ width: `${Math.min(data.aqi / 3, 100)}%` }}
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
              {/* <ExplainFeature
                type="aqi"
                locationOverride={data.city}
                aqiOverride={data.aqi}
                categoryOverride={data.category}
                pollutantsOverride={data.pollutants}
              /> */}
            </div>
            <p className="text-sm">{data.healthImplications}</p>
            {data.cautionaryStatement !== 'None' && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-sm font-medium text-amber-700">{data.cautionaryStatement}</p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(data.pollutants).map(([key, value]) => {
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
                      {/* <ExplainFeature
                        type="pollutant"
                        pollutantId={key}
                        pollutantValue={value}
                        locationOverride={data.city}
                        pollutantsOverride={data.pollutants}
                      /> */}
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

          <div className="mt-6 flex justify-end gap-2">
            {onDismiss && (
              <Button variant="ghost" onClick={onDismiss}>
                Dismiss
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
