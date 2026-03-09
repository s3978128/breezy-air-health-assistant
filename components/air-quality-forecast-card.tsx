import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Wind, Droplets, CloudFog, Factory, AlertTriangle } from 'lucide-react'

interface ForecastData {
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

interface TrendInfo {
  text: string
  icon: string
  color: string
}

interface AirQualityForecastCardProps {
  dayName: string
  data: ForecastData
  trend?: TrendInfo
  isToday?: boolean
}

export default function AirQualityForecastCard({
  dayName,
  data,
  trend,
  isToday = false,
}: AirQualityForecastCardProps) {
  const getPollutantIcon = (type: string) => {
    switch (type) {
      case 'PM2.5':
      case 'PM10':
        return <Droplets className="h-3 w-3" />
      case 'O₃':
        return <Wind className="h-3 w-3" />
      case 'NO₂':
      case 'SO₂':
        return <Factory className="h-3 w-3" />
      case 'CO':
        return <CloudFog className="h-3 w-3" />
      default:
        return <AlertTriangle className="h-3 w-3" />
    }
  }

  const getAqiColorClass = () => {
    switch (data.category) {
      case 'Good':
        return 'bg-emerald-500'
      case 'Moderate':
        return 'bg-yellow-500'
      case 'Unhealthy for Sensitive Groups':
        return 'bg-orange-500'
      case 'Unhealthy':
        return 'bg-red-500'
      case 'Very Unhealthy':
        return 'bg-purple-500'
      case 'Hazardous':
        return 'bg-rose-900'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card className="border border-muted hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* AQI Circle + Info */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center justify-center">
              <div
                className={`${getAqiColorClass()} text-white font-bold rounded-full w-16 h-16 flex items-center justify-center text-xl`}
              >
                {data.aqi}
              </div>
              <span className="text-xs font-medium mt-1">AQI</span>
            </div>

            <div>
              <h3 className="font-medium text-foreground">{data.category}</h3>

              {/* Trend info */}
              {trend && !isToday && (
                <div className={`flex items-center text-sm font-medium ${trend.color} mt-1`}>
                  <span className="mr-1">{trend.icon}</span>
                  <span>{trend.text}</span>
                </div>
              )}
            </div>
          </div>

          {/* Day label */}
          <div className="text-sm font-medium text-muted-foreground sm:text-right">{dayName}</div>
        </div>
      </CardContent>
    </Card>
  )
}
