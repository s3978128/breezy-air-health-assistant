import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PollutantDetailCard from './pollutant-detail-card'

export default function PollutantsExplained() {
  return (
    <section id="pollutants" className="scroll-mt-16">
      <h2 className="text-3xl font-bold text-sky-800 mb-6">Pollutants We Monitor</h2>

      <p className="text-gray-700 mb-6">
        Breezy monitors six key air pollutants that are included in the AQI calculation. Each
        pollutant has different sources, health effects, and thresholds. Understanding these
        pollutants can help you better interpret air quality data and take appropriate protective
        measures.
      </p>

      <Tabs defaultValue="pm25">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
          <TabsTrigger value="pm25">PM2.5</TabsTrigger>
          <TabsTrigger value="pm10">PM10</TabsTrigger>
          <TabsTrigger value="o3">O₃</TabsTrigger>
          <TabsTrigger value="no2">NO₂</TabsTrigger>
          <TabsTrigger value="so2">SO₂</TabsTrigger>
          <TabsTrigger value="co">CO</TabsTrigger>
        </TabsList>

        <TabsContent value="pm25">
          <PollutantDetailCard
            name="PM2.5"
            fullName="Fine Particulate Matter"
            description="Tiny particles less than 2.5 micrometers in diameter that can penetrate deep into the lungs and even enter the bloodstream."
            sources={[
              'Vehicle emissions',
              'Power plants',
              'Wood burning',
              'Industrial processes',
              'Wildfires',
            ]}
            healthEffects={[
              'Respiratory issues',
              'Heart problems',
              'Premature death in people with heart or lung disease',
              'Aggravated asthma',
              'Decreased lung function',
            ]}
            thresholds={[
              { scale: 'EPA AQI Good', value: '0-12.0 μg/m³' },
              { scale: 'EPA AQI Moderate', value: '12.1-35.4 μg/m³' },
              { scale: 'EPA AQI Unhealthy for Sensitive Groups', value: '35.5-55.4 μg/m³' },
              { scale: 'WHO Annual Guideline', value: '5 μg/m³' },
              { scale: 'WHO 24-hour Guideline', value: '15 μg/m³' },
            ]}
            unit="μg/m³"
            iconColor="bg-red-100 text-red-600"
          />
        </TabsContent>

        <TabsContent value="pm10">
          <PollutantDetailCard
            name="PM10"
            fullName="Coarse Particulate Matter"
            description="Particles between 2.5 and 10 micrometers in diameter that can be inhaled into the lungs."
            sources={[
              'Dust from roads and construction sites',
              'Agricultural operations',
              'Industrial processes',
              'Pollen and mold spores',
              'Mining operations',
            ]}
            healthEffects={[
              'Respiratory issues',
              'Aggravated asthma',
              'Decreased lung function',
              'Increased respiratory symptoms like coughing',
              'Irritation of airways',
            ]}
            thresholds={[
              { scale: 'EPA AQI Good', value: '0-54 μg/m³' },
              { scale: 'EPA AQI Moderate', value: '55-154 μg/m³' },
              { scale: 'EPA AQI Unhealthy for Sensitive Groups', value: '155-254 μg/m³' },
              { scale: 'WHO Annual Guideline', value: '15 μg/m³' },
              { scale: 'WHO 24-hour Guideline', value: '45 μg/m³' },
            ]}
            unit="μg/m³"
            iconColor="bg-orange-100 text-orange-600"
          />
        </TabsContent>

        <TabsContent value="o3">
          <PollutantDetailCard
            name="O₃"
            fullName="Ozone"
            description="A gas that occurs both in the Earth's upper atmosphere and at ground level. Ground-level ozone is a harmful air pollutant."
            sources={[
              'Created by chemical reactions between oxides of nitrogen (NOx) and volatile organic compounds (VOCs) in the presence of sunlight',
              'Vehicle exhaust',
              'Industrial emissions',
              'Chemical solvents',
              'Gasoline vapors',
            ]}
            healthEffects={[
              'Chest pain, coughing, throat irritation',
              'Airway inflammation',
              'Reduced lung function',
              'Worsening of bronchitis, emphysema, and asthma',
              'Long-term exposure may lead to permanent lung damage',
            ]}
            thresholds={[
              { scale: 'EPA AQI Good', value: '0-54 ppb' },
              { scale: 'EPA AQI Moderate', value: '55-70 ppb' },
              { scale: 'EPA AQI Unhealthy for Sensitive Groups', value: '71-85 ppb' },
              { scale: 'WHO 8-hour Guideline', value: '100 μg/m³ (about 50 ppb)' },
            ]}
            unit="ppb"
            iconColor="bg-blue-100 text-blue-600"
          />
        </TabsContent>

        <TabsContent value="no2">
          <PollutantDetailCard
            name="NO₂"
            fullName="Nitrogen Dioxide"
            description="A reddish-brown gas with a pungent odor that is a major component of urban air pollution."
            sources={[
              'Burning of fuel in vehicles',
              'Power plants',
              'Industrial processes',
              'Off-road equipment',
              'Residential heating',
            ]}
            healthEffects={[
              'Irritation of airways',
              'Aggravated respiratory diseases, especially asthma',
              'Increased susceptibility to respiratory infections',
              'Contribution to the formation of fine particle pollution',
              'Contribution to the formation of ozone',
            ]}
            thresholds={[
              { scale: 'EPA AQI Good', value: '0-53 ppb' },
              { scale: 'EPA AQI Moderate', value: '54-100 ppb' },
              { scale: 'EPA AQI Unhealthy for Sensitive Groups', value: '101-360 ppb' },
              { scale: 'WHO Annual Guideline', value: '10 μg/m³ (about 5 ppb)' },
              { scale: 'WHO 24-hour Guideline', value: '25 μg/m³ (about 13 ppb)' },
            ]}
            unit="ppb"
            iconColor="bg-amber-100 text-amber-600"
          />
        </TabsContent>

        <TabsContent value="so2">
          <PollutantDetailCard
            name="SO₂"
            fullName="Sulfur Dioxide"
            description="A colorless gas with a sharp odor that can harm the human respiratory system and make breathing difficult."
            sources={[
              'Burning of fossil fuels at power plants',
              'Industrial facilities',
              'Heavy equipment that burns fuel with high sulfur content',
              'Volcanic eruptions',
              'Ships and other vehicles that burn high-sulfur fuel',
            ]}
            healthEffects={[
              'Respiratory irritation',
              'Bronchoconstriction (narrowing of airways)',
              'Aggravated asthma',
              'Contribution to particle formation that can affect lung and heart function',
              'Environmental impacts including acid rain',
            ]}
            thresholds={[
              { scale: 'EPA AQI Good', value: '0-35 ppb' },
              { scale: 'EPA AQI Moderate', value: '36-75 ppb' },
              { scale: 'EPA AQI Unhealthy for Sensitive Groups', value: '76-185 ppb' },
              { scale: 'WHO 24-hour Guideline', value: '40 μg/m³ (about 15 ppb)' },
            ]}
            unit="ppb"
            iconColor="bg-yellow-100 text-yellow-600"
          />
        </TabsContent>

        <TabsContent value="co">
          <PollutantDetailCard
            name="CO"
            fullName="Carbon Monoxide"
            description="A colorless, odorless gas that can be harmful when inhaled in large amounts. It reduces oxygen delivery to the body's organs."
            sources={[
              'Vehicle exhaust',
              'Fuel combustion in industrial processes',
              'Residential wood burning',
              'Natural sources like wildfires',
              'Indoor sources like gas stoves and furnaces',
            ]}
            healthEffects={[
              'Reduced oxygen delivery to body organs and tissues',
              'Headache, dizziness, and nausea at lower concentrations',
              'Confusion and unconsciousness at higher concentrations',
              'Particularly dangerous for people with heart disease',
              'Can cause death at very high concentrations',
            ]}
            thresholds={[
              { scale: 'EPA AQI Good', value: '0-4.4 ppm' },
              { scale: 'EPA AQI Moderate', value: '4.5-9.4 ppm' },
              { scale: 'EPA AQI Unhealthy for Sensitive Groups', value: '9.5-12.4 ppm' },
              { scale: 'WHO 24-hour Guideline', value: '4 mg/m³ (about 3.5 ppm)' },
            ]}
            unit="ppm"
            iconColor="bg-gray-100 text-gray-600"
          />
        </TabsContent>
      </Tabs>

      <Card className="mt-8 border-sky-100">
        <CardHeader>
          <CardTitle className="text-xl text-sky-700">How Pollutants Are Measured</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-2">Measurement Units</h3>
              <p className="mb-4">Different pollutants are measured using different units:</p>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>μg/m³ (micrograms per cubic meter)</strong>: Used for particle pollution
                  (PM2.5, PM10)
                </li>
                <li>
                  <strong>ppb (parts per billion)</strong>: Used for ozone (O₃), nitrogen dioxide
                  (NO₂), and sulfur dioxide (SO₂)
                </li>
                <li>
                  <strong>ppm (parts per million)</strong>: Used for carbon monoxide (CO)
                </li>
              </ul>

              <p>
                These measurements represent the concentration of the pollutant in the air. The
                higher the concentration, the more pollutant is present in the air you breathe.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Unit Conversions</h3>
              <p className="mb-4">
                When calculating AQI, we sometimes need to convert between different units. For
                example:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Converting from μg/m³ to ppb for gases requires the molecular weight of the gas
                </li>
                <li>The formula used is: ppb = (μg/m³ × 24.45) ÷ molecular weight</li>
                <li>
                  24.45 is the molar volume of air in liters at standard temperature and pressure
                </li>
                <li>For example, to convert NO₂: ppb = (μg/m³ × 24.45) ÷ 46.01</li>
              </ul>

              <div className="mt-4 p-3 bg-sky-50 rounded-md">
                <p className="text-sm text-sky-800">
                  <strong>Note:</strong> Breezy handles all these conversions automatically, so you
                  always see consistent and accurate AQI values regardless of how the original data
                  was measured.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
