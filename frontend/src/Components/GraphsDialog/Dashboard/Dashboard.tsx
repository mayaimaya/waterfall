import React, { useContext, useEffect, useRef, useState } from 'react'

import {
  ChartXY,
  lightningChart,
  PointMarker,
  RectangleFigure,
  Themes,
  UIBackground,
} from '@arction/lcjs'
import UndoIcon from '@mui/icons-material/Undo'
import { Fab } from '@mui/material'
import { Collapse } from '@mui/material'

import { DrawingContext } from '../../../context/drawingContext'
import LCHeatmap from '../../../existCode/components/src/components/generic/LCHeatmap/Heatmap'
import { DashboardRefs } from '../../../existCode/components/src/components/generic/LCHeatmap/types'
import { TIME_CONSTANT } from '../../constants'
import { Dimensions, GraphConfig, SelectionArea, SweepData } from '../../interfaces/interfaces'
import { animateRowHeights } from '../../utils/graphsTransition'

import useStyles from './DashboardStyles'
import { useDrawInteractionHandler } from './hooks/useDrawInteractionHandler'
import LoadingProgress from './LoadingProgress/loadingProgress'
import PSD from './psd/Psd'
import ResolutionPopupMenu from './resolutionPopUpMenu/resolutionPopupMenu'

interface DashboardProps {
  sweepData?: SweepData
  graphConfig: GraphConfig
  setGraphConfig: React.Dispatch<React.SetStateAction<GraphConfig>>
  setSweepData: React.Dispatch<React.SetStateAction<SweepData | undefined>>
  showPSD: boolean
}

