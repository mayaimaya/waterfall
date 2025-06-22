export interface GraphData {
    [id: number] : {
        data: number[][]
        captureTimes: string[]
}
}

export interface GraphConfig {
        startVolume: number
        endVolume: number
        paramId: number
    }