// NoamGraph.tsx
import React, { useEffect, useRef, useState } from 'react'
import {
  lightningChart,
  Themes,
  SolidFill,
  SolidLine,
  ColorRGBA,
  emptyLine,
  PalettedFill,
} from '@arction/lcjs'
import UndoIcon from '@mui/icons-material/Undo'
import { fetchHeatmapData } from '../hooks/useHeatmapDataNoam'
import { createLutPalette } from '../utils/paletteNoam'
import { ResolutionSelector } from './resolutionSelectorNoam'

interface Props {
  data: number[][]
}

const NoamGraph: React.FC<Props> = ({ data }) => {
  const chartDiv = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const heatmapRef = useRef<any>(null)
  const rectRef = useRef<any>(null)
  const startPoint = useRef<{ x: number; y: number } | null>(null)
  const rectDimensions = useRef<{ x: number; y: number; width: number; height: number } | null>(null)

  const [selectedArea, setSelectedArea] = useState<null | {
    xMin: number
    xMax: number
    yMin: number
    yMax: number
  }>(null)

  const [loading, setLoading] = useState(false)
  const [showResolutionSelector, setShowResolutionSelector] = useState(false)
  const [historyStack, setHistoryStack] = useState<
    { data: number[][]; selectedArea: typeof selectedArea }[]
  >([])

  const [currentData, setCurrentData] = useState<number[][]>(data)

  useEffect(() => {
    if (!chartDiv.current || currentData.length === 0) return

    chartRef.current?.dispose()

    const chart = lightningChart().ChartXY({
      container: chartDiv.current,
      theme: Themes.darkGold,
    })
    chartRef.current = chart

    chart.setTitle('Spectrum Snapshot')
    chart.setMouseInteractionRectangleZoom(false)

    const axisX = chart.getDefaultAxisX()
    const axisY = chart.getDefaultAxisY()

    const rows = currentData.length
    const cols = currentData[0].length

    axisX.setTitle('Volume (dBm)').setInterval({ start: 0, end: cols })
    axisY.setTitle('Time').setInterval({ start: 0, end: rows })
    axisY.setScrollStrategy(undefined)

    const heatmap = chart.addHeatmapGridSeries({
      rows,
      columns: cols,
    })
    heatmapRef.current = heatmap

    const reversed = [...currentData].reverse()
    heatmap.invalidateIntensityValues(reversed)
    heatmap.setWireframeStyle(emptyLine)
    heatmap.setFillStyle(new PalettedFill({ lut: createLutPalette() }))

    const rectSeries = chart.addRectangleSeries()

    const getCoordinates = (event: PointerEvent) => {
      const bounds = chart.engine.container.getBoundingClientRect()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top

      const xVal = axisX.getInterval().start + (x / bounds.width) * (axisX.getInterval().end - axisX.getInterval().start)
      const yVal = axisY.getInterval().start + ((bounds.height - y) / bounds.height) * (axisY.getInterval().end - axisY.getInterval().start)

      return { x: xVal, y: yVal }
    }

    const onPointerDown = (e: PointerEvent) => {
      const start = getCoordinates(e)
      startPoint.current = start

      rectSeries.clear()
      const rect = rectSeries.add({
        x: start.x,
        y: start.y,
        width: 0,
        height: 0,
      })
      rect.setFillStyle(new SolidFill({ color: ColorRGBA(255, 0, 0, 50) }))
      rect.setStrokeStyle(new SolidLine({
        thickness: 2,
        fillStyle: new SolidFill({ color: ColorRGBA(255, 0, 0) }),
      }))
      rectRef.current = rect
      rectDimensions.current = { x: start.x, y: start.y, width: 0, height: 0 }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!startPoint.current || !rectRef.current) return
      const current = getCoordinates(e)

      const xMin = Math.min(startPoint.current.x, current.x)
      const xMax = Math.max(startPoint.current.x, current.x)
      const yMin = Math.min(startPoint.current.y, current.y)
      const yMax = Math.max(startPoint.current.y, current.y)

      const width = xMax - xMin
      const height = yMax - yMin

      rectRef.current.setDimensions({
        x: xMin,
        y: yMin,
        width,
        height,
      })

      rectDimensions.current = { x: xMin, y: yMin, width, height }
    }

    const onPointerUp = () => {
      if (!rectDimensions.current) return

      setSelectedArea({
        xMin: rectDimensions.current.x,
        xMax: rectDimensions.current.x + rectDimensions.current.width,
        yMin: rectDimensions.current.y,
        yMax: rectDimensions.current.y + rectDimensions.current.height,
      })

      startPoint.current = null
      rectRef.current = null
      rectDimensions.current = null
      setShowResolutionSelector(true)
    }

    const container = chart.engine.container
    container.addEventListener('pointerdown', onPointerDown)
    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerup', onPointerUp)

    return () => {
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerup', onPointerUp)
      chart.dispose()
    }
  }, [currentData])

  const onResolutionSelect = async (resolution: number) => {
    if (!selectedArea) return
    setLoading(true)
    setHistoryStack((prev) => [...prev, { data: currentData, selectedArea }])

    const fetchedData = await fetchHeatmapData(
      selectedArea.xMin,
      selectedArea.xMax,
      selectedArea.yMin,
      selectedArea.yMax,
      resolution,
      resolution,
    )

    setCurrentData(fetchedData)
    setShowResolutionSelector(false)
    setLoading(false)
  }

  const onUndo = () => {
    if (historyStack.length === 0) return
    const last = historyStack[historyStack.length - 1]
    setCurrentData(last.data)
    setSelectedArea(last.selectedArea)
    setHistoryStack((prev) => prev.slice(0, -1))
  }

  return (
    <>
      <div ref={chartDiv} style={{ width: '1000px', height: '600px', position: 'relative' }} />
      {loading && <div className="loading-overlay" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '1000px',
        height: '600px',
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        zIndex: 10
      }}>טוען נתונים...</div>}
      {showResolutionSelector && (
        <ResolutionSelector
          onSelect={onResolutionSelect}
          onCancel={() => setShowResolutionSelector(false)}
        />
      )}
      {historyStack.length > 0 && (
        <button className="undo-button" onClick={onUndo} title="חזור">
          <UndoIcon /> חזור
        </button>
      )}
    </>
  )
}

export default NoamGraph
