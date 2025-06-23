import { ChartXY, Dashboard, HeatmapGridSeriesIntensityValues, HeatmapScrollingGridSeriesIntensityValues, LegendBox, UIBackground } from '@arction/lcjs'

export interface DataPoint {
    x: number
    y: number
}

export interface Packet {
    capture_time: string
    data: number[]
}

export interface WaterfallData {
    [id: number]: Packet[]
}

export interface WaterfallGraph {
    chart?: ChartXY
    heatmap?: HeatmapGridSeriesIntensityValues
    legend?: LegendBox<UIBackground>
}

export interface GraphsRef {
    [id: number]: WaterfallGraph
    dashboard?: Dashboard
}

export interface Index {
    rowIndex: number
    colIndex: number
}

export interface Frequency {
    start: number
    end: number
}
