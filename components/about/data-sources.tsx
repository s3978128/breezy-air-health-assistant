import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'

export default function DataSources() {
  // Dummy variables for the API endpoint example
  const lat = 'your_latitude'
  const lon = 'your_longitude'
  const API_key = 'your_api_key'

  return (
    <section id="data-sources" className="scroll-mt-16">
      <h2 className="text-3xl font-bold text-sky-800 mb-6">Our Data Sources</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-sky-100">
          <CardHeader>
            <CardTitle className="text-xl text-sky-700">OpenWeather API Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Breezy uses the OpenWeather Air Pollution API as our primary data source for real-time
              air quality information. This API provides comprehensive pollutant data for locations
              worldwide.
            </p>

            <h3 className="font-semibold text-lg mb-2">How We Use OpenWeather Data</h3>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>
                <strong>Data Retrieval</strong>: We fetch air pollution data using geographical
                coordinates (latitude and longitude) for your location.
              </li>
              <li>
                <strong>Pollutant Extraction</strong>: We extract concentration values for PM2.5,
                PM10, O₃, NO₂, SO₂, and CO from the API response.
              </li>
              <li>
                <strong>Unit Conversion</strong>: We convert the raw measurements to standard units
                (μg/m³, ppb, or ppm) as needed for AQI calculations.
              </li>
              <li>
                <strong>AQI Calculation</strong>: We apply the EPA formula to calculate individual
                and overall AQI values.
              </li>
            </ol>

            <div className="p-3 bg-gray-50 rounded-md mb-4">
              <h4 className="font-semibold mb-1">API Endpoint Example</h4>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded overflow-x-auto">
                https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid=
                {API_key}
              </p>
            </div>

            <p className="text-sm">
              <a
                href="https://openweathermap.org/api/air-pollution"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 hover:text-sky-800 inline-flex items-center"
              >
                Learn more about the OpenWeather Air Pollution API
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </p>
          </CardContent>
        </Card>

        <Card className="border-sky-100">
          <CardHeader>
            <CardTitle className="text-xl text-sky-700">Data Quality & Limitations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              While we strive to provide the most accurate air quality information possible, it's
              important to understand the limitations of our data sources.
            </p>

            <h3 className="font-semibold text-lg mb-2">Data Accuracy Considerations</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <strong>Measurement Stations</strong>: OpenWeather aggregates data from ground-based
                monitoring stations, which may vary in density across different regions.
              </li>
              <li>
                <strong>Data Gaps</strong>: In areas with fewer monitoring stations, data may be
                interpolated or modeled, potentially reducing accuracy.
              </li>
              <li>
                <strong>Update Frequency</strong>: While we refresh data regularly, there may be a
                slight delay between actual conditions and reported data.
              </li>
              <li>
                <strong>Local Variations</strong>: Air quality can vary significantly within short
                distances, especially in urban areas or near pollution sources.
              </li>
            </ul>

            <div className="p-3 bg-sky-50 rounded-md mb-4">
              <h4 className="font-semibold mb-1">Our Commitment to Accuracy</h4>
              <p className="text-sm">
                We continuously monitor the quality of our data and work to improve our processing
                methods. If you notice any discrepancies or have concerns about the air quality
                information provided, please contact us.
              </p>
            </div>

            <h3 className="font-semibold text-lg mb-2">Additional Data Sources</h3>
            <p>In addition to OpenWeather, we reference standards and guidelines from:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>US Environmental Protection Agency (EPA)</li>
              <li>World Health Organization (WHO)</li>
              <li>European Environment Agency (EEA)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
