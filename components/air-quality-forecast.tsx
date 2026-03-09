'use client'

import { CalendarDays, RefreshCcw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import AirQualityForecastCard from '@/components/air-quality-forecast-card'
import { useAirQuality } from '@/contexts/air-quality-context'
import { useForecast } from '@/contexts/forecast-context'

export default function AirQualityForecast() {
  const { airQualityData } = useAirQuality()
  const { forecastData, isLoading, refreshForecast } = useForecast()

  const getDayName = (offset: number) => {
    const d = new Date()
    d.setDate(d.getDate() + offset)
    return d.toLocaleDateString('en-US', { weekday: 'long' })
  }

  const getDate = (offset: number) => {
    const d = new Date()
    d.setDate(d.getDate() + offset)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getTrend = (curr: number, next: number) => {
    if (next < curr) return { text: 'Improving', icon: '↑', color: 'text-emerald-500' }
    if (next > curr) return { text: 'Worsening', icon: '↓', color: 'text-rose-500' }
    return { text: 'Stable', icon: '→', color: 'text-slate-500' }
  }

  if (!airQualityData && !forecastData && !isLoading) {
    return null
  }

  // Use current air quality data for today if available
  const todayData = airQualityData
    ? {
        aqi: airQualityData.aqi,
        category: airQualityData.category,
        color: airQualityData.color,
        pollutants: airQualityData.pollutants || {
          pm25: 0,
          pm10: 0,
          o3: 0,
          no2: 0,
          so2: 0,
          co: 0,
        },
        mainPollutant: airQualityData.mainPollutant || 'PM2.5',
      }
    : null

  return (
    <Card className="border-none shadow-none bg-transparent hover:bg-muted/30 transition-all duration-300 ease-in-out">
      <CardHeader className="flex flex-row justify-between items-center pb-3">
        <CardTitle>Air Quality Forecast</CardTitle>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => refreshForecast()}
                disabled={isLoading}
                className="h-8 w-8 rounded-full hover:bg-primary/10"
              >
                <RefreshCcw
                  className={`h-4 w-4 ${isLoading ? 'animate-spin text-primary' : 'text-muted-foreground'}`}
                />
                <span className="sr-only">Refresh forecast</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh forecast data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {isLoading ? (
          <>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
          </>
        ) : (
          <>
            {todayData && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary mr-2"></span>
                  Today ({getDate(0)})
                </h3>
                <AirQualityForecastCard dayName={getDayName(0)} data={todayData} isToday />
              </div>
            )}

            {forecastData && forecastData.tomorrow && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400 mr-2"></span>
                  Tomorrow ({getDate(1)})
                </h3>
                <AirQualityForecastCard
                  dayName={getDayName(1)}
                  data={forecastData.tomorrow}
                  trend={todayData ? getTrend(todayData.aqi, forecastData.tomorrow.aqi) : undefined}
                />
              </div>
            )}

            {forecastData && forecastData.day_after && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-slate-400 mr-2"></span>
                  {getDayName(2)} ({getDate(2)})
                </h3>
                <AirQualityForecastCard
                  dayName={getDayName(2)}
                  data={forecastData.day_after}
                  trend={
                    forecastData.tomorrow
                      ? getTrend(forecastData.tomorrow.aqi, forecastData.day_after.aqi)
                      : undefined
                  }
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
