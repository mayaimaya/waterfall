import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  lightningChart,
  Themes,
} from '@arction/lcjs'
import { createHeatmap } from './Heatmap/Heatmap'
import { GraphConfig, GraphData, SelectionArea } from '../interfaces/interfaces'
import useStyles from './dashboardStyles'
import { DrawingContext } from '../../context/drawingContext'
import { enableRectangleInteraction } from './Heatmap/rectangleInteraction'
import ResolutionPopupMenu from './Heatmap/DrawResolution/resolutionPopupMenu'
import AxiosService from '../utils/backend'

const HeatmapDashboard = () => {
  const [graphData, setGraphData] = useState<GraphData | undefined>(undefined)
  const [selectedArea, setSelectedArea] = useState<SelectionArea | null>(null)
  const [resolutionPopupPos, setResolutionPopupPos] = useState<{ left: number; top: number } | null>(null)

  const { enableDraw, setEnableDraw } = useContext(DrawingContext)
  const classes = useStyles()

  const graphConfig: GraphConfig = {
    startVolume: 1000,
    endVolume: 2000,
    paramId: 5,
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

    createHeatmap(chart, graphData, graphConfig)

    return () => {
      dashboard.dispose()
    }
  }, [graphData])

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
          setResolutionPopupPos(selection.screenPosition)
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

  const fetchNewChartData = async (selection: SelectionArea, resolution: string) => {
    console.log('Fetching new chart data with selection:', selection, 'and resolution:', resolution)
    // try {
    //   const response = await new AxiosService().getDataBySelection({
    //     startTime: selection.startTime,
    //     endTime: selection.endTime,
    //     minVolume: selection.minVolume,
    //     maxVolume: selection.maxVolume,
    //     resolution,
    //   })
    //   console.log('New graph data:', response)
    // } catch (error) {
    //   console.error('Error fetching new data:', error)
    // }
  }

  return (
    <div className={classes.dashboardContainer}>
      <div ref={containerRef} className={classes.dashboard} />

      {resolutionPopupPos && (
        <ResolutionPopupMenu
          position={resolutionPopupPos}
          onSelect={(res: string) => {
            setResolutionPopupPos(null)
            if (selectedArea) {
              fetchNewChartData(selectedArea, res)
            }
          }}
        />
      )}
    </div>
  )
}

export default HeatmapDashboard