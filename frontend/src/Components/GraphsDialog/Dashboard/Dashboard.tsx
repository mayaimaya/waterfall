import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  lightningChart,
  Themes,
} from '@arction/lcjs'

import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import UndoIcon from '@mui/icons-material/Undo'
import { createPsd } from './psd/Psd'
import { DrawingContext } from '../../../context/drawingContext'
import ResolutionPopupMenu from './DrawResolution/resolutionPopupMenu'
import { GraphConfig, SelectionArea, SweepData } from '../../interfaces/interfaces'
import SweepsClient from '../../utils/backend'
import useStyles from './DashboardStyles'
import { enableRectangleInteraction } from './DrawResolution/rectangleInteraction'
import LCHeatmap from '../../../existCode/components/src/components/generic/LCHeatmap/Heatmap'
import { GraphsRef } from '../../../existCode/components/src/components/generic/LCHeatmap/types'

interface DashboardProps {
  sweepData?: SweepData
  graphConfig: GraphConfig
  setGraphConfig: React.Dispatch<React.SetStateAction<GraphConfig>>
  setSweepData: React.Dispatch<React.SetStateAction<SweepData | undefined>>
}

const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  const { graphConfig, setGraphConfig, sweepData, setSweepData } = props
  const graphsRef = useRef<GraphsRef>({ dashboard: undefined })
  // const [graphsState, setGraphsState] = useState<GraphsRef>({})

  const sweepsClient = new SweepsClient()
  const [previousData, setPreviousData] = useState<SweepData | null>(null)

  const [selectedArea, setSelectedArea] = useState<SelectionArea | null>(null)
  const [resolutionPopupPos, setResolutionPopupPos] = useState<{ left: number; top: number } | null>(null)
  const [loading, setLoading] = useState(false)

  const { enableDraw, setEnableDraw } = useContext(DrawingContext)
  const { classes } = useStyles()



  const waterfallChartRef = useRef<any>(null)
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
      numberOfRows: 2,
      theme: Themes.darkGold,
    })
    graphsRef.current.dashboard = dashboard

    const volumeArrX = Array.from({ length: graphConfig.endVolume - graphConfig.startVolume + 1 }, (_, i) => graphConfig.startVolume + i)
    const timeArrY = sweepData[graphConfig.locationId].captureTimes.map((time: string) => new Date(time).getTime() - 1000 * 60 * 60 * 3) // Adjusting for timezone offset

    const psdGraph = dashboard.createChartXY({ columnIndex: 0, rowIndex: 1 }).setTitle('Heatmap 2')
    // const heatmapGraph = dashboard.createChartXY({ columnIndex: 0, rowIndex: 0 }).setTitle('Heatmap 1')

    // createHeatmap(heatmapGraph, sweepData, graphConfig.locationId, graphConfig.startVolume, graphConfig.endVolume)
    createPsd(psdGraph, sweepData, graphConfig.locationId, graphConfig.startVolume, graphConfig.endVolume)

    // waterfallChartRef.current = {[graphConfig.startVolume] : undefined, d}

    // LCHeatmap(heatmapGraph, graphConfig.endVolume, graphConfig.startVolume,
    //   { id: 10 }, volumeArrX, timeArrY, timeArrY, heatmapGraph, 1, 1, undefined, sweepData, graphConfig)

    return () => {
      dashboard.dispose()
    }
  }, [sweepData])

  useEffect(() => {
    const chart = waterfallChartRef.current
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
      <div
        ref={containerRef}
        className={classes.dashboard}
      />
      {sweepData && (
        <LCHeatmap
          endFreq={graphConfig.endVolume}
          startFreq={graphConfig.startVolume}
          sensor={{ id: graphConfig.locationId }}
          x={Array.from(
            { length: graphConfig.endVolume - graphConfig.startVolume + 1 },
            (_, i) => graphConfig.startVolume + i
          )}
          y={sweepData[graphConfig.locationId].captureTimes.map((time) =>
            new Date(time).getTime()
          )}
          times={sweepData[graphConfig.locationId].captureTimes.map((time) =>
            new Date(time).getTime()
          )}
          z={sweepData[graphConfig.locationId].data}
          columnIndex={0}
          rowIndex={0}
          heatmapLUT={undefined}
          graphsRef={graphsRef}
          // setGraphsState={setGraphsState}
        />
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


