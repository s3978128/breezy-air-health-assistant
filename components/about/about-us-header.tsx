import { Card, CardContent } from '@/components/ui/card'
import { Leaf } from 'lucide-react'

export default function AboutUsHeader() {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center p-2 bg-sky-100 rounded-full mb-4">
        <Leaf className="h-8 w-8 text-sky-600" />
      </div>
      <h1 className="text-4xl font-bold text-sky-800 mb-4">About Breezy</h1>
      <div className="max-w-3xl mx-auto">
        <p className="text-lg text-gray-600 mb-6">
          Breezy is an AI-powered air health assistant designed to provide you with accurate,
          real-time air quality information and personalized health recommendations.
        </p>

        <Card className="bg-gradient-to-r from-sky-50 to-white border-sky-100">
          <CardContent className="pt-6">
            <p className="text-gray-700">
              Our mission is to make air quality data accessible, understandable, and actionable for
              everyone. We believe that by providing clear information about the air you breathe, we
              can help you make informed decisions to protect your health and the health of your
              loved ones.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
