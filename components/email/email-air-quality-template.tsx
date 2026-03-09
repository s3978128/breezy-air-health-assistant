import { getPollutantCategory } from '@/utils/air-quality-data'
import * as React from 'react'

interface EmailTemplateProps {
  location: string
  aqi: number
  category: string
  openWeatherAQI: number
  healthImplications: string
  cautionaryStatement: string
  pm25: number
  pm10: number
  o3: number
  no2: number
  so2: number
  co: number
  formattedTime: string
  email: string
  message: string
}

const getOpenWeatherRating = (aqi: number) => {
  switch (aqi) {
    case 1:
      return 'Good'
    case 2:
      return 'Fair'
    case 3:
      return 'Moderate'
    case 4:
      return 'Poor'
    case 5:
      return 'Very Poor'
    default:
      return 'Unknown'
  }
}

const getColorClass = (aqi: number) => {
  if (aqi <= 50) return '#28a745' // Green
  if (aqi <= 100) return '#ffc107' // Yellow
  if (aqi <= 150) return '#fd7e14' // Orange
  if (aqi <= 200) return '#dc3545' // Red
  if (aqi <= 300) return '#6f42c1' // Purple
  return '#e83e8c' // Rose
}

const getPollutantCategoryAndColor = (pollutant: string, value: number, unit: string) => {
  const { category, color } = getPollutantCategory(pollutant, value)
  color === 'green'
    ? '#16a34a' // green-600
    : color === 'yellow'
      ? '#ca8a04' // yellow-600
      : color === 'orange'
        ? '#ea580c' // orange-600
        : color === 'red'
          ? '#dc2626' // red-600
          : '#9333ea' // purple-600
  if (unit === 'category') return category
  if (unit === 'color') return color
  return null
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  location,
  aqi,
  category,
  openWeatherAQI,
  healthImplications,
  cautionaryStatement,
  pm25,
  pm10,
  o3,
  no2,
  so2,
  co,
  formattedTime,
  email,
  message,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px', lineHeight: '1.6' }}>
    {/* Title */}
    <h1
      style={{
        background: 'linear-gradient(to right, #0284c7,#0ea5e9 )', // sky-500 to sky-600 equivalent
        color: '#ddd',
        padding: '10px 0',
        textAlign: 'center',
      }}
    >
      This {message} email is sent to {email}
    </h1>
    {/* Air quality */}
    <div style={{ marginTop: '5px' }}>
      {/* Location and updated time */}
      <div>
        <p style={{ fontSize: '12px', color: '#6c757d' }}>{`Updated: ${formattedTime}`}</p>
        <h2 style={{ fontSize: '18px', fontWeight: '500' }}>
          Air Quality in <strong>{location}</strong>
        </h2>
      </div>

      {/* Aqi detail */}
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
        }}
      >
        {/* aqi */}
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <h2 style={{ fontSize: '50px', fontWeight: 'bold', margin: 'auto' }}>{aqi}</h2>
            <div style={{ fontSize: '18px', fontWeight: '500', color: getColorClass(aqi) }}>
              {category}
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              OpenWeather AQI: <span style={{ fontWeight: '500' }}>{openWeatherAQI}</span> (
              {getOpenWeatherRating(openWeatherAQI)})
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', maxWidth: '300px', margin: 'auto' }}>
            <div style={{ height: '15px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(aqi / 3, 100)}%`,
                  backgroundColor: getColorClass(aqi),
                  borderRadius: '8px',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                marginTop: '5px',
              }}
            >
              <span>0</span>
              <span>50</span>
              <span>100</span>
              <span>150</span>
              <span>200</span>
              <span>300+</span>
            </div>
          </div>
        </div>
        {/* Health impact */}
        <div
          style={{
            backgroundColor: '#f1f3f5',
            padding: '5px 15px',
            borderRadius: '8px',
          }}
        >
          <h2 style={{ fontWeight: '500' }}>Health Impact</h2>
          <p style={{ fontSize: '16px', color: '#495057' }}>{healthImplications}</p>
          {cautionaryStatement !== 'None' && (
            <div style={{ paddingTop: '5px', borderTop: '1px solid #ddd' }}>
              <p style={{ fontSize: '16px', color: '#ffc107' }}>{cautionaryStatement}</p>
            </div>
          )}
        </div>
        {/* Pollutant Data (simplified) */}
        <div style={{ padding: '10px 15px' }}>
          <h2>Pollutants</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '15px',
            }}
          >
            <div
              style={{
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                borderLeft: '5px solid green',
                marginBottom: '15px',
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: '500' }}>PM2.5</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                {typeof pm25 === 'number' ? pm25.toFixed(1) : pm25}
                <span style={{ fontSize: '12px', color: '#6c757d' }}> µg/m³</span>
              </div>

              <div style={{ color: getPollutantCategoryAndColor('pm25', pm25, 'color') || '#000' }}>
                {getPollutantCategoryAndColor('pm25', pm25, 'category')}
              </div>
            </div>

            <div
              style={{
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                borderLeft: '5px solid green',
                marginBottom: '15px',
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: '500' }}>PM10</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                {typeof pm10 === 'number' ? pm10.toFixed(1) : pm10}
                <span style={{ fontSize: '12px', color: '#6c757d' }}> µg/m³</span>
              </div>
              <div style={{ color: getPollutantCategoryAndColor('pm10', pm10, 'color') || '#000' }}>
                {getPollutantCategoryAndColor('pm10', pm10, 'category')}
              </div>
            </div>

            <div
              style={{
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                borderLeft: '5px solid green',
                marginBottom: '15px',
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: '500' }}>O₃ (Ozone)</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                {typeof o3 === 'number' ? o3.toFixed(1) : o3}
                <span style={{ fontSize: '12px', color: '#6c757d' }}> µg/m³</span>
              </div>
              <div style={{ color: getPollutantCategoryAndColor('o3', o3, 'color') || '#000' }}>
                {getPollutantCategoryAndColor('o3', o3, 'category')}
              </div>
            </div>

            <div
              style={{
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                borderLeft: '5px solid green',
                marginBottom: '15px',
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: '500' }}>NO₂ (Nitrogen Dioxide)</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                {typeof no2 === 'number' ? no2.toFixed(1) : no2}
                <span style={{ fontSize: '12px', color: '#6c757d' }}> µg/m³</span>
              </div>
              <div style={{ color: getPollutantCategoryAndColor('no2', no2, 'color') || '#000' }}>
                {getPollutantCategoryAndColor('no2', no2, 'category')}
              </div>
            </div>

            <div
              style={{
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                borderLeft: '5px solid green',
                marginBottom: '15px',
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: '500' }}>SO₂ (Sulfur Dioxide)</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                {typeof so2 === 'number' ? so2.toFixed(1) : so2}
                <span style={{ fontSize: '12px', color: '#6c757d' }}> µg/m³</span>
              </div>
              <div style={{ color: getPollutantCategoryAndColor('so2', so2, 'color') || '#000' }}>
                {getPollutantCategoryAndColor('so2', so2, 'category')}
              </div>
            </div>

            <div
              style={{
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                borderLeft: '5px solid green',
                marginBottom: '15px',
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: '500' }}>CO (Carbon Monoxide)</span>
              </div>

              <div style={{ fontSize: '18px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                {typeof co === 'number' ? co.toFixed(1) : co}
                <span style={{ fontSize: '12px', color: '#6c757d' }}> µg/m³</span>
              </div>
              <div style={{ color: getPollutantCategoryAndColor('co', co, 'color') || '#000' }}>
                {getPollutantCategoryAndColor('co', co, 'category')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
