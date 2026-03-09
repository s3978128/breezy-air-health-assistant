// Utility to generate realistic but random air quality data
export interface AirQualityData {
  location: string
  aqi: number
  category: string
  color: string
  pollutants: {
    pm25: number
    pm10: number
    o3: number
    no2: number
    so2: number
    co: number
  }
  timestamp: string
  mainPollutant: string
  healthImplications: string
  cautionaryStatement: string
  openWeatherAQI: number
}

// Get AQI category and color based on AQI value
export function getAqiInfo(aqi: number): { category: string; color: string } {
  if (aqi <= 50) return { category: 'Good', color: 'green' }
  if (aqi <= 100) return { category: 'Moderate', color: 'yellow' }
  if (aqi <= 150) return { category: 'Unhealthy for Sensitive Groups', color: 'orange' }
  if (aqi <= 200) return { category: 'Unhealthy', color: 'red' }
  if (aqi <= 300) return { category: 'Very Unhealthy', color: 'purple' }
  return { category: 'Hazardous', color: 'maroon' }
}

// Get health implications based on AQI
export function getHealthImplications(aqi: number): string {
  if (aqi <= 50) return 'Air quality is satisfactory, and air pollution poses little or no risk.'
  if (aqi <= 100)
    return 'Air quality is acceptable. However, some pollutants may be a concern for a small number of people.'
  if (aqi <= 150)
    return 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.'
  if (aqi <= 200)
    return 'Everyone may begin to experience health effects. Members of sensitive groups may experience more serious health effects.'
  if (aqi <= 300) return 'Health alert: everyone may experience more serious health effects.'
  return 'Health warning of emergency conditions: everyone is more likely to be affected.'
}

// Get cautionary statement based on AQI
export function getCautionaryStatement(aqi: number): string {
  if (aqi <= 50) return 'None'
  if (aqi <= 100)
    return 'Unusually sensitive people should consider reducing prolonged or heavy outdoor exertion.'
  if (aqi <= 150)
    return 'People with respiratory or heart conditions, the elderly and children should limit prolonged outdoor exertion.'
  if (aqi <= 200)
    return 'People with respiratory or heart conditions, the elderly and children should avoid prolonged outdoor exertion; everyone else should limit prolonged outdoor exertion.'
  if (aqi <= 300)
    return 'People with respiratory or heart conditions, the elderly and children should avoid any outdoor activity; everyone else should avoid prolonged outdoor exertion.'
  return 'Everyone should avoid any outdoor exertion; people with respiratory or heart conditions, the elderly and children should remain indoors.'
}

// Determine main pollutant based on pollutant levels
export function getMainPollutant(pollutants: Record<string, number>): string {
  // Calculate normalized values (percentage of threshold)
  const normalized = {
    pm25: pollutants.pm25 / 12, // Good threshold is 12
    pm10: pollutants.pm10 / 54, // Good threshold is 54
    o3: pollutants.o3 / 54, // Good threshold is 54 ppb
    no2: pollutants.no2 / 53, // Good threshold is 53 ppb
    so2: pollutants.so2 / 35, // Good threshold is 35 ppb
    co: pollutants.co / 4.4, // Good threshold is 4.4 ppm
  }

  // Find the pollutant with the highest normalized value
  let maxPollutant = 'pm25'
  let maxValue = normalized.pm25

  for (const [pollutant, value] of Object.entries(normalized)) {
    if (value > maxValue) {
      maxValue = value
      maxPollutant = pollutant
    }
  }

  // Convert to display name
  const pollutantNames: Record<string, string> = {
    pm25: 'PM2.5',
    pm10: 'PM10',
    o3: 'Ozone',
    no2: 'NO₂',
    so2: 'SO₂',
    co: 'CO',
  }

  return pollutantNames[maxPollutant] || maxPollutant
}

