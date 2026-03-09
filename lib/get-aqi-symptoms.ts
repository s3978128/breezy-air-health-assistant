/**
 * Returns a list of symptoms that may be related to the current AQI level
 * The symptoms are dynamically adjusted based on the severity of air pollution
 */
export function getAqiRelatedSymptoms(aqi: number): string[] {
  // Base symptoms that can appear at any AQI level
  const baseSymptoms = ['Coughing', 'Sneezing', 'Runny nose']

  // AQI-specific symptoms
  if (aqi <= 50) {
    // Good air quality - minimal symptoms
    return baseSymptoms
  } else if (aqi <= 100) {
    // Moderate air quality
    return [
      ...baseSymptoms,
      'Mild throat irritation',
      'Mild eye irritation',
      'Slight shortness of breath during exercise',
    ]
  } else if (aqi <= 150) {
    // Unhealthy for sensitive groups
    return [
      ...baseSymptoms,
      'Throat irritation',
      'Eye irritation',
      'Chest discomfort',
      'Shortness of breath',
      'Wheezing (especially in asthmatics)',
      'Fatigue during outdoor activities',
    ]
  } else if (aqi <= 200) {
    // Unhealthy
    return [
      ...baseSymptoms,
      'Severe throat irritation',
      'Severe eye irritation',
      'Chest pain or discomfort',
      'Difficulty breathing',
      'Wheezing',
      'Increased fatigue',
      'Headache',
      'Dizziness',
    ]
  } else if (aqi <= 300) {
    // Very unhealthy
    return [
      ...baseSymptoms,
      'Severe throat irritation',
      'Severe eye irritation',
      'Chest pain or tightness',
      'Difficulty breathing',
      'Wheezing',
      'Severe fatigue',
      'Headache',
      'Dizziness',
      'Nausea',
      'Irregular heartbeat',
    ]
  } else {
    // Hazardous
    return [
      ...baseSymptoms,
      'Severe throat pain',
      'Severe eye pain',
      'Severe chest pain',
      'Severe difficulty breathing',
      'Severe wheezing',
      'Extreme fatigue',
      'Severe headache',
      'Severe dizziness',
      'Nausea and vomiting',
      'Irregular heartbeat',
      'Confusion',
      'Decreased consciousness',
    ]
  }
}
