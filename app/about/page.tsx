import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import AboutUsHeader from '@/components/about/about-us-header'
import AboutNavigation from '@/components/about/about-navigation'
import AqiMethodology from '@/components/about/aqi-methodology'
import AqiScales from '@/components/about/aqi-scales'
import PollutantsExplained from '@/components/about/pollutants-explained'
import DataSources from '@/components/about/data-sources'

export const metadata: Metadata = {
  title: 'About Breezy | Learn about Air Quality',
  description:
    'Learn about air quality indices, pollution sources, and how Breezy helps you monitor and understand the air you breathe.',
}

export default function AboutPage() {
  return (
    <div className="container py-8 px-4 mx-auto max-w-6xl">
      <div className="mb-6">
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="mb-8 flex items-center gap-1 border-sky-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <AboutUsHeader />

      <div className="grid md:grid-cols-4 gap-8 mt-8">
        <div className="md:col-span-1">
          <AboutNavigation />
        </div>

        <div className="md:col-span-3 space-y-16">
          <AqiMethodology />
          <AqiScales />
          <PollutantsExplained />
          <DataSources />
        </div>
      </div>
    </div>
  )
}
