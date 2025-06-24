import { ChartXY, PointMarker, RectangleFigure, UIBackground } from "@arction/lcjs"
import { MutableRefObject } from "react"


export interface SweepData {
    [id: number] : {
        data: number[][]
        captureTimes: number[]
}
}

export interface Position {
  left: number 
  top: number
}

export interface SelectionArea  {
  startTime: number
  endTime: number
  minVolume: number
  maxVolume: number
  screenPosition: Position
}

export interface GraphConfig {
  startVolume: number
  endVolume: number
  locationId: number
  startDate: string
  endDate: string
}

export interface Dimensions {
  x: number
  y: number
  width: number
  height: number
}

export interface EnableRectangleInteraction {
  waterfallChart: ChartXY<PointMarker, UIBackground>
  startPoint: MutableRefObject<{ x: number; y: number } | null>
  rectRef: MutableRefObject< RectangleFigure | null> 
  rectDimensions: MutableRefObject<Dimensions | null>
  setEnableDraw: (value: boolean) => void
  onSelectionComplete: (selection: SelectionArea) => void
}
