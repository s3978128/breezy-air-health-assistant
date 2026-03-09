import AirQualityDisplay from '@/components/air-quality-display'
import HealthAdvisory from '@/components/health-advisory'
import AirQualityForecast from '@/components/air-quality-forecast'
import LocationSearch from '@/components/location-search'
import EcoTips from '@/components/eco-tips'
import { useState } from 'react'
import { AirQualityData } from '@/lib/types'
import GreenInitiatives from '@/components/green-initiatives'
import { useAirQuality } from '@/contexts/air-quality-context'
import LoginPrompt from '@/components/login-prompt'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'
import EnhancedChatInterface from '@/components/enhanced-chat-interface'
import Games from './user/games'

interface TabContentProps {
  activeTab: string
}

export default function TabContent({ activeTab }: TabContentProps) {
  const [searchResult, setSearchResult] = useState<AirQualityData | null>(null)
  const [location, setLocation] = useState('')
  const { airQualityData } = useAirQuality()
  const { data: session } = useSession()
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Listen for the custom event to open the enhanced chat
  useEffect(() => {
    const handleOpenChat = () => {
      setIsChatOpen(true)
    }

    // Add event listener
    document.addEventListener('openEnhancedChat', handleOpenChat)

    // Clean up
    return () => {
      document.removeEventListener('openEnhancedChat', handleOpenChat)
    }
  }, [])

  return (
    <div className="py-6">
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-sky-100">
            <AirQualityDisplay />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-sky-100">
            <AirQualityForecast />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-sky-100">
            {/* chat with breezy section, with great design */}
            <h2 className="text-xl font-semibold text-sky-700 mb-4">Chat with Breezy</h2>
            <p className="text-gray-600 mb-4">
              Have questions about air quality? Chat with Breezy for personalized advice and tips.
            </p>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={() => setIsChatOpen(true)}
            >
              <MessageSquare className="mr-2 h-4 w-4 border-sky-500" />
              Chat Now
            </Button>
          </div>

          {!session?.user && (
            <div className="mt-4">
              <LoginPrompt
                feature="Personalized Alerts"
                message="Create an account to receive alerts when the AQI shows unhealthy air quality levels for your area."
                variant="banner"
                showDismiss={true}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-sky-100">
            <LocationSearch
              location={location}
              setLocation={setLocation}
              searchResult={searchResult}
              setSearchResult={setSearchResult}
            />
          </div>
        </div>
      )}

      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-sky-100">
            <h2 className="text-xl font-semibold text-sky-700 mb-4">
              Health Advisory
              {airQualityData && (
                <span className="ml-2 text-base font-normal text-gray-500">
                  for {airQualityData.location} (AQI: {airQualityData.aqi})
                </span>
              )}
            </h2>
            <HealthAdvisory />
          </div>
        </div>
      )}

      {activeTab === 'green' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-sky-100">
            <EcoTips />
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-sky-100">
            <GreenInitiatives />
          </div>
        </div>
      )}

      {activeTab === 'games' && (
        <div className="space-y-6">
          <Games />
        </div>
      )}

      {isChatOpen && (
        <EnhancedChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  )
}
