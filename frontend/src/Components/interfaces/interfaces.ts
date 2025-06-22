import { ChartXY, PointMarker, UIBackground } from "@arction/lcjs"
import { RefObject } from "react"

export interface GraphData {
  [id: number] : {
    data: number[][]
    captureTimes: string[]
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
  paramId: number
}

export interface EnableRectangleInteraction {
  chart: ChartXY<PointMarker, UIBackground>
  startPoint: RefObject<{ x: number; y: number } | null>
  rectRef: RefObject<any>
  rectDimensions: RefObject<any>
  setEnableDraw: (value: boolean) => void
  onSelectionComplete?: (selection: SelectionArea) => void
}
