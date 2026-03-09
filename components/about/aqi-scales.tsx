import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AqiScaleChart from './aqi-scale-chart'

export default function AqiScales() {
  return (
    <section id="aqi-scales" className="scroll-mt-16">
      <h2 className="text-3xl font-bold text-sky-800 mb-6">Understanding AQI Scales</h2>

      <Tabs defaultValue="us-epa">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="us-epa">US EPA Scale</TabsTrigger>
          <TabsTrigger value="who">WHO Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="us-epa" className="mt-6">
          <Card className="border-sky-100">
            <CardHeader>
              <CardTitle className="text-xl text-sky-700">US EPA Air Quality Index</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="mb-4">
                    The US Environmental Protection Agency (EPA) developed the Air Quality Index
                    (AQI) to standardize how air quality is reported across the United States. This
                    scale ranges from 0 to 500, with higher values indicating worse air quality.
                  </p>

                  <p className="mb-4">
                    The EPA AQI is divided into six categories, each with a specific color code and
                    health implications:
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium">Good (0-50)</p>
                        <p className="text-sm text-gray-600">
                          Air quality is satisfactory with little or no risk.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-yellow-400 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium">Moderate (51-100)</p>
                        <p className="text-sm text-gray-600">
                          Acceptable air quality, but some concern for very sensitive individuals.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-orange-500 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium">Unhealthy for Sensitive Groups (101-150)</p>
                        <p className="text-sm text-gray-600">
                          Members of sensitive groups may experience health effects.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-red-500 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium">Unhealthy (151-200)</p>
                        <p className="text-sm text-gray-600">
                          Everyone may begin to experience health effects.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-purple-600 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium">Very Unhealthy (201-300)</p>
                        <p className="text-sm text-gray-600">
                          Health alert: everyone may experience more serious health effects.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-rose-900 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium">Hazardous (301-500)</p>
                        <p className="text-sm text-gray-600">
                          Health warnings of emergency conditions; entire population likely
                          affected.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <AqiScaleChart scale="us-epa" />

                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-2">How We Use This Scale</h3>
                    <p className="mb-3">
                      Breezy primarily uses the US EPA AQI scale for reporting air quality because:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>It's widely recognized and used internationally</li>
                      <li>It provides clear health-based categories</li>
                      <li>It accounts for multiple pollutants</li>
                      <li>It's designed to be easily understood by the general public</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="who" className="mt-6">
          <Card className="border-sky-100">
            <CardHeader>
              <CardTitle className="text-xl text-sky-700">WHO Air Quality Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="mb-4">
                    The World Health Organization (WHO) provides Air Quality Guidelines (AQGs) that
                    are concentration-based rather than index-based. These guidelines represent the
                    concentrations below which no adverse health effects are expected.
                  </p>

                  <p className="mb-4">
                    The WHO updated its guidelines in 2021, significantly lowering the recommended
                    thresholds based on new evidence of health effects at lower concentrations than
                    previously understood.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 mb-4">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-2 px-4 border-b text-left">Pollutant</th>
                          <th className="py-2 px-4 border-b text-left">Averaging Time</th>
                          <th className="py-2 px-4 border-b text-left">2021 Guideline Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2 px-4 border-b">PM2.5</td>
                          <td className="py-2 px-4 border-b">Annual</td>
                          <td className="py-2 px-4 border-b">5 μg/m³</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b">PM2.5</td>
                          <td className="py-2 px-4 border-b">24-hour</td>
                          <td className="py-2 px-4 border-b">15 μg/m³</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b">PM10</td>
                          <td className="py-2 px-4 border-b">Annual</td>
                          <td className="py-2 px-4 border-b">15 μg/m³</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b">PM10</td>
                          <td className="py-2 px-4 border-b">24-hour</td>
                          <td className="py-2 px-4 border-b">45 μg/m³</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b">O₃</td>
                          <td className="py-2 px-4 border-b">8-hour</td>
                          <td className="py-2 px-4 border-b">100 μg/m³</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b">NO₂</td>
                          <td className="py-2 px-4 border-b">Annual</td>
                          <td className="py-2 px-4 border-b">10 μg/m³</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b">NO₂</td>
                          <td className="py-2 px-4 border-b">24-hour</td>
                          <td className="py-2 px-4 border-b">25 μg/m³</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b">SO₂</td>
                          <td className="py-2 px-4 border-b">24-hour</td>
                          <td className="py-2 px-4 border-b">40 μg/m³</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b">CO</td>
                          <td className="py-2 px-4 border-b">24-hour</td>
                          <td className="py-2 px-4 border-b">4 mg/m³</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <AqiScaleChart scale="who" />

                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-2">WHO vs. EPA Comparison</h3>
                    <p className="mb-3">
                      The WHO guidelines are generally stricter than the EPA standards:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        WHO PM2.5 annual guideline (5 μg/m³) is less than half of the EPA's lowest
                        "Good" threshold (12 μg/m³)
                      </li>
                      <li>WHO focuses on concentration thresholds rather than an index system</li>
                      <li>
                        WHO guidelines are health-based recommendations, while EPA standards are
                        regulatory
                      </li>
                      <li>
                        WHO's 2021 update significantly lowered thresholds based on new health
                        evidence
                      </li>
                    </ul>

                    <p className="mt-4 text-sm bg-sky-50 p-3 rounded-md">
                      <strong>Note:</strong> While Breezy primarily uses the EPA AQI scale for
                      consistency and clarity, we recognize that the WHO guidelines represent the
                      most current scientific understanding of health impacts. For the most
                      health-protective approach, consider both scales when interpreting air quality
                      data.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
