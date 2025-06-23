/* eslint-disable react/display-name */
import React, { ReactNode, memo, useContext, useEffect } from 'react'
import { lightningChart, emptyLine } from '@arction/lcjs'

import { sensorsToDisplayContext } from '../../WaterfallAnalysisMainPage/context/SensorsToDisplayContext'
import { showLegendContext } from '../../WaterfallAnalysisMainPage/context/showLegendContext'
import { GraphsRef } from '../LCHeatmap/types'

import useStyles from './DashboardStyles'

interface Props {
    rows: number
    columns: number
    children: ReactNode
    graphsRef: React.MutableRefObject<GraphsRef>
    isDataLoading: boolean
}

const CONTAINER_ID = 'dashboard'

const LCDashboard: React.FC<Props> = memo(({ rows, columns, children, graphsRef, isDataLoading }: Props) => {
  const { classes } = useStyles()

  useEffect(() => {
    const dashboard = lightningChart().Dashboard({
      numberOfRows: rows,
      numberOfColumns: columns,
      container: CONTAINER_ID
    })
    dashboard.setSplitterStyle(emptyLine)
    graphsRef.current.dashboard = dashboard
    return () => {
      graphsRef.current.dashboard?.dispose()
      graphsRef.current.dashboard = undefined
    }
  }, [isDataLoading, rows, columns])

  return (
    <>
      <div id={CONTAINER_ID} className={classes.graphs} />
      {children}
    </>
  )
})

export default LCDashboard
