import React, { useEffect, useRef} from 'react'
import {
    lightningChart,
    Themes,
} from '@arction/lcjs'
import { createHeatmap } from './Heatmap/Heatmap'
import { SweepData } from '../../interfaces/interfaces'
import useStyles from './dashboardStyles'
import { createPsd } from './psd/psd'

interface Props {
    sweepData: SweepData | undefined
}
const Dashboard: React.FC<Props> = ({ sweepData }) => {

    const classes = useStyles()

    const startVolume = 1000
    const endVolume = 2000
    const locationId = 5



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
        createPsd(psdGraph, sweepData, locationId, startVolume, endVolume)

        return () => {
            dashboard.dispose()
        }
    }, [sweepData])

    return (
        <div ref={containerRef} className={classes.dashboard} />
    )
}

export default Dashboard
