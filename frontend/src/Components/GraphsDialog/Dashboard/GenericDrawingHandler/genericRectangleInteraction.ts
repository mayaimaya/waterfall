import {
  SolidFill,
  ColorRGBA,
  SolidLine,
} from "@arction/lcjs"
import { GenericRectangleInteractionProps } from "../../../interfaces/interfaces"

/**
 * Enables interactive rectangle selection on a chart component.
 *
 * This function attaches pointer event listeners to the chart's container,
 * allowing users to draw a rectangle by clicking and dragging. The rectangle's
 * coordinates and dimensions are calculated relative to the chart's axes.
 * When the selection is completed (pointer up - the client finish to draw the rectangle ), the selected area is reported
 * via the `onSelectionComplete` callback.
 *
 * @param chart - The chart instance to attach the interaction to.
 * @param startPoint - A mutable ref object to store the starting point of the rectangle.
 * @param rectRef - A mutable ref object to store the current rectangle instance.
 * @param rectDimensionsRef - A mutable ref object to store the rectangle's dimensions.
 * @param setEnableDraw - A function to enable or disable drawing mode.
 * @param onSelectionComplete - Callback invoked with the selection details when the rectangle is completed.
 *
 * @returns A cleanup function that removes the event listeners when called - 
 * when the client finish to draw- all the event listeners will remove.

 */
export const genericRectangleInteraction = (props: GenericRectangleInteractionProps) => {
  const {
    chart,
    startPoint,
    rectRef,
    rectDimensionsRef,
    setEnableDraw,
    onSelectionComplete,
  } = props
  if (!chart) return null
  const rectSeries = chart.addRectangleSeries()
  const fillColorRectangle = ColorRGBA(255, 255, 277, 70)
  const strokeStyleRectangle = ColorRGBA(0,0,0)
  
  /**
   * Translates a pointer event's coordinates to the chart's coordinate system.
   *
   * @param event - The pointer event containing the screen coordinates.
   * @returns An object with the translated `x` and `y` coordinates relative to the chart.
   */
  const getCoordinates = (event: PointerEvent) => {
    const translated = chart.translateCoordinate(event, chart.coordsAxis)

    return {
      x: translated.x,
      y: translated.y
    }
  }

  /**
   * Handles the pointer down event to initiate rectangle drawing on the graph.
   *
   * This function captures the starting coordinates of the pointer event, clears any existing rectangle series,
   * and creates a new rectangle at the pointer's position with zero width and height. It also sets the fill and
   * stroke styles for the rectangle and stores references for further manipulation during pointer movement.
   *
   * @param e - The pointer event triggered by the user interaction.
  */
  const onPointerDown = (e: PointerEvent) => {
    const start = getCoordinates(e)
    startPoint.current = start
    rectSeries.clear()

    //adding a rec series - every point - in order to create a rectangle
    const rect = rectSeries.add({
      x: start.x,
      y: start.y,
      width: 0,
      height: 0,
    })

    //change the colors of the rectangle
    rect.setFillStyle(
      new SolidFill({ color: fillColorRectangle })
    )
    rect.setStrokeStyle(
      new SolidLine({
        thickness: 3,
        fillStyle: new SolidFill({ color: strokeStyleRectangle }),
      })
    )

    rectRef.current = rect
    rectDimensionsRef.current = {
      x: start.x,
      y: start.y,
      width: 0,
      height: 0,
    }
  }

  /**
   * Handles the pointer move event to dynamically update the dimensions and position
   * of a rectangle being drawn on the screen. Calculates the rectangle's coordinates
   * and size based on the initial pointer position and the current pointer position.
   *
   * @param e - The pointer event triggered by the user's pointer movement.
   */
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

    rectDimensionsRef.current = {
      x: xMin,
      y: yMin,
      width,
      height,
    }
  }

  /**
   * Handles the pointer up event after drawing a selection rectangle on the chart.
   *
   * This function finalizes the selection by:
   * - Extracting the rectangle's dimensions (start and end times, min and max volumes).
   * - Translating the rectangle's top-right corner to client (screen) coordinates for popup positioning.
   * - Invoking the `onSelectionComplete` callback with the selection data and popup position.
   * - Resetting the drawing state and clearing temporary references.
  
   */
  const onPointerUp = () => {
    if (!rectDimensionsRef.current) return

    const { x, y, width, height } = rectDimensionsRef.current
    const selection= {
      startTime: y,
      endTime: y + height,
      minVolume: x,
      maxVolume: x + width,
      
    }

    // getting the pixel of the point right top -
    // in order to locate the popup next to this point
    const pixelAnchor = chart.translateCoordinate( 
      {
        x: selection.maxVolume,
        y: selection.endTime 
      },
      chart.coordsAxis,
      chart.coordsClient
    )

    const screenPosition = {
      left: pixelAnchor.clientX,
      top: pixelAnchor.clientY
    }


    // שולח את המידע החוצה
    if (onSelectionComplete) {
      onSelectionComplete({
        ... selection,
        screenPosition
      })
    }

    // איפוס
    startPoint.current = null
    rectRef.current = null
    rectDimensionsRef.current = null
    setEnableDraw(false)
  }

  const container = chart.engine.container
  container.addEventListener("pointerdown", onPointerDown)
  container.addEventListener("pointermove", onPointerMove)
  container.addEventListener("pointerup", onPointerUp)

  return () => {
    container.removeEventListener("pointerdown", onPointerDown)
    container.removeEventListener("pointermove", onPointerMove)
    container.removeEventListener("pointerup", onPointerUp)
  }
}
