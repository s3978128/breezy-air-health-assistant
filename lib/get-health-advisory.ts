interface UserHealthProfile {
  sensitiveGroup: boolean
  healthConditions: {
    asthma: boolean
    copd: boolean
    heartDisease: boolean
    allergies: boolean
    none: boolean
  }
}

export function getHealthAdvisories(aqi = 42, userProfile: UserHealthProfile | null = null) {
  // Different recommendations based on AQI level
  let advisories: {
    general: { title: string; description: string; recommendations: string[] }
    sensitive: { title: string; description: string; recommendations: string[] }
    symptoms: string[]
    personalized?: { title: string; recommendations: string[] }
  } | null = null

  if (aqi <= 50) {
    advisories = {
      general: {
        title: 'Good Air Quality',
        description:
          'Air quality is considered satisfactory, and air pollution poses little or no risk.',
        recommendations: [
          'Ideal for outdoor activities',
          'No special precautions needed',
          'Enjoy the fresh air!',
        ],
      },
      sensitive: {
        title: 'Good for Sensitive Groups',
        description:
          'Air quality is good for sensitive individuals including children, elderly, and those with respiratory conditions.',
        recommendations: [
          'Great time for outdoor activities',
          'Monitor any unusual symptoms',
          'Stay hydrated when outdoors',
        ],
      },
      symptoms: [
        'No symptoms expected from air quality',
        'If experiencing respiratory issues, they are likely unrelated to air quality',
      ],
    }
  } else if (aqi <= 100) {
    advisories = {
      general: {
        title: 'Moderate Air Quality',
        description:
          'Air quality is acceptable; however, there may be a moderate health concern for a very small number of people.',
        recommendations: [
          'Most people can continue outdoor activities',
          'Consider reducing prolonged or heavy exertion outdoors',
          'Watch for symptoms like coughing or shortness of breath',
        ],
      },
      sensitive: {
        title: 'Caution for Sensitive Groups',
        description:
          'People with respiratory or heart conditions, the elderly and children should limit prolonged outdoor exertion.',
        recommendations: [
          'Consider reducing prolonged outdoor activities',
          'Take more breaks during outdoor activities',
          'Monitor for respiratory symptoms',
        ],
      },
      symptoms: [
        'Unusual coughing or throat irritation',
        'Mild shortness of breath with exertion',
        'Slight irritation of eyes or nose',
      ],
    }
  } else if (aqi <= 150) {
    advisories = {
      general: {
        title: 'Unhealthy for Sensitive Groups',
        description:
          'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
        recommendations: [
          'Reduce prolonged or heavy exertion outdoors',
          'Take more breaks during outdoor activities',
          'Consider moving activities indoors',
        ],
      },
      sensitive: {
        title: 'Warning for Sensitive Groups',
        description:
          'People with respiratory or heart conditions, the elderly and children should avoid outdoor exertion.',
        recommendations: [
          'Avoid outdoor activities',
          'Keep windows and doors closed',
          'Use air purifiers if available',
        ],
      },
      symptoms: [
        'Coughing or throat irritation',
        'Shortness of breath',
        'Wheezing, especially during exercise',
        'Chest tightness or pain',
        'Fatigue or headaches',
      ],
    }
  } else {
    // Higher AQI levels would have more restrictive recommendations
    advisories = {
      general: {
        title: 'Unhealthy Air Quality',
        description:
          'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
        recommendations: [
          'Avoid prolonged or heavy exertion outdoors',
          'Consider moving all activities indoors',
          'Keep windows and doors closed',
          'Use air purifiers if available',
        ],
      },
      sensitive: {
        title: 'Dangerous for Sensitive Groups',
        description:
          'People with respiratory or heart conditions, the elderly and children should avoid all outdoor activities.',
        recommendations: [
          'Stay indoors as much as possible',
          'Keep windows and doors closed tightly',
          'Run air purifiers continuously',
          'Consider wearing N95 masks if you must go outside',
        ],
      },
      symptoms: [
        'Persistent coughing',
        'Significant shortness of breath',
        'Wheezing or difficulty breathing',
        'Chest pain or discomfort',
        'Unusual fatigue or weakness',
        'Eye, nose, or throat irritation',
        'Headaches',
      ],
    }
  }

  // Add personalized recommendations if user profile is available
  if (userProfile) {
    const personalizedRecommendations = []

    if (aqi > 50) {
      if (userProfile.healthConditions.asthma) {
        personalizedRecommendations.push('Keep your rescue inhaler accessible at all times')
        personalizedRecommendations.push(
          'Consider using a preventative inhaler before going outdoors',
        )
      }

      if (userProfile.healthConditions.copd) {
        personalizedRecommendations.push('Monitor oxygen levels if you have a pulse oximeter')
        personalizedRecommendations.push('Follow your COPD action plan if symptoms worsen')
      }

      if (userProfile.healthConditions.heartDisease) {
        personalizedRecommendations.push('Limit physical exertion outdoors')
        personalizedRecommendations.push('Monitor for unusual heart symptoms like palpitations')
      }

      if (userProfile.healthConditions.allergies) {
        personalizedRecommendations.push('Consider wearing a mask when outdoors')
        personalizedRecommendations.push('Take your allergy medication as prescribed')
      }
    }

    if (userProfile.sensitiveGroup) {
      personalizedRecommendations.push(
        'As a member of a sensitive group, consider staying indoors during peak pollution hours',
      )
    }

    if (personalizedRecommendations.length > 0) {
      advisories.personalized = {
        title: 'Your Personalized Recommendations',
        recommendations: personalizedRecommendations,
      }
    }
  }

  return advisories
}
