'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEcoTips } from '@/contexts/eco-tips-context'
import { Leaf, RefreshCw, ThumbsUp, ThumbsDown, Check, History } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'
import { useSession } from 'next-auth/react'

export default function EcoTips() {
  const { currentTip, isLoading, refreshTip } = useEcoTips()
  const [activeTab, setActiveTab] = useState('current')
  const { data: session } = useSession()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshTip()
    setIsRefreshing(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transportation':
        return 'bg-blue-100 text-blue-800'
      case 'energy':
        return 'bg-yellow-100 text-yellow-800'
      case 'waste':
        return 'bg-green-100 text-green-800'
      case 'consumption':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAqiLevelColor = (level: string) => {
    switch (level) {
      case 'good':
        return 'bg-green-100 text-green-800'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800'
      case 'unhealthy':
        return 'bg-orange-100 text-orange-800'
      case 'very-unhealthy':
        return 'bg-red-100 text-red-800'
      case 'hazardous':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <Card className="border-none shadow-none bg-transparent hover:bg-muted/30 transition-all duration-300 ease-in-out">
      <CardHeader className="pb-2 border-none shadow-none bg-transparent hover:bg-muted/30 transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-green-700 flex items-center">
            <Leaf className="h-5 w-5 mr-2" />
            Daily Eco-Tips
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-green-700 border-green-200 hover:bg-green-50"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>New Tip</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {isLoading || !currentTip ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className={getAqiLevelColor(currentTip.aqiLevel)}>
                {currentTip.aqiLevel === 'all'
                  ? 'All AQI Levels'
                  : `${currentTip.aqiLevel.charAt(0).toUpperCase() + currentTip.aqiLevel.slice(1)} AQI`}
              </Badge>
            </div>

            <p className="text-gray-700">{currentTip.content}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-3 px-6">
        <p className="text-xs text-gray-500">
          These eco-friendly tips are tailored based on current air quality conditions to help you
          reduce your environmental impact.
        </p>
      </CardFooter>
    </Card>
  )
}
