import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  ChartXY,
  lightningChart,
  PointMarker,
  RectangleFigure,
  Themes,
  UIBackground,
} from '@arction/lcjs'

import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import UndoIcon from '@mui/icons-material/Undo'
import { createPsd } from './psd/Psd'
import { DrawingContext } from '../../../context/drawingContext'
import ResolutionPopupMenu from './DrawResolution/resolutionPopupMenu'
import { Dimensions, GraphConfig, SelectionArea, SweepData } from '../../interfaces/interfaces'
import SweepsClient from '../../utils/backend'
import useStyles from './DashboardStyles'
import { createHeatmap } from './Heatmap/createHeatmap'
import { enableRectangleInteraction } from './DrawResolution/rectangleInteraction'

interface DashboardProps {
    sweepData?: SweepData
    graphConfig: GraphConfig
    setGraphConfig: React.Dispatch<React.SetStateAction<GraphConfig>>
    setSweepData: React.Dispatch<React.SetStateAction<SweepData | undefined>>
}

const Dashboard :React.FC<DashboardProps> = (props:DashboardProps) => {
  const { graphConfig, setGraphConfig, sweepData , setSweepData} = props

  const sweepsClient = new SweepsClient()
  const [previousData, setPreviousData] = useState<SweepData | null>(null)

  const [selectedArea, setSelectedArea] = useState<SelectionArea | null>(null)
  const [resolutionPopupPos, setResolutionPopupPos] = useState<{ left: number; top: number } | null>(null)
  const [loading, setLoading] = useState(false)

  const { enableDraw, setEnableDraw } = useContext(DrawingContext)
  const classes = useStyles()

  const waterfallChartRef = useRef<ChartXY<PointMarker, UIBackground> | null>(null)
  const rectRef = useRef<RectangleFigure | null>(null)
  const rectDimensions = useRef<Dimensions | null>(null)
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

    const heatmapGraph = dashboard.createChartXY({ columnIndex: 0, rowIndex: 0 }).setTitle('Heatmap 1')
    // const psdGraph = dashboard.createChartXY({ columnIndex: 0, rowIndex: 1 }).setTitle('Heatmap 2')

    createHeatmap(heatmapGraph, sweepData, graphConfig.locationId, graphConfig.startVolume, graphConfig.endVolume)
    // createPsd(psdGraph, sweepData,graphConfig.locationId, graphConfig.startVolume, graphConfig.endVolume)

    waterfallChartRef.current = heatmapGraph

    return () => {
      dashboard.dispose()
    }
  }, [sweepData])

  useEffect(() => {
    const waterfallChart = waterfallChartRef.current
    if (!waterfallChart) return

    waterfallChart.setMouseInteractionRectangleZoom(!enableDraw)
    waterfallChart.setMouseInteractions(!enableDraw)

    if (enableDraw) {
      cleanupRef.current = enableRectangleInteraction({
        waterfallChart,
        setEnableDraw,
        startPoint,
        rectRef,
        rectDimensions,
        onSelectionComplete: (selection : SelectionArea) => {
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
      const endDate = new Date(selection.endTime ).toISOString()
      const response = await sweepsClient.getSweepData(graphConfig.locationId, startDate, endDate)
      setSweepData(response)
      setGraphConfig((prevConfig) => ({
        ...prevConfig,
        startVolume: selection.minVolume,
        endVolume: selection.maxVolume,
        // startDate: startDate,
        // endDate: endDate
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

export default Dashboard


