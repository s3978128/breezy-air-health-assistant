'use client'

import { useState, useEffect } from 'react'
import MainNavigation from '@/components/main-navigation'
import HeroSection from '@/components/hero-section'
import TabContent from '@/components/tab-content'
import EnhancedChatInterface from '@/components/enhanced-chat-interface'
import { useAirQuality } from '@/contexts/air-quality-context'
import UserAccountButton from '@/components/user/user-account-button'
import LocationIndicator from '@/components/location-indicator'
import { Info } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { airQualityData } = useAirQuality()

  // Set isClient to true once the component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleChatClick = () => {
    setIsChatOpen(true)
  }

  // Only render the full UI on the client to avoid hydration issues
  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white"></div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 pb-12">
        <header className="py-4 flex justify-between">
          <div className="flex items-center gap-3">
            <UserAccountButton />
            <LocationIndicator />
          </div>
          <div className="flex items-center justify-center text-sm  text-sky-800 px-4 py-2">
            <Link
              href="/about"
              className="ml-2 flex items-center px-3 py-1.5 text-sm text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors"
            >
              <Info className="h-4 w-4 mr-1" />
              {<span>About</span>}
            </Link>
          </div>
        </header>

        <div className="mb-8">
          <HeroSection onChatClick={handleChatClick} />
        </div>
        <MainNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <TabContent activeTab={activeTab} />
      </div>

      <EnhancedChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </main>
  )
}
