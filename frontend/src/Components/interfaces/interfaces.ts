export interface GraphData {
    [id: number] : {
        data: number[][]
        captureTimes: string[]
}
}

export interface SelectionArea  {
  startTime: number
  endTime: number
  minVolume: number
  maxVolume: number
}