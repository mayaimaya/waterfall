import {
    PalettedFill,
    LUT,
    emptyLine,
    ChartXY,
    LegendBoxBuilders,
    regularColorSteps,
    AxisTickStrategies,
} from '@arction/lcjs'
import { TIME_CONSTANT } from '../../constants'
import { GraphData } from '../../interfaces/interfaces'



const X_AXIS_TITLE = 'Volume (mL)'
const Y_AXIS_TITLE = 'Time (s)'
const LUT_MIN_VALUE = -200
const LUT_MAX_VALUE = -250
const LEGENDS_TEXT = ''

export const createHeatmap = (chart: ChartXY, sweepData: GraphData, locationId: number, startVolume: number, endVolume: number) : ChartXY => {
    const rows = sweepData[locationId].captureTimes.length
    const columns = sweepData[locationId].data[0].length

    const maxValue = Math.max(...sweepData[locationId].captureTimes.map((date: string) => new Date(date).getTime())) - TIME_CONSTANT
    const minValue = Math.min(...sweepData[locationId].captureTimes.map((date: string) => new Date(date).getTime())) - TIME_CONSTANT

    chart.getDefaultAxisX()
        .setInterval({ start: startVolume, end: endVolume })
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTitle(X_AXIS_TITLE)
        

    chart.getDefaultAxisY()
        .setInterval({ start: minValue, end: maxValue })
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTitle(Y_AXIS_TITLE)

    chart.addHeatmapGridSeries({
        columns: columns,
        rows: rows,
        start: { x: startVolume, y: minValue },
        step: { x: (endVolume - startVolume) / columns, y: (maxValue - minValue) / rows },
        dataOrder: 'rows',
        heatmapDataType: 'intensity',
    })

        .setWireframeStyle(emptyLine)
        .setFillStyle(new PalettedFill({
            lookUpProperty: 'value',
            lut: new LUT({
                interpolate: true,
                steps: regularColorSteps(
                    LUT_MIN_VALUE,
                    LUT_MAX_VALUE,
                    chart.getTheme().examples?.spectrogramColorPalette ?? [],
                ),

            }),
        }))
        .invalidateIntensityValues(sweepData[locationId].data)
        .setName(LEGENDS_TEXT)

        .onMouseDoubleClick(() => {
            chart.getDefaultAxisX().setInterval({ start: startVolume, end: endVolume })
            chart.getDefaultAxisY().setInterval({ start: minValue, end: maxValue })
        }) 
    

    chart
        .addLegendBox(LegendBoxBuilders.VerticalLegendBox)
        .setAutoDispose({
            type: 'max-width',
            maxWidth: 0.8,
        })
        .add(chart)

    return chart
}