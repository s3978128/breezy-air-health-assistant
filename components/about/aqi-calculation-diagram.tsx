'use client'

import { useEffect, useRef } from 'react'

export default function AqiCalculationDiagram() {
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

    // Define colors
    const colors = {
      background: '#f0f9ff',
      arrows: '#0284c7',
      boxes: '#e0f2fe',
      boxBorder: '#0ea5e9',
      text: '#0c4a6e',
      highlight: '#0369a1',
    }

    // Draw background
    ctx.fillStyle = colors.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Helper function to draw a box
    const drawBox = (x: number, y: number, width: number, height: number, text: string) => {
      // Box
      ctx.fillStyle = colors.boxes
      ctx.strokeStyle = colors.boxBorder
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(x, y, width, height, 8)
      ctx.fill()
      ctx.stroke()

      // Text
      ctx.fillStyle = colors.text
      ctx.font = '14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Handle multi-line text
      const lines = text.split('\n')
      const lineHeight = 18
      const textY = y + height / 2 - ((lines.length - 1) * lineHeight) / 2

      lines.forEach((line, i) => {
        ctx.fillText(line, x + width / 2, textY + i * lineHeight)
      })
    }

    // Helper function to draw an arrow
    const drawArrow = (fromX: number, fromY: number, toX: number, toY: number) => {
      const headLength = 10
      const angle = Math.atan2(toY - fromY, toX - fromX)

      ctx.strokeStyle = colors.arrows
      ctx.lineWidth = 2

      // Draw line
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      ctx.stroke()

      // Draw arrowhead
      ctx.beginPath()
      ctx.moveTo(toX, toY)
      ctx.lineTo(
        toX - headLength * Math.cos(angle - Math.PI / 6),
        toY - headLength * Math.sin(angle - Math.PI / 6),
      )
      ctx.lineTo(
        toX - headLength * Math.cos(angle + Math.PI / 6),
        toY - headLength * Math.sin(angle + Math.PI / 6),
      )
      ctx.closePath()
      ctx.fillStyle = colors.arrows
      ctx.fill()
    }

    // Calculate positions based on canvas size
    const boxWidth = Math.min(160, canvas.width / 3 - 20)
    const boxHeight = 60
    const centerX = canvas.width / 2
    const startY = 30
    const middleY = 140
    const endY = 250

    // Draw the flow diagram
    // First row - Data sources
    drawBox(centerX - boxWidth / 2, startY, boxWidth, boxHeight, 'OpenWeather API\nPollutant Data')

    // Second row - Processing
    const processingBoxWidth = Math.min(220, canvas.width / 2)
    drawBox(
      centerX - processingBoxWidth / 2,
      middleY,
      processingBoxWidth,
      boxHeight,
      'Apply EPA Formula\nfor Each Pollutant',
    )

    // Third row - Results
    const resultBoxes = [
      { x: centerX - boxWidth * 1.2, text: 'Individual\nPollutant AQIs' },
      { x: centerX + boxWidth * 0.2, text: 'Overall AQI &\nHealth Advice' },
    ]

    resultBoxes.forEach((box) => {
      drawBox(box.x, endY, boxWidth, boxHeight, box.text)
    })

    // Draw arrows
    drawArrow(centerX, startY + boxHeight, centerX, middleY) // API to Processing
    drawArrow(centerX, middleY + boxHeight, resultBoxes[0].x + boxWidth / 2, endY) // Processing to Individual AQIs
    drawArrow(centerX, middleY + boxHeight, resultBoxes[1].x + boxWidth / 2, endY) // Processing to Overall AQI
    drawArrow(
      resultBoxes[0].x + boxWidth,
      endY + boxHeight / 2,
      resultBoxes[1].x,
      endY + boxHeight / 2,
    ) // Individual to Overall
  }, [])

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full h-[300px]"
        aria-label="Diagram showing the AQI calculation process flow from OpenWeather API data through EPA formula application to individual pollutant AQIs and overall AQI with health advice"
      />
    </div>
  )
}