// Generate random air quality data
export function generateAirQualityData(location = 'New York'): AirQualityData {
  // Generate a realistic but random AQI value (weighted towards moderate values)
  const rand = Math.random()
  let aqi: number

  if (rand < 0.3) {
    // 30% chance of good air quality (0-50)
    aqi = Math.floor(Math.random() * 40) + 10
  } else if (rand < 0.7) {
    // 40% chance of moderate air quality (51-100)
    aqi = Math.floor(Math.random() * 50) + 51
  } else if (rand < 0.9) {
    // 20% chance of unhealthy for sensitive groups (101-150)
    aqi = Math.floor(Math.random() * 50) + 101
  } else {
    // 10% chance of unhealthy or worse (151+)
    aqi = Math.floor(Math.random() * 100) + 151
  }

  // Generate pollutant values that align with the AQI
  // The main pollutant should have a value that corresponds to the AQI
  const aqiScale = aqi / 100 // Scale factor based on AQI

  // Add some randomness to each pollutant
  const randomFactor = () => 0.7 + Math.random() * 0.6 // Between 0.7 and 1.3

  const pollutants = {
    pm25: +(Math.min(35, 5 + aqiScale * 30) * randomFactor()).toFixed(1),
    pm10: +(Math.min(150, 20 + aqiScale * 130) * randomFactor()).toFixed(1),
    o3: +(Math.min(70, 20 + aqiScale * 50) * randomFactor()).toFixed(1),
    no2: +(Math.min(100, 10 + aqiScale * 90) * randomFactor()).toFixed(1),
    so2: +(Math.min(30, 2 + aqiScale * 28) * randomFactor()).toFixed(1),
    co: +(Math.min(4, 0.5 + aqiScale * 3.5) * randomFactor()).toFixed(1),
  }

  const { category, color } = getAqiInfo(aqi)
  const mainPollutant = getMainPollutant(pollutants)
  const healthImplications = getHealthImplications(aqi)
  const cautionaryStatement = getCautionaryStatement(aqi)

  return {
    location,
    aqi,
    category,
    color,
    pollutants,
    timestamp: new Date().toISOString(),
    mainPollutant,
    healthImplications,
    cautionaryStatement,
  }
}

// Get pollutant unit
export function getPollutantUnit(pollutant: string): string {
  switch (pollutant) {
    case 'pm25':
    case 'PM2.5':
    case 'pm10':
    case 'PM10':
      return 'μg/m³'
    case 'o3':
    case 'Ozone':
    case 'no2':
    case 'NO₂':
    case 'so2':
    case 'SO₂':
      return 'ppb'
    case 'co':
    case 'CO':
      return 'ppm'
    default:
      return ''
  }
}

// Get pollutant full name
export function getPollutantName(pollutant: string): string {
  switch (pollutant) {
    case 'pm25':
      return 'PM2.5'
    case 'pm10':
      return 'PM10'
    case 'o3':
      return 'Ozone'
    case 'no2':
      return 'NO₂'
    case 'so2':
      return 'SO₂'
    case 'co':
      return 'CO'
    default:
      return pollutant
  }
}

// Get pollutant category based on value
export function getPollutantCategory(
  pollutant: string,
  value: number,
): { category: string; color: string } {
  switch (pollutant) {
    case 'pm25':
    case 'PM2.5':
      if (value <= 12) return { category: 'Good', color: 'green' }
      if (value <= 35.4) return { category: 'Moderate', color: 'yellow' }
      if (value <= 55.4) return { category: 'Unhealthy for Sensitive Groups', color: 'orange' }
      if (value <= 150.4) return { category: 'Unhealthy', color: 'red' }
      return { category: 'Very Unhealthy', color: 'purple' }

    case 'pm10':
    case 'PM10':
      if (value <= 54) return { category: 'Good', color: 'green' }
      if (value <= 154) return { category: 'Moderate', color: 'yellow' }
      if (value <= 254) return { category: 'Unhealthy for Sensitive Groups', color: 'orange' }
      if (value <= 354) return { category: 'Unhealthy', color: 'red' }
      return { category: 'Very Unhealthy', color: 'purple' }

    case 'o3':
    case 'Ozone':
      if (value <= 54) return { category: 'Good', color: 'green' }
      if (value <= 70) return { category: 'Moderate', color: 'yellow' }
      if (value <= 85) return { category: 'Unhealthy for Sensitive Groups', color: 'orange' }
      if (value <= 105) return { category: 'Unhealthy', color: 'red' }
      return { category: 'Very Unhealthy', color: 'purple' }

    case 'no2':
    case 'NO₂':
      if (value <= 53) return { category: 'Good', color: 'green' }
      if (value <= 100) return { category: 'Moderate', color: 'yellow' }
      if (value <= 360) return { category: 'Unhealthy for Sensitive Groups', color: 'orange' }
      if (value <= 649) return { category: 'Unhealthy', color: 'red' }
      return { category: 'Very Unhealthy', color: 'purple' }

    case 'so2':
    case 'SO₂':
      if (value <= 35) return { category: 'Good', color: 'green' }
      if (value <= 75) return { category: 'Moderate', color: 'yellow' }
      if (value <= 185) return { category: 'Unhealthy for Sensitive Groups', color: 'orange' }
      if (value <= 304) return { category: 'Unhealthy', color: 'red' }
      return { category: 'Very Unhealthy', color: 'purple' }

    case 'co':
    case 'CO':
      if (value <= 4.4) return { category: 'Good', color: 'green' }
      if (value <= 9.4) return { category: 'Moderate', color: 'yellow' }
      if (value <= 12.4) return { category: 'Unhealthy for Sensitive Groups', color: 'orange' }
      if (value <= 15.4) return { category: 'Unhealthy', color: 'red' }
      return { category: 'Very Unhealthy', color: 'purple' }

    default:
      return { category: 'Unknown', color: 'gray' }
  }
}
