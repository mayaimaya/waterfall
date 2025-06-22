import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  lightningChart,
  Themes,
} from '@arction/lcjs'
import { GraphConfig, GraphData, SelectionArea } from '../interfaces/interfaces'
import useStyles from './dashboardStyles'
import { DrawingContext } from '../../context/drawingContext'
import { enableRectangleInteraction } from './Heatmap/rectangleInteraction'
import ResolutionPopupMenu from './Heatmap/DrawResolution/resolutionPopupMenu'
import SweepsClient from '../utils/backend'
import { createHeatmap } from './Heatmap/Heatmap'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import UndoIcon from '@mui/icons-material/Undo'

interface HeatmapDashboardProps {
  graphConfig: GraphConfig
  setGraphConfig: React.Dispatch<React.SetStateAction<GraphConfig>>
}

const HeatmapDashboard :React.FC<HeatmapDashboardProps> = (props:HeatmapDashboardProps) => {
  const { graphConfig, setGraphConfig } = props

  const sweepsClient = new SweepsClient()
  const [sweepData, setSweepData] = useState<GraphData | undefined>(undefined)
  const [previousData, setPreviousData] = useState<GraphData | null>(null)

  const [selectedArea, setSelectedArea] = useState<SelectionArea | null>(null)
  const [resolutionPopupPos, setResolutionPopupPos] = useState<{ left: number; top: number } | null>(null)
  const [loading, setLoading] = useState(false)

  const { enableDraw, setEnableDraw } = useContext(DrawingContext)
  const classes = useStyles()


  useEffect(() => {
    sweepsClient.getSweepData(graphConfig.locationId, graphConfig.startDate, graphConfig.endDate)
      .then((response: GraphData) => {
          setSweepData(response)
      })
      .catch((error: any) => {
          console.error('Error fetching data:', error)
          setSweepData(undefined)
      })
  }, [])

  const chartRef = useRef<any>(null)
  const rectRef = useRef<any>(null)
  const rectDimensions = useRef<any>(null)
  const startPoint = useRef<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!containerRef.current || !sweepData) return

    const dashboard = lightningChart().Dashboard({
      container: containerRef.current,
      numberOfColumns: 1,
      numberOfRows: 1,
      theme: Themes.darkGold,
    })

    const chart = dashboard.createChartXY({ columnIndex: 0, rowIndex: 0 }).setTitle('Heatmap')
    chartRef.current = chart

    sweepData && createHeatmap(chart, sweepData, graphConfig.locationId, graphConfig.startVolume, graphConfig.endVolume)

    return () => {
      dashboard.dispose()
    }
  }, [sweepData])

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
    try {
      setLoading(true)
      setPreviousData(sweepData || null)
      console.log('Fetching new data for selection:', selection, 'with resolution:', resolution)
      const startDate = new Date(selection.startTime).toISOString()
      const endDate = new Date(selection.endTime).toISOString()
      const response = await sweepsClient.getSweepData(graphConfig.locationId, startDate, endDate)
      setSweepData(response)
      setGraphConfig((prevConfig) => ({
        ...prevConfig,
        startVolume: selection.minVolume,
        endVolume: selection.maxVolume,
        startDate: startDate,
        endDate: endDate
      }))
    } catch (error) {
      console.error('Error fetching new data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUndo = () => {
    if (previousData) {
      setSweepData(previousData)
      setPreviousData(null)
    }
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
     {previousData && (
        <IconButton
          onClick={handleUndo}
          style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'white' }}
        >
          <UndoIcon />
        </IconButton>
      )}

      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2000,
          }}
        >
          <CircularProgress />
        </div>
      )}
    </div>
  )
}

export default HeatmapDashboard