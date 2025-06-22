import React, { useEffect, useRef, useState } from 'react'
import {
    lightningChart,
    Themes,
} from '@arction/lcjs'
import { createHeatmap } from '../Heatmap'
import { GraphData } from '../../interfaces/interfaces'
import לsweepsClient from '../../API/backend'
import useStyles from './dashboardStyles'


const Dashboard = () => {
    const [sweepData, setSweepData] = useState<GraphData | undefined>(undefined)

    const classes = useStyles()

    const startVolume = 1000
    const endVolume = 2000
    const locationId = 5

    useEffect(() => {
        new לsweepsClient().getSweepData(locationId)
            .then((response: GraphData) => {
                setSweepData(response)
            })
            .catch((error: any) => {
                console.error('Error fetching data:', error)
                setSweepData(undefined)
            })
    }, [])



    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current || !sweepData) return

        const dashboard = lightningChart().Dashboard({
            container: containerRef.current,
            numberOfColumns: 1,
            numberOfRows: 2,
            theme: Themes.darkGold,
        })

        const heatmapGraph = dashboard.createChartXY({ columnIndex: 0, rowIndex: 0 }).setTitle('Heatmap 1')
        const psdGraph = dashboard.createChartXY({ columnIndex: 0, rowIndex: 1 }).setTitle('Heatmap 2')

        createHeatmap(heatmapGraph, sweepData, locationId, startVolume, endVolume)
        createHeatmap(psdGraph, sweepData, locationId, startVolume, endVolume)

        return () => {
            dashboard.dispose()
        }
    }, [sweepData])

    return (
        <div ref={containerRef} className={classes.dashboard} />
    )
}

export default Dashboard
