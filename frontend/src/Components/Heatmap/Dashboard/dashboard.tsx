import React, { useEffect, useRef, useState } from 'react'
import {
    lightningChart,
    Themes,
} from '@arction/lcjs'
import { createHeatmap } from '../Heatmap'
import { GraphData } from '../../interfaces/interfaces'
import AxiosService from '../API/backend'


const HeatmapDashboard = () => {
    const [graphData, setGraphData] = useState<GraphData | undefined>(undefined)
    const param_id = 5
    useEffect(() => {
        new AxiosService().getData(param_id)
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

        const heatmap1 = createHeatmap(chart1, graphData, param_id)
        const heatmap2 = createHeatmap(chart2, graphData, param_id)

        return () => {
            dashboard.dispose()
        }
    }, [graphData])

    return (
        <div ref={containerRef} style={{ width: '1000px', height: '600px' }} />
    )
}

export default HeatmapDashboard
