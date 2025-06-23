/* eslint-disable react/display-name */
import {
  AxisScrollStrategies, AxisTickStrategies, PalettedFill, LegendBoxBuilders,
  HeatmapGridSeriesIntensityValues, regularColorSteps, LUT, Themes, ChartXY, UIElementBuilders, PointMarker, UIBackground, CustomTick,
  emptyLine,
  ColorRGBA
} from '@arction/lcjs'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { Sensor } from '../../../interfaces/sensor'
import { showLegendContext } from '../../WaterfallAnalysisMainPage/context/showLegendContext'

import { GraphsRef } from './types'

interface Props {
    x: number[]
    y: number[]
    times: number[]
    z: number[][]
    sensor: Sensor
    startFreq: number
    endFreq: number
    graphsRef: React.MutableRefObject<GraphsRef>
    rowIndex: number
    columnIndex: number
    heatmapLUT?: LUT | undefined
    setGraphsState: React.Dispatch<React.SetStateAction<GraphsRef>>
}

const LCHeatmap = ({
  graphsRef, endFreq, startFreq, sensor, x, y, times, z,
  columnIndex, rowIndex, heatmapLUT,
  setGraphsState
}: Props) => {
  const vMinHeatmap = useMemo(() => z.length ? Math.min(...(z.map((d: number[]) => (Math.min(...d))))) + 1 : 0, [z])
  const vMaxHeatmap = useMemo(() => z.length ? Math.max(...(z.map((d: number[]) => (Math.max(...d))))) : 100, [z])
  const majorTicksGap = useMemo(() => Math.ceil(times.length / 5), [times])
  const minorTicksGap = useMemo(() => Math.ceil(times.length / 40), [times])

  const { showLegend } = useContext(showLegendContext)

  const [render, setRender] = useState(false)

  useEffect(() => setRender(prev => !prev), [rowIndex, columnIndex])

  const handleCreateChart = useCallback(() => {
    const dashboard = graphsRef.current.dashboard
    const chart = dashboard?.createChartXY({
      columnIndex,
      rowIndex,
      disableAnimations: true
    })
      .setTitle(`${!z.length ? '- אין נתונים'.split('').reverse().join('') : ''} ${sensor.sensor.split('').reverse().join('')}`)
      .setPadding({ left: 10 })

    const yAxis = chart?.getDefaultAxisY()
    yAxis && yAxis
      .setTickStrategy(AxisTickStrategies.Empty)
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setInterval({ start: y[0], end: y[y.length - 1] })
      .setMouseInteractions(true)
    const ticks: CustomTick[] = []
    yAxis && times.forEach((time, index) => {
      if (index % majorTicksGap === 0 && index !== 0) {
        const tick = yAxis
          .addCustomTick(UIElementBuilders.AxisTickMajor)
          .setValue(index)
          .setTextFormatter(() => new Date(time).toLocaleTimeString())
        ticks.push(tick)
      } else if (index === times.length || index === 1 || index % minorTicksGap === 0) {
        const tick = yAxis
          .addCustomTick(UIElementBuilders.AxisTickMinor)
          .setValue(index)
          .setTextFormatter(() => new Date(time).toLocaleTimeString())
        ticks.push(tick)
      }
    })
    graphsRef.current[sensor.id] =
    {
      ...graphsRef.current[sensor.id],
      ticks
    }
    chart?.getDefaultAxisX()
      .setInterval({ start: startFreq, end: endFreq })
      .setMouseInteractions(true)

    return chart
  }, [columnIndex,
    rowIndex,
    sensor,
    times,
    heatmapLUT,
    startFreq,
    endFreq,
    render])

  const createHeatMap = useCallback((chart: ChartXY) => {
    const cmap = z.length
      ? (heatmapLUT ?? new LUT({
        interpolate: true,
        steps: [...regularColorSteps(
          vMinHeatmap ?? -150.0,
          vMaxHeatmap ?? 0.0,
          Themes.light.examples.spectrogramColorPalette
        ), { value: vMinHeatmap - 1, color: ColorRGBA(0, 0, 0, 0), label: '' }]
      }))
      : new LUT({
        interpolate: true,
        steps: regularColorSteps(
          vMinHeatmap ?? -150.0,
          vMaxHeatmap ?? 0.0,
          Themes.light.examples.spectrogramColorPalette
        )
      })

    const heatMap: HeatmapGridSeriesIntensityValues = chart?.addHeatmapGridSeries({
      rows: y.length ?? 10,
      columns: z.length && z[0].length ? z[0].length : 3772,
      dataOrder: 'rows',
      start: {
        x: Math.min(...x),
        y: Math.min(...y)
      },
      end: {
        x: Math.max(...x),
        y: Math.max(...y)
      }
    })
      .setFillStyle(new PalettedFill({
        lut: cmap
      }))
      //  makes the data more smooth
      .setIntensityInterpolation('bilinear')
      .setCursorInterpolationEnabled(true)
      //  add the data to the heatmap
      .invalidateIntensityValues(z)
      //  makes the data colorfull befire interacting.
      .setWireframeStyle(emptyLine)
      .setName('')

    return heatMap
  }, [y, x, z,
    heatmapLUT,
    columnIndex,
    rowIndex,
    graphsRef.current
  ])

  const createLegend = useCallback((sensorId: number,
    chart: ChartXY<PointMarker, UIBackground> | undefined,
    heatmap: HeatmapGridSeriesIntensityValues| undefined
  ) => {
    if (!chart || !heatmap || !z.length || graphsRef.current[sensorId].legend) return
    const legend = chart.addLegendBox(LegendBoxBuilders.VerticalLegendBox)
      .setTitle('')
      .add(heatmap)
      .setDraggingMode(2)
      .setAutoDispose({ type: 'max-width', maxWidth: 2 })
    graphsRef.current[sensorId].legend = legend
  }, [
    columnIndex,
    rowIndex])

  useEffect(() => {
    if (!graphsRef.current.dashboard) return
    const chart = handleCreateChart()
    if (!chart) return
    const heatmap = createHeatMap(chart)
    graphsRef.current[sensor.id] = {
      chart,
      heatmap
    }
    setGraphsState({
      [sensor.id]: {
        chart,
        heatmap
      }
    })

    createLegend(sensor.id, chart, heatmap)
    return () => {
      graphsRef.current[sensor.id].heatmap?.dispose()
      graphsRef.current[sensor.id].chart?.dispose()
      graphsRef.current[sensor.id].legend?.dispose()

      graphsRef.current[sensor.id].heatmap = undefined
      graphsRef.current[sensor.id].chart = undefined
      graphsRef.current[sensor.id].legend = undefined

      if (!graphsRef.current[sensor.id].ticks) return
      graphsRef.current[sensor.id].ticks?.forEach(tick => tick.dispose())
      graphsRef.current[sensor.id].ticks = undefined
    }
  }, [
    graphsRef,
    sensor,
    endFreq,
    startFreq,
    sensor,
    x,
    y,
    times,
    z,
    columnIndex,
    rowIndex,
    heatmapLUT,
    render
  ])

  useEffect(() => {
    if (!graphsRef
    ) return
    if (showLegend) {
      createLegend(sensor.id,
        graphsRef.current[sensor.id]?.chart,
        graphsRef.current[sensor.id]?.heatmap
      )
    } else if (graphsRef.current[sensor.id]?.legend) {
      graphsRef.current[sensor.id]?.legend?.dispose()
      graphsRef.current[sensor.id].legend = undefined
    }
  }, [
    showLegend,
    graphsRef, sensor,
    rowIndex,
    columnIndex
  ])
  return null
}

export default LCHeatmap
