import { Card, CardContent } from '@/components/ui/card'
import { Wind, Droplets, Sun, AlertTriangle, Activity, Leaf } from 'lucide-react'

interface PollutantDetailCardProps {
  name: string
  fullName: string
  description: string
  sources: string[]
  healthEffects: string[]
  thresholds: { scale: string; value: string }[]
  unit: string
  iconColor: string
}

export default function PollutantDetailCard({
  name,
  fullName,
  description,
  sources,
  healthEffects,
  thresholds,
  unit,
  iconColor,
}: PollutantDetailCardProps) {
  // Determine which icon to use based on pollutant
  const getIcon = () => {
    switch (name) {
      case 'PM2.5':
      case 'PM10':
        return <Droplets className="h-6 w-6" />
      case 'O₃':
        return <Sun className="h-6 w-6" />
      case 'NO₂':
      case 'SO₂':
        return <Wind className="h-6 w-6" />
      case 'CO':
        return <Activity className="h-6 w-6" />
      default:
        return <Leaf className="h-6 w-6" />
    }
  }

  return (
    <Card className="border-sky-100">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-full ${iconColor}`}>{getIcon()}</div>
          <div>
            <h3 className="text-2xl font-bold text-sky-800">{name}</h3>
            <p className="text-lg text-gray-600">{fullName}</p>
          </div>
        </div>

        <p className="text-gray-700 mb-6">{description}</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-sky-700 mb-3">Sources</h4>
            <ul className="list-disc pl-5 space-y-1 mb-6">
              {sources.map((source, index) => (
                <li key={index} className="text-gray-700">
                  {source}
                </li>
              ))}
            </ul>

            <h4 className="text-lg font-semibold text-sky-700 mb-3">Health Effects</h4>
            <ul className="list-disc pl-5 space-y-1">
              {healthEffects.map((effect, index) => (
                <li key={index} className="text-gray-700">
                  {effect}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-sky-700 mb-3">Measurement & Thresholds</h4>
            <p className="mb-3 text-gray-700">
              {name} is measured in <strong>{unit}</strong>. Here are the key thresholds:
            </p>

            <div className="space-y-3">
              {thresholds.map((threshold, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium">{threshold.scale}:</span>{' '}
                    <span>{threshold.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 bg-sky-50 rounded-md">
              <h4 className="font-semibold mb-2">How We Use This Data</h4>
              <p className="text-sm text-gray-700">
                Breezy monitors {name} levels in real-time and incorporates them into our AQI
                calculations. When {name} is the dominant pollutant, we provide specific health
                recommendations tailored to this pollutant's effects.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
