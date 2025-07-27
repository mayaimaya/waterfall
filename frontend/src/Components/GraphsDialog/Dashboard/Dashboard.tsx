import React, { useContext, useEffect, useRef, useState } from 'react'

import { Dashboard, RectangleFigure } from '@arction/lcjs'
import UndoIcon from '@mui/icons-material/Undo'
import { Fab } from '@mui/material'
import { Collapse } from '@mui/material'

import { DrawingContext } from '../../../context/drawingContext'
import { DashboardRefs } from '../../../existCode/components/src/components/generic/LCHeatmap/types'
import { Dimensions, GraphConfig, SelectionArea, SweepData } from '../../interfaces/interfaces'
import { animateRowHeights } from '../../utils/graphsTransition'

import { createDashboardWithGraphs } from './createDashboard'
import useStyles from './DashboardStyles'
import { useDrawInteractionHandler } from './hooks/useDrawInteractionHandler'
import { useFetchNewSweepData } from './hooks/useFetchNewSweepData'
import LoadingProgress from './LoadingProgress/loadingProgress'
import PSD from './psd/Psd'
import ResolutionPopupMenu from './resolutionPopUpMenu/resolutionPopupMenu'

interface DashboardProps {
  sweepData: SweepData
  graphConfig: GraphConfig
  setGraphConfig: React.Dispatch<React.SetStateAction<GraphConfig>>
  setSweepData: React.Dispatch<React.SetStateAction<SweepData>>
  showPSD: boolean
}

const DashboardGraphs: React.FC<DashboardProps> = (props: DashboardProps) => {
  const { graphConfig, sweepData, setSweepData, showPSD, setGraphConfig } = props

  const graphsRef = useRef<DashboardRefs>({
    dashboard: {} as Dashboard,
    psdGraph: {},
    waterfallGraph: {},
  } as DashboardRefs)

  const [previousData, setPreviousData] = useState<SweepData | null>(null)
  const [selectedArea, setSelectedArea] = useState<SelectionArea | null>(null)
  const [resolutionPopupPos, setResolutionPopupPos] = useState<{
    left: number
    top: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const { enableDraw, setEnableDraw } = useContext(DrawingContext)
  const { classes } = useStyles()

  const rectRef = useRef<RectangleFigure | null>(null)
  const rectDimensionsRef = useRef<Dimensions | null>(null)
  const startPoint = useRef<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  //create graphs dashboard
  useEffect(() => {
    if (!containerRef.current || !sweepData) return
    const { dashboard, heatmapChart } = createDashboardWithGraphs(
      containerRef.current,
      sweepData,
      graphConfig,
    )
    graphsRef.current.waterfallGraph.chart = heatmapChart

    graphsRef.current.dashboard = dashboard

    if (!showPSD) {
      dashboard.setRowHeight(0, 1)
      dashboard.setRowHeight(1, 0)
    }
    return () => {
      dashboard.dispose()
    }
  }, [sweepData])

  //manage interaction with paint rectangle
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

  //fetch new data after choose resolution
  const fetchNewChartData = useFetchNewSweepData({
    setLoading,
    setPreviousData,
    sweepData,
    graphConfig,
    setGraphConfig,
    setSweepData,
  })

  const handleUndo = () => {
    if (previousData) {
      setSweepData(previousData)
      setPreviousData(null)
    }
  }

  useEffect(() => {
    graphsRef.current.dashboard &&
      (showPSD
        ? animateRowHeights(graphsRef.current.dashboard, [1, 0], [0.65, 0.35])
        : animateRowHeights(graphsRef.current.dashboard, [0.65, 0.35], [1, 0]))
  }, [showPSD])

  return (
    <div className={classes.dashboardContainer}>
      <div ref={containerRef} className={classes.dashboard} />
      {sweepData && graphsRef.current.dashboard && (
        <>
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
            fetchNewChartData(selectedArea, res)
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

export default DashboardGraphs
