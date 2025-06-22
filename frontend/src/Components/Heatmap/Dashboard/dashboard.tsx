import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  lightningChart,
  Themes,
} from '@arction/lcjs'
import { createHeatmap } from '../Heatmap'
import { GraphData, SelectionArea } from '../../interfaces/interfaces'
import AxiosService from '../API/backend'
import { DrawingContext } from '../../../context/drawingContext'
import { enableRectangleInteraction } from '../rectangleInteraction'

const HeatmapDashboard = () => {
  const [graphData, setGraphData] = useState<GraphData | undefined>(undefined)
  const [selectedArea, setSelectedArea] = useState<SelectionArea | null>(null)
  // const [showResolutionModal, setShowResolutionModal] = useState(false)

  const { enableDraw, setEnableDraw } = useContext(DrawingContext)
  const param_id = 5


  const chartRef = useRef<any>(null)
  const rectRef = useRef<any>(null)
  const rectDimensions = useRef<any>(null)
  const startPoint = useRef<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const cleanupRef = useRef<(() => void) | null>(null)

  // ✅ שלב 1 – מביאים את הנתונים פעם אחת
  useEffect(() => {
    new AxiosService().getData(param_id)
      .then((response: GraphData) => {
        setGraphData(response)
      })
      .catch((error: any) => {
        console.error('Error fetching data:', error)
        setGraphData(undefined)
      })
  }, [])

  // ✅ שלב 2 – בונים את הגרף רק כשהגיעו נתונים
  useEffect(() => {
    if (!containerRef.current || !graphData) return

    const dashboard = lightningChart().Dashboard({
      container: containerRef.current,
      numberOfColumns: 1,
      numberOfRows: 1,
      theme: Themes.darkGold,
    })

    const chart = dashboard.createChartXY({ columnIndex: 0, rowIndex: 0 }).setTitle('Heatmap')
    chartRef.current = chart

    createHeatmap(chart, graphData, param_id)

    return () => {
      dashboard.dispose()
    }
  }, [graphData])

  useEffect(() => { console.log('Selected area:', selectedArea) }, [selectedArea])


  // ✅ שלב 3 – מפעילים / מבטלים את מצב הציור מבלי להרוס את הגרף
  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    chart.setMouseInteractionRectangleZoom(!enableDraw)
    chart.setMouseInteractions(!enableDraw)

    if (enableDraw) {
      cleanupRef.current = enableRectangleInteraction({
        chart,
        setEnableDraw,
        startPoint,
        rectRef,
        rectDimensions,
        onSelectionComplete: (selection) => {
          setSelectedArea(selection)
          // setShowResolutionModal(true)
    },
      })
    }


    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [enableDraw]) // ✅ שינוי רק במצב הציור – בלי להרוס את הגרף

  return (
    <div ref={containerRef} style={{ width: '1000px', height: '600px' }} />
  )
}

export default HeatmapDashboard
