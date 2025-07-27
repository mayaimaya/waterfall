/* eslint-disable react/display-name */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  AxisTickStrategies,
  PalettedFill,
  LegendBoxBuilders,
  HeatmapGridSeriesIntensityValues,
  regularColorSteps,
  LUT,
  Themes,
  ChartXY,
  UIElementBuilders,
  PointMarker,
  UIBackground,
  CustomTick,
  emptyLine,
  ColorRGBA,
} from '@arction/lcjs'

import { Location } from '../../../../../../Components/interfaces/interfaces'

import { DashboardRefs } from './types'

interface Props {
  x: number[]
  y: number[]
  times: number[]
  z: number[][]
  sensor: Location
  startFreq: number
  endFreq: number
  graphsRef: React.MutableRefObject<DashboardRefs>
  rowIndex: number
  columnIndex: number
  heatmapLUT?: LUT | undefined
}

const X_AXIS_TITLE = 'Volume (mL)'
const Y_AXIS_TITLE = 'Time'

const LCHeatmap = ({
  graphsRef,
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
}: Props) => {
  const chart = useRef<ChartXY<PointMarker, UIBackground>>({} as ChartXY<PointMarker, UIBackground>)
  const vMinHeatmap = useMemo(
    () => (z.length ? Math.min(...z.map((d: number[]) => Math.min(...d))) + 1 : 0),
    [z],
  )
  const vMaxHeatmap = useMemo(
    () => (z.length ? Math.max(...z.map((d: number[]) => Math.max(...d))) : 100),
    [z],
  )
  const majorTicksGap = useMemo(() => Math.ceil(times.length / 5), [times])
  const minorTicksGap = useMemo(() => Math.ceil(times.length / 40), [times])
  const rows = y.length
  const columns = z[0].length

  const showLegend = true

  const handleCreateChart = useCallback(() => {
    if (!graphsRef.current) {
      graphsRef.current = {} as DashboardRefs
    }
    console.log('dashboard is', graphsRef.current.dashboard)

    const dashboard = graphsRef.current.dashboard
    const chartCurrent = chart.current
    chart.current = dashboard
      .createChartXY({
        columnIndex,
        rowIndex,
      })
      .setPadding({ left: 20 })

    chartCurrent
      ?.getDefaultAxisX()
      .setInterval({ start: startFreq, end: endFreq })
      .setTickStrategy(AxisTickStrategies.Numeric)
      .setTitle(X_AXIS_TITLE)
      .setMouseInteractions(true)

    chartCurrent
      ?.getDefaultAxisY()
      .setTitle(Y_AXIS_TITLE)
      .setMouseInteractions(true)
      .setInterval({ start: Math.min(...y), end: Math.max(...y) })

    //create ticks
    const ticks: CustomTick[] = []
    const yAxis = chartCurrent?.getDefaultAxisY()
    yAxis &&
      times.forEach((time, index) => {
        if (index % majorTicksGap === 0 && index !== 0) {
          const tick = yAxis
            .addCustomTick(UIElementBuilders.AxisTickMajor)
            .setValue(index)
            .setTextFormatter(() => new Date(time).toLocaleTimeString())
          ticks.push(tick)
        } else if (index === times.length - 1 || index === 0 || index % minorTicksGap === 0) {
          // Adjusted conditions for ticks
          const tick = yAxis
            .addCustomTick(UIElementBuilders.AxisTickMinor)
            .setValue(index)
            .setTextFormatter(() => new Date(time).toLocaleTimeString())
          ticks.push(tick)
        }
      })
    if (graphsRef.current.waterfallGraph) {
      graphsRef.current.waterfallGraph = {
        ...graphsRef.current.waterfallGraph,
        ticks,
      }
    }

    return chartCurrent
  }, [columnIndex, rowIndex, sensor, times, startFreq, endFreq])

  const createHeatMap = useCallback(
    (chart: ChartXY) => {
      const cmap = z.length
        ? (heatmapLUT ??
          new LUT({
            interpolate: true,
            steps: [
              ...regularColorSteps(
                vMinHeatmap ?? -150.0,
                vMaxHeatmap ?? 0.0,
                Themes.light.examples.spectrogramColorPalette,
              ),
              { value: vMinHeatmap - 1, color: ColorRGBA(0, 0, 0, 0), label: '' },
            ],
          }))
        : new LUT({
          interpolate: true,
          steps: regularColorSteps(
            vMinHeatmap ?? -150.0,
            vMaxHeatmap ?? 0.0,
            Themes.light.examples.spectrogramColorPalette,
          ),
        })
      const stepX = (endFreq - startFreq) / columns
      const stepY = (Math.max(...y) - Math.min(...y)) / (rows - 1)

      const heatMap: HeatmapGridSeriesIntensityValues = chart
        ?.addHeatmapGridSeries({
          rows,
          columns,
          dataOrder: 'rows',
          start: {
            x: Math.min(...x),
            y: Math.min(...y),
          },
          end: {
            x: Math.max(...x),
            y: Math.max(...y),
          },
          step: {
            x: stepX,
            y: stepY,
          },
          heatmapDataType: 'intensity',
        })
        .setFillStyle(
          new PalettedFill({
            lut: cmap,
          }),
        )
        .setIntensityInterpolation('bilinear')
        .setCursorInterpolationEnabled(true)
        .invalidateIntensityValues(z)
        .setWireframeStyle(emptyLine)
        .setName('')
      heatMap.onMouseDoubleClick(() => {
        chart.getDefaultAxisX().setInterval({ start: startFreq, end: endFreq })
        chart.getDefaultAxisY().setInterval({ start: y[0], end: y[y.length - 1] })
      })

      return heatMap
    },
    [y, x, z, heatmapLUT, columnIndex, rowIndex, graphsRef.current],
  )

  const createLegend = useCallback(
    (
      sensorId: number,
      chart: ChartXY<PointMarker, UIBackground> | undefined,
      heatmap: HeatmapGridSeriesIntensityValues | undefined,
    ) => {
      if (
        !chart ||
        !heatmap ||
        !z.length ||
        !graphsRef.current ||
        graphsRef.current.waterfallGraph?.legend
      )
        return

      const legend = chart
        .addLegendBox(LegendBoxBuilders.VerticalLegendBox)
        .setTitle('')
        .add(heatmap)
        .setDraggingMode(2)
        .setAutoDispose({ type: 'max-width', maxWidth: 2 })

      if (graphsRef.current.waterfallGraph) {
        graphsRef.current.waterfallGraph.legend = legend
      }
    },
    [z, graphsRef],
  )

  useEffect(() => {
    if (!graphsRef.current.dashboard) return

    if (!graphsRef.current) {
      graphsRef.current = {} as DashboardRefs
    }

    const chart = handleCreateChart()

    if (!chart) return
    const heatmap = createHeatMap(chart)

    if (graphsRef.current.waterfallGraph) {
      graphsRef.current.waterfallGraph = {
        chart,
        heatmap,
      }
    }

    createLegend(sensor.id, chart, heatmap)

    return () => {
      graphsRef.current.waterfallGraph?.heatmap?.dispose()
      graphsRef.current.waterfallGraph?.chart?.dispose()
      graphsRef.current.waterfallGraph?.legend?.dispose()
      if (graphsRef.current.waterfallGraph) {
        graphsRef.current.waterfallGraph.heatmap = undefined
        graphsRef.current.waterfallGraph.chart = {} as ChartXY
        graphsRef.current.waterfallGraph.legend = undefined
      }
      if (graphsRef.current.waterfallGraph?.ticks) {
        graphsRef.current.waterfallGraph.ticks?.forEach((tick) => tick.dispose())
        graphsRef.current.waterfallGraph.ticks = undefined
      }
    }
  }, [
    graphsRef,
    sensor,
    endFreq,
    startFreq,
    x,
    y,
    times,
    z,
    columnIndex,
    rowIndex,
    heatmapLUT,
    handleCreateChart,
    createHeatMap,
    createLegend,
  ])

  useEffect(() => {
    if (!graphsRef.current || !graphsRef.current.waterfallGraph) return

    if (showLegend) {
      createLegend(
        sensor.id,
        graphsRef.current?.waterfallGraph?.chart,
        graphsRef.current?.waterfallGraph?.heatmap,
      )
    } else if (graphsRef.current.waterfallGraph?.legend) {
      graphsRef.current.waterfallGraph.legend?.dispose()
      graphsRef.current.waterfallGraph.legend = undefined
    }
  }, [showLegend, graphsRef, sensor, createLegend])

  return { heatmapChart: chart.current }
}

export default LCHeatmap
