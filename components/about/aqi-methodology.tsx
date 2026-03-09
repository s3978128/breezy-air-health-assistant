import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AqiCalculationDiagram from './aqi-calculation-diagram'

export default function AqiMethodology() {
  return (
    <section id="aqi-methodology" className="scroll-mt-16">
      <h2 className="text-3xl font-bold text-sky-800 mb-6">How We Calculate AQI</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card className="h-full border-sky-100">
            <CardHeader>
              <CardTitle className="text-xl text-sky-700">AQI Calculation Methodology</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The Air Quality Index (AQI) is a standardized indicator developed by the US
                Environmental Protection Agency (EPA) to communicate how clean or polluted the air
                is and what associated health effects might be of concern.
              </p>

              <h3 className="font-semibold text-lg mb-2">The Formula</h3>
              <p className="mb-4">For each pollutant, the AQI is calculated using this equation:</p>

              <div className="bg-gray-50 p-4 rounded-md mb-4 overflow-x-auto">
                <p className="font-mono text-sm">
                  AQI = [(I<sub>high</sub> - I<sub>low</sub>) / (C<sub>high</sub> - C<sub>low</sub>
                  )] × (C - C<sub>low</sub>) + I<sub>low</sub>
                </p>
              </div>

              <p className="mb-4">Where:</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>
                  <strong>C</strong>: The concentration of the pollutant
                </li>
                <li>
                  <strong>
                    C<sub>low</sub>
                  </strong>
                  : The concentration breakpoint that is ≤ C
                </li>
                <li>
                  <strong>
                    C<sub>high</sub>
                  </strong>
                  : The concentration breakpoint that is ≥ C
                </li>
                <li>
                  <strong>
                    I<sub>low</sub>
                  </strong>
                  : The index breakpoint corresponding to C<sub>low</sub>
                </li>
                <li>
                  <strong>
                    I<sub>high</sub>
                  </strong>
                  : The index breakpoint corresponding to C<sub>high</sub>
                </li>
              </ul>

              <p>
                The overall AQI reported is the highest AQI value among all the considered
                pollutants. This approach ensures that the AQI reflects the pollutant with the most
                significant health impact at any given time.
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full border-sky-100">
            <CardHeader>
              <CardTitle className="text-xl text-sky-700">Our Process</CardTitle>
            </CardHeader>
            <CardContent>
              <AqiCalculationDiagram />

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Data Processing Steps</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>Data Collection</strong>: We retrieve real-time pollutant concentration
                    data from the OpenWeather API.
                  </li>
                  <li>
                    <strong>Unit Conversion</strong>: We convert the raw measurements to standard
                    units (μg/m³, ppb, or ppm) as needed.
                  </li>
                  <li>
                    <strong>AQI Calculation</strong>: For each pollutant, we apply the EPA formula
                    using the appropriate breakpoints.
                  </li>
                  <li>
                    <strong>Determining Overall AQI</strong>: We identify the highest individual
                    pollutant AQI value.
                  </li>
                  <li>
                    <strong>Categorization</strong>: We assign the appropriate category (Good,
                    Moderate, etc.) based on the AQI value.
                  </li>
                  <li>
                    <strong>Health Recommendations</strong>: We provide tailored health advice based
                    on the AQI level and dominant pollutant.
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
