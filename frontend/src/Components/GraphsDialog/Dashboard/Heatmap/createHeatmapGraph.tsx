import {
  AxisTickStrategies,
  PalettedFill,
  HeatmapGridSeriesIntensityValues,
  regularColorSteps,
  LUT,
  Themes,
  ChartXY,
  UIElementBuilders,
  CustomTick,
  emptyLine,
  ColorRGBA,
  LegendBoxBuilders,
} from '@arction/lcjs'

interface Props {
  chart: ChartXY
  startFreq: number
  endFreq: number
  x: number[]
  y: number[]
  times: number[]
  z: number[][]
  heatmapLUT?: LUT | undefined
}

const X_AXIS_TITLE = 'Volume (mL)'
const Y_AXIS_TITLE = 'Time'

export const createHeatmapGraph = ({
  chart,
  endFreq,
  startFreq,
  z,
  times,
  y,
  x,
  heatmapLUT,
}: Props) => {
  const vMinHeatmap = z.length ? Math.min(...z.map((d: number[]) => Math.min(...d))) + 1 : 0

  const vMaxHeatmap = z.length ? Math.max(...z.map((d: number[]) => Math.max(...d))) : 100

  const majorTicksGap = Math.ceil(times.length / 5)
  const minorTicksGap = Math.ceil(times.length / 40)
  const rows = y.length
  const columns = z[0].length

  // create x axis
  chart
    .getDefaultAxisX()
    .setInterval({ start: startFreq, end: endFreq })
    .setTickStrategy(AxisTickStrategies.Numeric)
    .setTitle(X_AXIS_TITLE)
    .setMouseInteractions(true)

  // create y axis
  chart
    .getDefaultAxisY()
    .setTitle(Y_AXIS_TITLE)
    .setMouseInteractions(true)
    .setInterval({ start: Math.min(...y), end: Math.max(...y) })

  //create ticks
  const ticks: CustomTick[] = []
  const yAxis = chart.getDefaultAxisY()
  yAxis &&
    times.forEach((time, index) => {
      if (index % majorTicksGap === 0 && index !== 0) {
        const tick = yAxis
          .addCustomTick(UIElementBuilders.AxisTickMajor)
          .setValue(index)
          .setTextFormatter(() => new Date(time).toLocaleTimeString())
        ticks.push(tick)
      } else if (index === times.length - 1 || index === 0 || index % minorTicksGap === 0) {
        // Adjusted conditions for ticks
        const tick = yAxis
          .addCustomTick(UIElementBuilders.AxisTickMinor)
          .setValue(index)
          .setTextFormatter(() => new Date(time).toLocaleTimeString())
        ticks.push(tick)
      }
    })

  // create lut style
  const cmap = z.length
    ? (heatmapLUT ??
      new LUT({
        interpolate: true,
        steps: [
          ...regularColorSteps(
            vMinHeatmap ?? -150.0,
            vMaxHeatmap ?? 0.0,
            Themes.light.examples.spectrogramColorPalette,
          ),
          { value: vMinHeatmap - 1, color: ColorRGBA(0, 0, 0, 0), label: '' },
        ],
      }))
    : new LUT({
        interpolate: true,
        steps: regularColorSteps(
          vMinHeatmap ?? -150.0,
          vMaxHeatmap ?? 0.0,
          Themes.light.examples.spectrogramColorPalette,
        ),
      })

  const stepX = (endFreq - startFreq) / columns
  const stepY = (Math.max(...y) - Math.min(...y)) / (rows - 1)

  // add data
  const heatMap: HeatmapGridSeriesIntensityValues = chart
    ?.addHeatmapGridSeries({
      rows,
      columns,
      dataOrder: 'rows',
      start: {
        x: Math.min(...x),
        y: Math.min(...y),
      },
      end: {
        x: Math.max(...x),
        y: Math.max(...y),
      },
      step: {
        x: stepX,
        y: stepY,
      },
      heatmapDataType: 'intensity',
    })
    .setFillStyle(
      new PalettedFill({
        lut: cmap,
      }),
    )
    .setIntensityInterpolation('bilinear')
    .setCursorInterpolationEnabled(true)
    .invalidateIntensityValues(z)
    .setWireframeStyle(emptyLine)
    .setName('')

  heatMap.onMouseDoubleClick(() => {
    chart.getDefaultAxisX().setInterval({ start: startFreq, end: endFreq })
    chart.getDefaultAxisY().setInterval({ start: y[0], end: y[y.length - 1] })
  })

  //create a legend box
  chart
    .addLegendBox(LegendBoxBuilders.VerticalLegendBox)
    .setTitle('')
    .add(heatMap)
    .setDraggingMode(2)
    .setAutoDispose({ type: 'max-width', maxWidth: 2 })

  return { heatmapChart: chart }
}