const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  const { graphConfig, setGraphConfig, sweepData, setSweepData, showPSD } = props
  const graphsRef = useRef<DashboardRefs>({} as DashboardRefs)
  // const [graphsState, setGraphsState] = useState<GraphsRef>({} as GraphsRef)

  const [previousData, setPreviousData] = useState<SweepData | null>(null)
  const [selectedArea, setSelectedArea] = useState<SelectionArea | null>(null)
  const [resolutionPopupPos, setResolutionPopupPos] = useState<{
    left: number
    top: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const { enableDraw, setEnableDraw } = useContext(DrawingContext)
  const { classes } = useStyles()

  const waterfallChartRef = useRef<ChartXY<PointMarker, UIBackground> | null>(null)
  const rectRef = useRef<RectangleFigure | null>(null)
  const rectDimensionsRef = useRef<Dimensions | null>(null)
  const startPoint = useRef<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  //   // יצירת הגרפים
  //   useEffect(() => {
  //     if (!containerRef.current || !sweepData) return
  //     const { dashboard, heatmapChart } = createDashboardWithGraphs(containerRef.current, sweepData, graphConfig)
  //     waterfallChartRef.current = heatmapChart

  //     return () => {dashboard.dispose()}
  //   }, [sweepData])

  //   // שליפת מידע חדש ברגע שנבחרה רזולוציה
  //   const fetchNewChartData = useFetchNewSweepData({
  //     setLoading,
  //     setPreviousData,
  //     sweepData,
  //     graphConfig,
  //     setGraphConfig,
  //     setSweepData,
  //   })
  // =======
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!containerRef.current || !sweepData) return
    console.log(showPSD)

    const dashboard = lightningChart().Dashboard({
      container: containerRef.current,
      numberOfColumns: 1,
      numberOfRows: 2,
      theme: Themes.darkGold,
    })

    graphsRef.current.dashboard = dashboard
    // setGraphsState((prev) => ({ ...prev, dashboard }))
    if (!showPSD) {
      dashboard.setRowHeight(0, 1)
      dashboard.setRowHeight(1, 0)
    }
    return () => {
      graphsRef.current = {} as DashboardRefs
      dashboard.dispose()
    }
  }, [sweepData])

  useEffect(() => {
    graphsRef.current.dashboard &&
      (showPSD
        ? animateRowHeights(graphsRef.current.dashboard, [1, 0], [0.65, 0.35])
        : animateRowHeights(graphsRef.current.dashboard, [0.65, 0.35], [1, 0]))
  }, [showPSD])

  // useEffect(() => {
  //   const waterfallChart = waterfallChartRef.current
  //   if (!waterfallChart) return

  //   waterfallChart.setMouseInteractionRectangleZoom(!enableDraw)
  //   waterfallChart.setMouseInteractions(!enableDraw)

  //   if (enableDraw) {
  //     cleanupRef.current = enableRectangleInteraction({
  //       waterfallChart,
  //       setEnableDraw,
  //       startPoint,
  //       rectRef,
  //       rectDimensions,
  //       onSelectionComplete: (selection: SelectionArea) => {
  //         setSelectedArea(selection)
  //         setResolutionPopupPos(selection.screenPosition)
  //       },
  //     })
  //   }

  //   return () => {
  //     if (cleanupRef.current) {
  //       cleanupRef.current()
  //       cleanupRef.current = null
  //     }
  //   }
  // }, [enableDraw])

  // ניהול אינטראקציה של ציור מלבן
  useDrawInteractionHandler({
    enableDraw,
    setEnableDraw,
    rectRef,
    rectDimensionsRef,
    startPoint,
    chart: graphsRef.current?.waterfallGraph?.chart,
    setResolutionPopupPos,
    setSelectedArea,
  })
  // const fetchNewChartData = async (selection: SelectionArea, resolution: string) => {
  //   try {
  //     setLoading(true)
  //     setPreviousData(sweepData || null)
  //     console.log('Fetching new data for selection:', selection, 'with resolution:', resolution)
  //     const startDate = new Date(selection.startTime + TIME_CONSTANT).toISOString()
  //     const endDate = new Date(selection.endTime + TIME_CONSTANT).toISOString()
  //     const response = await sweepsClient.getSweepData(graphConfig.locationId, startDate, endDate)
  //     await new Promise((resolve) => setTimeout(resolve, 1000))

  //     setSweepData(response)
  //     setGraphConfig((prevConfig) => ({
  //       ...prevConfig,
  //       startVolume: selection.minVolume,
  //       endVolume: selection.maxVolume,
  //       startDate: startDate,
  //       endDate: endDate,
  //     }))
  //   } catch (error) {
  //     console.error('Error fetching new data:', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleUndo = () => {
    if (previousData) {
      setSweepData(previousData)
      setPreviousData(null)
    }
  }

  return (
    <div className={classes.dashboardContainer}>
      <div ref={containerRef} className={classes.dashboard} />
      {sweepData && graphsRef.current.dashboard && (
        <>
          <LCHeatmap
            endFreq={graphConfig.endVolume}
            startFreq={graphConfig.startVolume}
            sensor={{ id: graphConfig.locationId }}
            x={Array.from(
              { length: graphConfig.endVolume - graphConfig.startVolume + 1 },
              (_, i) => graphConfig.startVolume + i,
            )}
            y={sweepData[graphConfig.locationId].captureTimes.map(
              (time) => new Date(time).getTime() - TIME_CONSTANT,
            )}
            times={sweepData[graphConfig.locationId].captureTimes.map(
              (time) => new Date(time).getTime() - TIME_CONSTANT,
            )}
            z={sweepData[graphConfig.locationId].data}
            columnIndex={0}
            rowIndex={0}
            heatmapLUT={undefined}
            graphsRef={graphsRef}
          />
          {showPSD && (
            <Collapse in={showPSD} timeout={1000} unmountOnExit>
              <PSD
                columnIndex={0}
                rowIndex={1}
                endFrequency={graphConfig.endVolume}
                startFrequency={graphConfig.startVolume}
                sensor={{ id: graphConfig.locationId }}
                graphsRef={graphsRef}
                sweepData={sweepData}
              />
            </Collapse>
          )}
        </>
      )}

      {resolutionPopupPos && selectedArea && (
        <ResolutionPopupMenu
          position={resolutionPopupPos}
          onSelect={(res: string) => {
            setResolutionPopupPos(null)
            // fetchNewChartData(selectedArea, res)
          }}
        />
      )}

      {previousData && (
        <Fab
          onClick={handleUndo}
          // אני צריכה לתקן את זה - לא רציתי להתעכב כי העדפתי להתקדם
          // TODO: לחזור לפה
          // eslint-disable-next-line no-restricted-syntax
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: 'primary.main',
            color: 'text.primary',
            zIndex: 1000,
          }}
          size='small'
        >
          <UndoIcon color='inherit' />
        </Fab>
      )}

      {loading && <LoadingProgress />}
    </div>
  )
}

export default Dashboard
