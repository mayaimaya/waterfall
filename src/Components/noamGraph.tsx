import React, { useEffect, useRef } from 'react'
import {
  lightningChart,
  Themes,
  AxisScrollStrategies,
  emptyLine,
} from '@arction/lcjs'

const NoamGraph = () => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Create chart
    const chart = lightningChart().ChartXY({
      container: chartRef.current,
      theme: Themes.darkGold,
    })

    // Configure X-axis for time
    const xAxis = chart.getDefaultAxisX()
    xAxis.setScrollStrategy(AxisScrollStrategies.progressive)

    // Configure Y-axis for signal amplitude
    const yAxis = chart.getDefaultAxisY()
    yAxis.setTitle('Amplitude')

    // Add LineSeries for the signal
    const series = chart.addLineSeries()
    series.setName('Signal')

    // Generate and update signal data (sine wave here as example)
    let x = 0
    const interval = setInterval(() => {
      const points = []
      for (let i = 0; i < 100; i++) {
        points.push({ x: x, y: Math.sin(x * 0.1) })
        x += 1
      }
      series.add(points)
    }, 100)

    return () => {
      clearInterval(interval)
      chart.dispose()
    }
  }, [])

  return  <div style={{ width: '1000px', height: '500px' }}>
  <div ref={chartRef} style={{ width: '100%', height: '500px' }} />

  </div>
}

export default NoamGraph