import React, { useEffect, useRef } from 'react'
import {
  lightningChart,
  Themes,
  PalettedFill,
  LUT,
  emptyLine,
  ColorRGBA,
} from '@arction/lcjs'
import { createLutPalette } from '../utils/paletteNoam'

interface ZoomedHeatmapProps {
  data: number[][]
}

export const ZoomedHeatmap: React.FC<ZoomedHeatmapProps> = ({ data }) => {
  const divRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)

  useEffect(() => {
    if (!divRef.current || data.length === 0) return

    chartRef.current?.dispose()

    const chart = lightningChart().ChartXY({
      container: divRef.current,
      theme: Themes.darkGold,
    })
    chartRef.current = chart

    chart.setTitle('Zoomed Heatmap Selection')

    const axisX = chart.getDefaultAxisX()
    const axisY = chart.getDefaultAxisY()

    axisX.setTitle('Volume (dBm)').setInterval({ start: 0, end: data[0].length })
    axisY.setTitle('Time').setInterval({ start: 0, end: data.length })
    axisY.setScrollStrategy(undefined)

    const heatmap = chart.addHeatmapGridSeries({
      rows: data.length,
      columns: data[0].length,
    })

    heatmap.invalidateIntensityValues(data)
    heatmap.setWireframeStyle(emptyLine)
    heatmap.setFillStyle(new PalettedFill({ lut: createLutPalette() }))

    return () => {chart.dispose()}
  }, [data])

  return <div ref={divRef} style={{ width: '1000px', height: '400px', marginTop: 10 }} />
}
