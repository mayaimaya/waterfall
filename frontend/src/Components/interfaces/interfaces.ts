import { MutableRefObject } from 'react'

import { ChartXY, PointMarker, RectangleFigure, UIBackground } from '@arction/lcjs'

export interface SweepData {
  [id: number]: {
    data: number[][]
    captureTimes: number[]
  }
}

export interface Position {
  left: number
  top: number
}

export interface SelectionArea {
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

export interface GenericRectangleInteractionProps {
  chart: ChartXY<PointMarker, UIBackground> | null
  startPoint: MutableRefObject<{ x: number; y: number } | null>
  rectRef: MutableRefObject<RectangleFigure | null>
  rectDimensionsRef: MutableRefObject<Dimensions | null>
  setEnableDraw: (value: boolean) => void
  onSelectionComplete: (selection: SelectionArea) => void
}

export interface PSDPoint {
  x: number
  y: number
}

export const PSDStrategy = {
  Mean: 'mean',
  Max: 'max',
} as const

export type PSDStrategy = (typeof PSDStrategy)[keyof typeof PSDStrategy]

export interface Location {
  id: number
}
