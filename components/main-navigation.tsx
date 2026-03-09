'use client'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Home, Wind, BarChart2, Heart, Info, Leaf, Gamepad2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMobile } from '@/hooks/use-mobile'
import Link from 'next/link'

interface MainNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MainNavigation({ activeTab, onTabChange }: MainNavigationProps) {
  const isMobile = useMobile()

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      id: 'search',
      label: 'Air Quality Search',
      icon: <Wind className="h-4 w-4 mr-2" />,
    },
    {
      id: 'health',
      label: 'Health and Safety',
      icon: <Heart className="h-4 w-4 mr-2" />,
    },
    {
      id: 'green',
      label: 'Green Actions',
      icon: <Leaf className="h-4 w-4 mr-2" />,
    },
    {
      id: 'games',
      label: 'Quiz',
      icon: <Gamepad2 className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-sky-100 py-3 px-4">
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="w-full bg-sky-50 p-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  'flex items-center data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-sm',
                  'transition-all duration-200 ease-in-out',
                )}
              >
                {tab.icon}
                {!isMobile && <span>{tab.label}</span>}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
