'use client'

import { useEffect, useRef } from 'react'

interface AqiScaleChartProps {
  scale: 'us-epa' | 'who'
}

export default function AqiScaleChart({ scale }: AqiScaleChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = 300

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (scale === 'us-epa') {
      drawEpaScale(ctx, canvas.width, canvas.height)
    } else {
      drawWhoScale(ctx, canvas.width, canvas.height)
    }
  }, [scale])

  const drawEpaScale = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // EPA AQI categories
    const categories = [
      { name: 'Good', range: [0, 50], color: '#10b981' },
      { name: 'Moderate', range: [51, 100], color: '#fbbf24' },
      { name: 'Unhealthy for Sensitive Groups', range: [101, 150], color: '#f97316' },
      { name: 'Unhealthy', range: [151, 200], color: '#ef4444' },
      { name: 'Very Unhealthy', range: [201, 300], color: '#9333ea' },
      { name: 'Hazardous', range: [301, 500], color: '#881337' },
    ]

    // Draw vertical scale
    const maxAqi = 500
    const scaleHeight = height - 60
    const scaleWidth = 60
    const scaleX = width / 2 - scaleWidth / 2
    const scaleY = 30

    // Draw the scale background
    categories.forEach((category) => {
      const startY = scaleY + scaleHeight * (1 - category.range[1] / maxAqi)
      const endY = scaleY + scaleHeight * (1 - category.range[0] / maxAqi)
      const segmentHeight = endY - startY

      ctx.fillStyle = category.color
      ctx.fillRect(scaleX, startY, scaleWidth, segmentHeight)

      // Add category label
      ctx.fillStyle = '#1e293b'
      ctx.font = '12px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'

      // Only show label if segment is tall enough
      if (segmentHeight > 20) {
        const midY = startY + segmentHeight / 2
        ctx.fillText(category.name, scaleX + scaleWidth + 10, midY)
      }
    })

    // Draw scale border
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 1
    ctx.strokeRect(scaleX, scaleY, scaleWidth, scaleHeight)

    // Draw scale ticks and values
    const ticks = [0, 50, 100, 150, 200, 300, 500]
    ctx.fillStyle = '#1e293b'
    ctx.font = '12px Inter, sans-serif'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'

    ticks.forEach((tick) => {
      const tickY = scaleY + scaleHeight * (1 - tick / maxAqi)

      // Draw tick
      ctx.beginPath()
      ctx.moveTo(scaleX - 5, tickY)
      ctx.lineTo(scaleX, tickY)
      ctx.stroke()

      // Draw value
      ctx.fillText(tick.toString(), scaleX - 10, tickY)
    })

    // Add title
    ctx.fillStyle = '#0c4a6e'
    ctx.font = 'bold 14px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText('US EPA AQI Scale', width / 2, 10)
  }

  const drawWhoScale = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // WHO guideline values for PM2.5 (μg/m³)
    const guidelines = [
      { name: 'WHO Annual Guideline', value: 5, color: '#10b981' },
      { name: 'WHO 24-hour Guideline', value: 15, color: '#fbbf24' },
      { name: "EPA 'Good' Threshold", value: 12, color: '#0ea5e9' },
      { name: "EPA 'Moderate' Threshold", value: 35.4, color: '#f97316' },
    ]

    // Draw horizontal comparison chart
    const chartHeight = 200
    const chartWidth = width - 40
    const chartX = 20
    const chartY = 60
    const maxValue = 50 // Max value to show on chart

    // Draw chart background
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(chartX, chartY, chartWidth, chartHeight)

    // Draw chart border
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 1
    ctx.strokeRect(chartX, chartY, chartWidth, chartHeight)

    // Draw guidelines as vertical lines
    guidelines.forEach((guideline) => {
      const lineX = chartX + (guideline.value / maxValue) * chartWidth

      // Draw line
      ctx.strokeStyle = guideline.color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(lineX, chartY)
      ctx.lineTo(lineX, chartY + chartHeight)
      ctx.stroke()

      // Draw label
      ctx.fillStyle = guideline.color
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'

      // Rotate text for vertical label
      ctx.save()
      ctx.translate(lineX, chartY + chartHeight / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText(guideline.name, 0, -10)
      ctx.restore()

      // Draw value
      ctx.fillStyle = '#1e293b'
      ctx.font = '12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(`${guideline.value} μg/m³`, lineX, chartY + chartHeight + 5)
    })

    // Draw horizontal axis
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(chartX, chartY + chartHeight)
    ctx.lineTo(chartX + chartWidth, chartY + chartHeight)
    ctx.stroke()

    // Draw axis ticks and values
    const ticks = [0, 10, 20, 30, 40, 50]
    ctx.fillStyle = '#1e293b'
    ctx.font = '12px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    ticks.forEach((tick) => {
      const tickX = chartX + (tick / maxValue) * chartWidth

      // Draw tick
      ctx.beginPath()
      ctx.moveTo(tickX, chartY + chartHeight)
      ctx.lineTo(tickX, chartY + chartHeight + 5)
      ctx.stroke()

      // Draw value
      ctx.fillText(tick.toString(), tickX, chartY + chartHeight + 10)
    })

    // Add title
    ctx.fillStyle = '#0c4a6e'
    ctx.font = 'bold 14px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText('WHO PM2.5 Guidelines Comparison (μg/m³)', width / 2, 10)

    // Add explanation
    ctx.fillStyle = '#64748b'
    ctx.font = '12px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText('Lower values indicate stricter standards', width / 2, 30)
  }

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full h-[300px]"
        aria-label={`Chart showing the ${scale === 'us-epa' ? 'US EPA AQI scale' : 'WHO air quality guidelines'}`}
      />
    </div>
  )
}
