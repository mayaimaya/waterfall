import React, { useContext, useEffect, useRef, useState } from 'react'
import {
    lightningChart,
    Themes,
} from '@arction/lcjs'
import { createHeatmap } from '../Heatmap'
import { GraphConfig, GraphData, SelectionArea } from '../../interfaces/interfaces'
import AxiosService from '../API/backend'
import useStyles from './dashboardStyles'
import { DrawingContext } from '../../../context/drawingContext'
import { enableRectangleInteraction } from '../rectangleInteraction'


const HeatmapDashboard = () => {
  const [graphData, setGraphData] = useState<GraphData | undefined>(undefined)
  const [selectedArea, setSelectedArea] = useState<SelectionArea | null>(null)
  const { enableDraw, setEnableDraw } = useContext(DrawingContext)
  
  const classes = useStyles()
  const graphConfig: GraphConfig = {
      startVolume: 1000,
      endVolume: 2000,
      paramId: 5
  }
  useEffect(() => {
    new AxiosService().getData(graphConfig.paramId)
        .then((response: GraphData) => {
            setGraphData(response)
        })
        .catch((error: any) => {
            console.error('Error fetching data:', error)
            setGraphData(undefined)
        })
  }, [])



  const chartRef = useRef<any>(null)
  const rectRef = useRef<any>(null)
  const rectDimensions = useRef<any>(null)
  const startPoint = useRef<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const cleanupRef = useRef<(() => void) | null>(null)

  // building the graph every time the data changes
  useEffect(() => {
      if (!containerRef.current || !graphData) return

      const dashboard = lightningChart().Dashboard({
          container: containerRef.current,
          numberOfColumns: 1,
          numberOfRows: 1,
          theme: Themes.darkGold,
      })

      const chart = dashboard.createChartXY({ columnIndex: 0, rowIndex: 0 }).setTitle('Heatmap 1')
      chartRef.current = chart
      createHeatmap(chart, graphData, graphConfig)

      return () => {
          dashboard.dispose()
      }
  }, [graphData])

  useEffect(() => { console.log('Selected area:', selectedArea) }, [selectedArea])

  // Enable rectangle interaction when enableDraw is true
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
        },
      })
    }
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [enableDraw]) 



  return (
    <div ref={containerRef} className={classes.dashboard} />
  )
}

export default HeatmapDashboard