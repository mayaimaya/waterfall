import React, { useEffect, useRef, useState } from 'react'
import {
    lightningChart,
    Themes,
} from '@arction/lcjs'
import { createHeatmap } from '../Heatmap'
import { GraphConfig, GraphData } from '../../interfaces/interfaces'
import AxiosService from '../API/backend'
import useStyles from './dashboardStyles'


const HeatmapDashboard = () => {
    const [graphData, setGraphData] = useState<GraphData | undefined>(undefined)
    const classes = useStyles()
    const graphConfig: GraphConfig = {
        startVolume: 1000,
        endVolume: 2000,
        paramId: 5
    }
    useEffect(() => {
        new AxiosService().getData(graphConfig.paramId)
            .then((response: GraphData) => {
                console.log(response)
                setGraphData(response)
            })
            .catch((error: any) => {
                console.error('Error fetching data:', error)
                setGraphData(undefined)
            })
    }, [])



    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current || !graphData) return

        const dashboard = lightningChart().Dashboard({
            container: containerRef.current,
            numberOfColumns: 1,
            numberOfRows: 2,
            theme: Themes.darkGold,
        })

        const chart1 = dashboard.createChartXY({ columnIndex: 0, rowIndex: 0 }).setTitle('Heatmap 1')
        const chart2 = dashboard.createChartXY({ columnIndex: 0, rowIndex: 1 }).setTitle('Heatmap 2')

        createHeatmap(chart1, graphData, graphConfig)
        createHeatmap(chart2, graphData, graphConfig)

        return () => {
            dashboard.dispose()
        }
    }, [graphData])

    return (
        <div ref={containerRef} className={classes.dashboard} />
    )
}

export default HeatmapDashboard
