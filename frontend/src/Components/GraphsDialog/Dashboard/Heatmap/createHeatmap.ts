import {
  PalettedFill,
  LUT,
  emptyLine,
  ChartXY,
  LegendBoxBuilders,
  regularColorSteps,
  AxisTickStrategies,
} from '@arction/lcjs'

import { TIME_CONSTANT } from '../../../constants'
import { SweepData } from '../../../interfaces/interfaces'

const X_AXIS_TITLE = 'Volume (mL)'
const Y_AXIS_TITLE = 'Time'
const LUT_MIN_VALUE = -200
const LUT_MAX_VALUE = -250
const LEGENDS_TEXT = 'Heatmap'

export const createHeatmap = (
  chart: ChartXY,
  sweepData: SweepData,
  locationId: number,
  startVolume: number,
  endVolume: number,
): ChartXY => {
  const captureTimesRaw = sweepData[locationId].captureTimes

  const rows = captureTimesRaw.length
  const columns = sweepData[locationId].data[0].length

  // const maxValue = Math.max(...sweepData[locationId].captureTimes.map((date: string) => new Date(date).getTime())) - TIME_CONSTANT
  // const minValue = Math.min(...sweepData[locationId].captureTimes.map((date: string) => new Date(date).getTime())) - TIME_CONSTANT

  // const vMinHeatmap = useMemo(() => z.length ? Math.min(...(z.map((d: number[]) => (Math.min(...d))))) + 1 : 0, [z])
  // const vMaxHeatmap = useMemo(() => z.length ? Math.max(...(z.map((d: number[]) => (Math.max(...d))))) : 100, [z])
  const maxTime = Math.max(...captureTimesRaw) - TIME_CONSTANT
  const minTime = Math.min(...captureTimesRaw) - TIME_CONSTANT

  const stepX = (endVolume - startVolume) / columns
  const stepY = (maxTime - minTime) / (rows - 1)

  chart
    .getDefaultAxisX()
    .setInterval({ start: startVolume, end: endVolume })
    .setTickStrategy(AxisTickStrategies.Numeric)
    .setTitle(X_AXIS_TITLE)

  chart
    .getDefaultAxisY()
    .setTickStrategy(AxisTickStrategies.DateTime)
    .setTitle(Y_AXIS_TITLE)
    .setMouseInteractions(true)
    .setInterval({ start: minTime, end: maxTime })

  chart
    .addHeatmapGridSeries({
      columns,
      rows,
      start: { x: startVolume + stepX / 2, y: minTime },
      step: {
        x: stepX,
        y: stepY,
      },
      dataOrder: 'rows',
      heatmapDataType: 'intensity',
    })
    .setWireframeStyle(emptyLine)
    .setFillStyle(
      new PalettedFill({
        lookUpProperty: 'value',
        lut: new LUT({
          interpolate: true,
          steps: regularColorSteps(
            LUT_MIN_VALUE,
            LUT_MAX_VALUE,
            chart.getTheme().examples?.spectrogramColorPalette ?? [],
          ),
        }),
      }),
    )
    .invalidateIntensityValues(sweepData[locationId].data)
    .setName(LEGENDS_TEXT)
    .onMouseDoubleClick(() => {
      chart.getDefaultAxisX().setInterval({ start: startVolume, end: endVolume })
      chart.getDefaultAxisY().setInterval({ start: minTime, end: maxTime })
    })

  chart
    .addLegendBox(LegendBoxBuilders.VerticalLegendBox)
    .setAutoDispose({ type: 'max-width', maxWidth: 0.8 })
    .add(chart)

  return chart
}
