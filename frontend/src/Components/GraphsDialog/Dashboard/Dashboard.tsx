import React, { useContext, useEffect, useRef, useState } from 'react'
import { ChartXY, PointMarker, RectangleFigure, UIBackground } from '@arction/lcjs'
import CircularProgress from '@mui/material/CircularProgress'
import UndoIcon from '@mui/icons-material/Undo'
import { Fab } from '@mui/material'
import { DrawingContext } from '../../../context/drawingContext'
import ResolutionPopupMenu from './resolutionPopUpMenu/resolutionPopupMenu'
import { Dimensions, GraphConfig, SelectionArea, SweepData } from '../../interfaces/interfaces'
import useStyles from './DashboardStyles'

import { createDashboardWithGraphs } from './GraphRenderer'
import { useDrawInteractionHandler } from './hooks/useDrawInteractionHandler'
import { useFetchNewSweepData } from './hooks/useFetchNewSweepData'

interface DashboardProps {
  sweepData?: SweepData
  graphConfig: GraphConfig
  setGraphConfig: React.Dispatch<React.SetStateAction<GraphConfig>>
  setSweepData: React.Dispatch<React.SetStateAction<SweepData | undefined>>
}

const LOADING_TEXT = 'טוען מידע חדש לפי רזולוציה שנבחרה...'

const Dashboard: React.FC<DashboardProps> = ({ graphConfig, setGraphConfig, sweepData, setSweepData }) => {
  const classes = useStyles()
  const { enableDraw, setEnableDraw } = useContext(DrawingContext)

  const [previousData, setPreviousData] = useState<SweepData | null>(null)
  const [selectedArea, setSelectedArea] = useState<SelectionArea | null>(null)
  const [resolutionPopupPos, setResolutionPopupPos] = useState<{ left: number; top: number } | null>(null)
  const [loading, setLoading] = useState(false)

  const waterfallChartRef = useRef<ChartXY<PointMarker, UIBackground> | null>(null)
  const rectRef = useRef<RectangleFigure | null>(null)
  const rectDimensionsRef = useRef<Dimensions | null>(null)
  const startPoint = useRef<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // יצירת הגרפים
  useEffect(() => {
    if (!containerRef.current || !sweepData) return
    const { dashboard, heatmapChart } = createDashboardWithGraphs(containerRef.current, sweepData, graphConfig)
    waterfallChartRef.current = heatmapChart

    return () => {dashboard.dispose()}
  }, [sweepData])

  // ניהול אינטראקציה של ציור מלבן
  useDrawInteractionHandler({
    enableDraw,
    setEnableDraw,
    rectRef,
    rectDimensionsRef,
    startPoint,
    chart: waterfallChartRef.current,
    setResolutionPopupPos,
    setSelectedArea,
  })

  // שליפת מידע חדש ברגע שנבחרה רזולוציה
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

  return (
    <div className={classes.dashboardContainer}>
      <div ref={containerRef} className={classes.dashboard} />
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
          <Fab onClick={handleUndo} 
          // אני צריכה לתקן את זה - לא רציתי להתעכב כי העדפתי להתקדם
          // TODO: לחזור לפה
            sx={{ 
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: 'primary.main',
              color: 'text.primary',
              zIndex: 1000
            }}
            size="small">
            <UndoIcon color='inherit' />
          </Fab>
        )}

        {loading && (
          <div className={classes.loadingOverlay}>
            <div className={classes.blurBackground} />
            <div className={classes.loadingContent}>
              <CircularProgress size={60} thickness={5} color='secondary' />
              <div className={classes.loadingText}>{LOADING_TEXT}</div>
            </div>
          </div>
        )}
    </div>
  )
}

export default Dashboard