/* eslint-disable react/display-name */
import {
  AxisScrollStrategies, AxisTickStrategies, PalettedFill, LegendBoxBuilders,
  HeatmapGridSeriesIntensityValues, regularColorSteps, LUT, Themes, ChartXY, UIElementBuilders, PointMarker, UIBackground, CustomTick,
  emptyLine,
  ColorRGBA
} from '@arction/lcjs'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { Location } from '../../../../../../Components/interfaces/interfaces'

import { Graphs, GraphsRef, WaterfallData } from './types'
import { TIME_CONSTANT } from '../../../../../../Components/constants'

interface Props {
  x: number[]
  y: number[]
  times: number[]
  z: number[][]
  sensor: Location
  startFreq: number
  endFreq: number
  graphsRef: React.MutableRefObject<GraphsRef>
  rowIndex: number
  columnIndex: number
  heatmapLUT?: LUT | undefined
  // setGraphsState: React.Dispatch<React.SetStateAction<GraphsRef>>
}

const X_AXIS_TITLE = 'Volume (mL)'
const Y_AXIS_TITLE = 'Time'
const LUT_MIN_VALUE = -200
const LUT_MAX_VALUE = -250
const LEGENDS_TEXT = 'Heatmap'

const LCHeatmap = ({
  graphsRef, endFreq, startFreq, sensor, x, y, times, z,
  columnIndex, rowIndex, heatmapLUT,
  // setGraphsState
}: Props) => {
  // console.log('LCHeatmap', graphsRef, sensor, x, y, times, z, startFreq, endFreq)
  const vMinHeatmap = useMemo(() => z.length ? Math.min(...(z.map((d: number[]) => (Math.min(...d))))) + 1 : 0, [z])
  const vMaxHeatmap = useMemo(() => z.length ? Math.max(...(z.map((d: number[]) => (Math.max(...d))))) : 100, [z])
  const majorTicksGap = useMemo(() => Math.ceil(times.length / 5), [times])
  const minorTicksGap = useMemo(() => Math.ceil(times.length / 40), [times])
  const rows = y.length
  const columns = z[0].length

  // const { showLegend } = useContext(showLegendContext)
  const showLegend = true

  const [render, setRender] = useState(false)

  useEffect(() => setRender(prev => !prev), [rowIndex, columnIndex])

  const handleCreateChart = useCallback(() => {
    if (!graphsRef.current[sensor.id]) {
      graphsRef.current[sensor.id] = { waterfallGraph: {} } as Graphs;
    }
    const dashboard = graphsRef.current.dashboard
    const chart = dashboard?.createChartXY({
      columnIndex,
      rowIndex,
    })
      // .setTitle(`${!z.length ? '- אין נתונים'.split('').reverse().join('') : ''} ${sensor.sensor.split('').reverse().join('')}`)
      .setPadding({ left: 20 })

    chart?.getDefaultAxisX()
      .setInterval({ start: startFreq, end: endFreq })
      .setTickStrategy(AxisTickStrategies.Numeric)
      .setTitle(X_AXIS_TITLE)
      .setMouseInteractions(true)

    chart?.getDefaultAxisY()
      // .setTickStrategy(AxisTickStrategies.DateTime)
      .setTitle(Y_AXIS_TITLE)
      .setMouseInteractions(true)
      .setInterval({ start: Math.min(...y), end: Math.max(...y) })
    // .setThickness(80)  // או כל ערך קבוע
    // .addCustomTick
    const ticks: CustomTick[] = []
    const yAxis = chart?.getDefaultAxisY()
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
    console.log("pppp");

    graphsRef.current[sensor.id].waterfallGraph =
    {
      ...graphsRef.current[sensor.id].waterfallGraph,
      ticks
    }
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
    const stepX = (endFreq - startFreq) / columns
    const stepY = (Math.max(...y) - Math.min(...y)) / (rows - 1)

    const heatMap: HeatmapGridSeriesIntensityValues = chart?.addHeatmapGridSeries({
      rows,
      columns,
      dataOrder: 'rows',
      start: {
        x: Math.min(...x),
        y: Math.min(...y)
      },
      end: {
        x: Math.max(...x),
        y: Math.max(...y)
      },
      step: {
        x: stepX,
        y: stepY,
      },
      heatmapDataType: 'intensity',
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
    heatMap.onMouseDoubleClick(() => {
      chart.getDefaultAxisX().setInterval({ start: startFreq, end: endFreq })
      chart.getDefaultAxisY().setInterval({ start: y[0], end: y[y.length - 1] })
    })

    return heatMap
  }, [y, x, z,
    heatmapLUT,
    columnIndex,
    rowIndex,
    graphsRef.current
  ])

  const createLegend = useCallback((sensorId: number,
    chart: ChartXY<PointMarker, UIBackground> | undefined,
    heatmap: HeatmapGridSeriesIntensityValues | undefined
  ) => {
    if (!chart || !heatmap || !z.length || graphsRef.current[sensorId].waterfallGraph.legend) return
    const legend = chart.addLegendBox(LegendBoxBuilders.VerticalLegendBox)
      .setTitle('')
      .add(heatmap)
      .setDraggingMode(2)
      .setAutoDispose({ type: 'max-width', maxWidth: 2 })
    graphsRef.current[sensorId].waterfallGraph.legend = legend
  }, [
    columnIndex,
    rowIndex])

  useEffect(() => {
    if (!graphsRef.current.dashboard) return

    const chart = handleCreateChart()

    if (!chart) return
    const heatmap = createHeatMap(chart)

    graphsRef.current[sensor.id].waterfallGraph = {
      chart,
      heatmap
    }
    // setGraphsState({
    //   [sensor.id]: {
    //     chart,
    //     heatmap
    //   }
    // })

    createLegend(sensor.id, chart, heatmap)
    return () => {
      graphsRef.current[sensor.id].waterfallGraph?.heatmap?.dispose()
      graphsRef.current[sensor.id].waterfallGraph?.chart?.dispose()
      graphsRef.current[sensor.id].waterfallGraph?.legend?.dispose()

      graphsRef.current[sensor.id].waterfallGraph.heatmap = undefined
      graphsRef.current[sensor.id].waterfallGraph.chart = undefined
      graphsRef.current[sensor.id].waterfallGraph.legend = undefined

      if (!graphsRef.current[sensor.id].waterfallGraph.ticks) return
      graphsRef.current[sensor.id]?.waterfallGraph.ticks?.forEach(tick => tick.dispose())
      graphsRef.current[sensor.id].waterfallGraph.ticks = undefined
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
        graphsRef.current[sensor.id]?.waterfallGraph.chart,
        graphsRef.current[sensor.id]?.waterfallGraph.heatmap
      )
    } else if (graphsRef.current[sensor.id]?.waterfallGraph.legend) {
      graphsRef.current[sensor.id]?.waterfallGraph.legend?.dispose()
      graphsRef.current[sensor.id].waterfallGraph.legend = undefined
    }
  }, [
    showLegend,
    // graphsRef, sensor,
    // rowIndex,
    // columnIndex
  ])
  return null
}

export default LCHeatmap
