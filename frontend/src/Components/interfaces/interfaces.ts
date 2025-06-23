import { ChartXY, PointMarker, UIBackground } from "@arction/lcjs"
import { RefObject } from "react"


export interface SweepData {
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
  locationId: number
  startDate: string
  endDate: string
}

export interface EnableRectangleInteraction {
  chart: ChartXY<PointMarker, UIBackground>
  startPoint: RefObject<{ x: number; y: number } | null>
  rectRef: RefObject<any>
  rectDimensions: RefObject<any>
  setEnableDraw: (value: boolean) => void
  onSelectionComplete?: (selection: SelectionArea) => void
}

export interface PSDPoint {
    x: number;
    y: number;
}

export const PSDStrategy = {
  Mean: 'mean',
  Max: 'max',
} as const;

export type PSDStrategy = typeof PSDStrategy[keyof typeof PSDStrategy];
