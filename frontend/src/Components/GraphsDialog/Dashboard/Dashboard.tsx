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
import PDS from './psd/Psd'
import { DrawingContext } from '../../../context/drawingContext'
import ResolutionPopupMenu from './DrawResolution/resolutionPopupMenu'
import { Dimensions, GraphConfig, SelectionArea, SweepData } from '../../interfaces/interfaces'
import SweepsClient from '../../utils/backend'
import useStyles from './DashboardStyles'
import { enableRectangleInteraction } from './DrawResolution/rectangleInteraction'
import LCHeatmap from '../../../existCode/components/src/components/generic/LCHeatmap/Heatmap'
import { GraphsRef } from '../../../existCode/components/src/components/generic/LCHeatmap/types'
import { TIME_CONSTANT } from '../../constants'
import { createHeatmap } from './Heatmap/createHeatmap'

interface DashboardProps {
  sweepData?: SweepData
  graphConfig: GraphConfig
  setGraphConfig: React.Dispatch<React.SetStateAction<GraphConfig>>
  setSweepData: React.Dispatch<React.SetStateAction<SweepData | undefined>>
}

// const [graphsState, setGraphsState] = useState<GraphsRef>({})

const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  const { graphConfig, setGraphConfig, sweepData, setSweepData } = props
  const LOADING_TEXT = 'טוען מידע חדש לפי רזולוציה שנבחרה...'
  const graphsRef = useRef<GraphsRef>({} as GraphsRef)
  const [isDashboardReady, setIsDashboardReady] = useState(false);

  const sweepsClient = new SweepsClient()
  const [previousData, setPreviousData] = useState<SweepData | null>(null)

  const [selectedArea, setSelectedArea] = useState<SelectionArea | null>(null)
  const [resolutionPopupPos, setResolutionPopupPos] = useState<{ left: number; top: number } | null>(null)
  const [loading, setLoading] = useState(false)

  const { enableDraw, setEnableDraw } = useContext(DrawingContext)
  const { classes } = useStyles()

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
      numberOfRows: 2,
      theme: Themes.darkGold,
    })
    graphsRef.current.dashboard = dashboard
    setIsDashboardReady(true); // trigger rerender when dashboard is ready

    return () => {
      dashboard.dispose()
      setIsDashboardReady(false); // reset if component unmounts

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
        onSelectionComplete: (selection: SelectionArea) => {
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
      const startDate = new Date(selection.startTime + TIME_CONSTANT).toISOString()
      const endDate = new Date(selection.endTime + TIME_CONSTANT).toISOString()
      const response = await sweepsClient.getSweepData(graphConfig.locationId, startDate, endDate)
      await new Promise((resolve) => setTimeout(resolve, 1000))


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
      <div
        ref={containerRef}
        className={classes.dashboard}
      />
      {sweepData && graphsRef.current.dashboard && (
        <>
          <LCHeatmap
            endFreq={graphConfig.endVolume}
            startFreq={graphConfig.startVolume}
            sensor={{ id: graphConfig.locationId }}
            x={Array.from(
              { length: graphConfig.endVolume - graphConfig.startVolume + 1 },
              (_, i) => graphConfig.startVolume + i
            )}
            y={sweepData[graphConfig.locationId].captureTimes.map((time) =>
              new Date(time).getTime() - TIME_CONSTANT
            )}
            times={sweepData[graphConfig.locationId].captureTimes.map((time) =>
              new Date(time).getTime() - TIME_CONSTANT
            )}
            z={sweepData[graphConfig.locationId].data}
            columnIndex={0}
            rowIndex={0}
            heatmapLUT={undefined}
            graphsRef={graphsRef}
          // setGraphsState={setGraphsState}
          />
          <PDS
            columnIndex={0}
            rowIndex={1}
            endFrequency={graphConfig.endVolume}
            startFrequency={graphConfig.startVolume}
            sensor={{ id: graphConfig.locationId }}
            graphsRef={graphsRef}
            sweepData={sweepData}
          />
        </>
      )}

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
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: 'white',
          }}
        >
          <UndoIcon />
        </IconButton>
      )}

      {loading && (
        <div className={classes.loadingOverlay}>
          <div className={classes.blurBackground} />
          <div className={classes.loadingContent}>
            <CircularProgress
              size={60}
              thickness={5}
              color='secondary'
            />
            <div className={classes.loadingText}>
              {LOADING_TEXT}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard


