import AboutUsHeader from '@/components/about/about-us-header'
import AboutNavigation from '@/components/about/about-navigation'
import AqiMethodology from '@/components/about/aqi-methodology'
import AqiScales from '@/components/about/aqi-scales'
import PollutantsExplained from '@/components/about/pollutants-explained'
import DataSources from '@/components/about/data-sources'
import TeamSection from '@/components/about/team-section'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 text-sky-700">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <AboutUsHeader />

        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <AboutNavigation />
          </div>
          <div className="md:col-span-3 space-y-16">
            <AqiMethodology />
            <AqiScales />
            <PollutantsExplained />
            <DataSources />
            <TeamSection />
          </div>
        </div>
      </div>
    </main>
  )
}
