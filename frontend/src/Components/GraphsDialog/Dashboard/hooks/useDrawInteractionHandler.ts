import { MutableRefObject, useEffect, useRef } from 'react'
import { ChartXY, PointMarker, RectangleFigure, UIBackground } from '@arction/lcjs'
import { Dimensions, SelectionArea } from '../../../interfaces/interfaces'
import { genericRectangleInteraction } from '../GenericDrawingHandler/genericRectangleInteraction'

interface Props  {
  chart: ChartXY<PointMarker, UIBackground> | null
  startPoint: MutableRefObject<{ x: number; y: number } | null>
  rectRef: MutableRefObject< RectangleFigure | null> 
  rectDimensionsRef: MutableRefObject<Dimensions | null>
  setEnableDraw: (value: boolean) => void
  enableDraw: boolean
  setResolutionPopupPos: (pos: { left: number; top: number } | null) => void
  setSelectedArea: (area: SelectionArea | null) => void
}

export const useDrawInteractionHandler = (props:Props) => {

  const { chart, enableDraw, rectDimensionsRef, rectRef, setEnableDraw, setResolutionPopupPos, setSelectedArea, startPoint} = props
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!chart) return

    chart.setMouseInteractionRectangleZoom(!enableDraw)
    chart.setMouseInteractions(!enableDraw)

    if (enableDraw) {
      cleanupRef.current = genericRectangleInteraction({
        chart,
        startPoint,
        rectRef,
        rectDimensionsRef,
        setEnableDraw,
        onSelectionComplete: (selection) => {
          setSelectedArea(selection)
          setResolutionPopupPos(selection.screenPosition)
        },
      }) 
    }

    return () => {
      cleanupRef.current?.()
      cleanupRef.current = null
    }
  }, [enableDraw])
}
