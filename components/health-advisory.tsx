'use client'

import type React from 'react'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Check,
  AlertTriangle,
  Users,
  AlertCircle,
  TreesIcon as Lungs,
  Heart,
  Activity,
  RefreshCw,
  MessageSquare,
  XCircle,
} from 'lucide-react'
import { useAirQuality } from '@/contexts/air-quality-context'
import { getHealthAdvisories } from '@/lib/get-health-advisory'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useUserPreferences } from '@/contexts/user-preferences-context'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import LoginPrompt from '@/components/login-prompt'
import SymptomChatbot from '@/components/symptom-chatbot'
import { useSymptomTracking } from '@/contexts/symptom-tracking-context'

export default function HealthAdvisory() {
  const { airQualityData } = useAirQuality()
  const { data: session } = useSession()
  const { toast } = useToast()
  const {
    preferences: userProfile,
    isLoading: preferencesLoading,
    refreshPreferences,
  } = useUserPreferences()
  const {
    checkedSymptoms,
    setCheckedSymptoms,
    selectedSymptoms,
    showSymptomChatbot,
    setShowSymptomChatbot,
    clearSymptoms,
    availableSymptoms,
  } = useSymptomTracking()

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(true)

  const currentAqi = airQualityData?.aqi || 42
  const advisories = getHealthAdvisories(currentAqi, userProfile)

  const handleSymptomCheck = (symptom: string, checked: boolean) => {
    setCheckedSymptoms({ ...checkedSymptoms, [symptom]: checked })

    if (checked && !session?.user) {
      // toast({
      //   title: 'Symptom noted',
      //   description: 'Log in to track your symptoms over time and get personalized advice.',
      //   duration: 5000,
      // })
    } else if (checked && session?.user) {
      // toast({
      //   title: 'Symptom Logged',
      //   description: 'Stay safe and monitor your health.',
      // })
    }
  }

  const handleRefreshPreferences = async () => {
    setIsRefreshing(true)
    await refreshPreferences()
    setIsRefreshing(false)
    toast({
      title: 'Health advisory updated',
      description: 'Your personalized health recommendations have been refreshed.',
    })
  }

  const handleGetSymptomAdvice = () => {
    setShowSymptomChatbot(true)
  }

  const activeConditionsCount = userProfile
    ? Object.values(userProfile.healthConditions).filter(Boolean).length
    : 0

  return (
    <div className="space-y-6">
      {userProfile ? (
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                Your Health Recommendations
                <Badge variant="outline" className="ml-2 font-normal text-xs">
                  AQI {currentAqi}
                </Badge>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {userProfile.sensitiveGroup && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>Sensitive Group</span>
                </Badge>
              )}
              {userProfile.healthConditions.asthma && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Lungs className="h-3 w-3" />
                  <span>Asthma</span>
                </Badge>
              )}
              {userProfile.healthConditions.copd && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Lungs className="h-3 w-3" />
                  <span>COPD</span>
                </Badge>
              )}
              {userProfile.healthConditions.heartDisease && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>Heart Disease</span>
                </Badge>
              )}
              {userProfile.healthConditions.allergies && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Allergies</span>
                </Badge>
              )}
            </div>

            {advisories.personalized?.recommendations.length > 0 ? (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-green-600" />
                  Recommendations Based on Your Health Profile
                </h4>

                {activeConditionsCount > 1 ? (
                  <div className="space-y-4">
                    {userProfile.healthConditions.asthma && (
                      <RecommendationGroup
                        title="For Asthma"
                        icon={<Lungs className="h-4 w-4 text-purple-600" />}
                        recommendations={advisories.personalized.recommendations.filter(
                          (r) =>
                            r.toLowerCase().includes('asthma') ||
                            r.toLowerCase().includes('inhaler'),
                        )}
                      />
                    )}
                    {userProfile.healthConditions.copd && (
                      <RecommendationGroup
                        title="For COPD"
                        icon={<Lungs className="h-4 w-4 text-blue-600" />}
                        recommendations={advisories.personalized.recommendations.filter(
                          (r) =>
                            r.toLowerCase().includes('copd') || r.toLowerCase().includes('oxygen'),
                        )}
                      />
                    )}
                    {userProfile.healthConditions.heartDisease && (
                      <RecommendationGroup
                        title="For Heart Disease"
                        icon={<Heart className="h-4 w-4 text-red-600" />}
                        recommendations={advisories.personalized.recommendations.filter(
                          (r) =>
                            r.toLowerCase().includes('heart') ||
                            r.toLowerCase().includes('palpitations'),
                        )}
                      />
                    )}
                    {userProfile.healthConditions.allergies && (
                      <RecommendationGroup
                        title="For Allergies"
                        icon={<AlertCircle className="h-4 w-4 text-yellow-600" />}
                        recommendations={advisories.personalized.recommendations.filter(
                          (r) =>
                            r.toLowerCase().includes('allerg') || r.toLowerCase().includes('mask'),
                        )}
                      />
                    )}
                    {userProfile.sensitiveGroup && (
                      <RecommendationGroup
                        title="For Sensitive Groups"
                        icon={<Users className="h-4 w-4 text-sky-600" />}
                        recommendations={advisories.personalized.recommendations.filter((r) =>
                          r.toLowerCase().includes('sensitive'),
                        )}
                      />
                    )}
                    <RecommendationGroup
                      title="General Recommendations"
                      icon={<Check className="h-4 w-4 text-green-600" />}
                      recommendations={advisories.personalized.recommendations.filter(
                        (r) =>
                          !r.toLowerCase().includes('asthma') &&
                          !r.toLowerCase().includes('inhaler') &&
                          !r.toLowerCase().includes('copd') &&
                          !r.toLowerCase().includes('oxygen') &&
                          !r.toLowerCase().includes('heart') &&
                          !r.toLowerCase().includes('palpitations') &&
                          !r.toLowerCase().includes('allerg') &&
                          !r.toLowerCase().includes('mask') &&
                          !r.toLowerCase().includes('sensitive'),
                      )}
                    />
                  </div>
                ) : (
                  <ul className="space-y-1.5 text-sm">
                    {advisories.personalized.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-3.5 w-3.5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Based on the current air quality and your health profile, no special
                precautions are needed.
              </p>
            )}
          </CardContent>
        </Card>
      ) : !session?.user && showLoginPrompt ? (
        <LoginPrompt
          feature="Personalized Health Recommendations"
          message="Create an account to receive health advice tailored to your specific health conditions and needs."
          variant="card"
        />
      ) : null}

      {/* Tabs for General and Sensitive */}
      <Card>
        <CardContent className="pt-4">
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General Advice</TabsTrigger>
              <TabsTrigger value="sensitive">Sensitive Groups</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-3">
              <div className="flex items-start mb-3">
                <div className="mr-3 mt-1">
                  {currentAqi <= 50 ? (
                    <div className="bg-green-100 p-1.5 rounded-full">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="bg-yellow-100 p-1.5 rounded-full">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-medium mb-1">
                    General Advisory – AQI {currentAqi}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{advisories.general.description}</p>
                </div>
              </div>

              <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
              <ul className="space-y-1.5 text-sm">
                {advisories.general.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-3.5 w-3.5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="sensitive" className="mt-3">
              <div className="flex items-start mb-3">
                <div className="mr-3 mt-1">
                  <div className="bg-sky-100 p-1.5 rounded-full">
                    <Users className="h-4 w-4 text-sky-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-medium mb-1">Sensitive Groups</h3>
                  <p className="text-sm text-gray-600 mb-3">{advisories.sensitive.description}</p>
                </div>
              </div>

              <h4 className="text-sm font-medium mb-2">For Sensitive Groups:</h4>
              <ul className="space-y-1.5 text-sm">
                {advisories.sensitive.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-3.5 w-3.5 text-sky-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Symptom Checker */}
      {availableSymptoms.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-sky-600" />
                AI Symptom Checker
                <Badge variant="outline" className="ml-1 font-normal text-xs">
                  AQI {currentAqi}
                </Badge>
              </CardTitle>
              {selectedSymptoms.length > 0 && (
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clearSymptoms}>
                  <XCircle className="h-3.5 w-3.5 mr-1.5" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {!showSymptomChatbot && (
              <p className="text-sm text-gray-600 mb-4">
                Select any symptoms you're experiencing related to the current air quality:
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableSymptoms.map((symptom, i) => (
                <div key={i} className="flex items-start">
                  <Checkbox
                    id={`symptom-${i}`}
                    checked={checkedSymptoms[symptom] || false}
                    onCheckedChange={(checked) => handleSymptomCheck(symptom, checked as boolean)}
                    className="mt-0.5"
                  />
                  <Label htmlFor={`symptom-${i}`} className="ml-2 text-sm font-normal">
                    {symptom}
                  </Label>
                </div>
              ))}
            </div>

            {selectedSymptoms.length > 0 && !showSymptomChatbot && (
              <div className="mt-4">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800"
                  onClick={handleGetSymptomAdvice}
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  Get AI Analysis for {selectedSymptoms.length} Symptom
                  {selectedSymptoms.length > 1 ? 's' : ''}
                </Button>
              </div>
            )}

            {showSymptomChatbot && <SymptomChatbot />}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function RecommendationGroup({
  title,
  icon,
  recommendations,
}: {
  title: string
  icon: React.ReactNode
  recommendations: string[]
}) {
  if (recommendations.length === 0) return null

  return (
    <div className="pb-2">
      <h5 className="text-sm font-medium mb-2 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h5>
      <ul className="space-y-1.5 text-sm pl-6">
        {recommendations.map((rec, i) => (
          <li key={i} className="flex items-start">
            <Check className="h-3.5 w-3.5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>{rec}</span>
          </li>
        ))}
      </ul>
      <Separator className="mt-3" />
    </div>
  )
}
