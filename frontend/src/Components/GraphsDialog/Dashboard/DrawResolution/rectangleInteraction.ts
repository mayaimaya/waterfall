import {
  SolidFill,
  ColorRGBA,
  SolidLine,
} from "@arction/lcjs"
import { EnableRectangleInteraction } from "../../../interfaces/interfaces"


/**
 * Enables interactive rectangle selection on a waterfallChart component.
 *
 * This function attaches pointer event listeners to the waterfallChart's container,
 * allowing users to draw a rectangle by clicking and dragging. The rectangle's
 * coordinates and dimensions are calculated relative to the waterfallChart's axes.
 * When the selection is completed (pointer up - the client finish to draw the rectangle ), the selected area is reported
 * via the `onSelectionComplete` callback.
 *
 * @param waterfallChart - The waterfallChart instance to attach the interaction to.
 * @param startPoint - A mutable ref object to store the starting point of the rectangle.
 * @param rectRef - A mutable ref object to store the current rectangle instance.
 * @param rectDimensions - A mutable ref object to store the rectangle's dimensions.
 * @param setEnableDraw - A function to enable or disable drawing mode.
 * @param onSelectionComplete - Callback invoked with the selection details when the rectangle is completed.
 *
 * @returns A cleanup function that removes the event listeners when called - 
 * when the client finish to draw- all the event listeners will remove.

 */
export const enableRectangleInteraction = (props: EnableRectangleInteraction) => {
  const {
    waterfallChart,
    startPoint,
    rectRef,
    rectDimensions,
    setEnableDraw,
    onSelectionComplete,
  } = props


  const axisX = waterfallChart.getDefaultAxisX()
  const axisY = waterfallChart.getDefaultAxisY()
  const rectSeries = waterfallChart.addRectangleSeries()

  
  const getCoordinates = (event: PointerEvent) => {
    const bounds = waterfallChart.engine.container.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top

    const xVal =
      axisX.getInterval().start +
      (x / bounds.width) *
        (axisX.getInterval().end - axisX.getInterval().start)

    const yVal =
      axisY.getInterval().start +
      ((bounds.height - y) / bounds.height) *
        (axisY.getInterval().end - axisY.getInterval().start)

    return { x: xVal, y: yVal }
  }

  const onPointerDown = (e: PointerEvent) => {
    const start = getCoordinates(e)
    startPoint.current = start
    rectSeries.clear()

    const rect = rectSeries.add({
      x: start.x,
      y: start.y,
      width: 0,
      height: 0,
    })

    rect.setFillStyle(
      new SolidFill({ color: ColorRGBA(255, 255, 0, 50) })
    )
    rect.setStrokeStyle(
      new SolidLine({
        thickness: 2,
        fillStyle: new SolidFill({ color: ColorRGBA(255, 0, 0) }),
      })
    )

    rectRef.current = rect
    rectDimensions.current = {
      x: start.x,
      y: start.y,
      width: 0,
      height: 0,
    }
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!startPoint.current || !rectRef.current) return

    const current = getCoordinates(e)

    const xMin = Math.min(startPoint.current.x, current.x)
    const xMax = Math.max(startPoint.current.x, current.x)
    const yMin = Math.min(startPoint.current.y, current.y)
    const yMax = Math.max(startPoint.current.y, current.y)

    const width = xMax - xMin
    const height = yMax - yMin

    rectRef.current.setDimensions({
      x: xMin,
      y: yMin,
      width,
      height,
    })

    rectDimensions.current = {
      x: xMin,
      y: yMin,
      width,
      height,
    }
  }

  const onPointerUp = () => {
    if (!rectDimensions.current) return

    const { x, y, width, height } = rectDimensions.current
    const selection = {
      startTime: y,
      endTime: y + height,
      minVolume: x,
      maxVolume: x + width,
      
    }
    const bounds = waterfallChart.engine.container.getBoundingClientRect()
    const centerY = y + height / 2
    const rightX = x + width

    const left = (((rightX - axisX.getInterval().start) / (axisX.getInterval().end - axisX.getInterval().start)) * bounds.width) + 20
    const top = bounds.height - ((centerY - axisY.getInterval().start) / (axisY.getInterval().end - axisY.getInterval().start)) * bounds.height


    // 🔔 שולח את המידע החוצה
    if (onSelectionComplete) {
      onSelectionComplete({... selection, screenPosition: { left, top }})
    }

    // איפוס
    startPoint.current = null
    rectRef.current = null
    rectDimensions.current = null
    setEnableDraw(false)
  }

  const container = waterfallChart.engine.container
  container.addEventListener("pointerdown", onPointerDown)
  container.addEventListener("pointermove", onPointerMove)
  container.addEventListener("pointerup", onPointerUp)

  return () => {
    container.removeEventListener("pointerdown", onPointerDown)
    container.removeEventListener("pointermove", onPointerMove)
    container.removeEventListener("pointerup", onPointerUp)
  }
}
