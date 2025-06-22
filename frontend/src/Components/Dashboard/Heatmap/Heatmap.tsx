import {
    PalettedFill,
    LUT,
    emptyLine,
    ChartXY,
    LegendBoxBuilders,
    regularColorSteps,
    AxisTickStrategies,
} from '@arction/lcjs'
import { GraphConfig, GraphData } from '../../interfaces/interfaces'
import { TIME_CONSTANT } from '../../constants'

const X_AXIS_TITLE = 'Volume (mL)'
const Y_AXIS_TITLE = 'Time (s)'
const LUT_MIN_VALUE = -200
const LUT_MAX_VALUE = -250

export const createHeatmap = (chart: ChartXY, graphData: GraphData, graphConfig: GraphConfig) => {
    const { paramId, startVolume, endVolume } = graphConfig
    const rows = graphData[paramId].captureTimes.length
    const columns = graphData[paramId].data[0].length

    const maxValue = Math.max(...graphData[paramId].captureTimes.map((date: string) => new Date(date).getTime())) - TIME_CONSTANT
    const minValue = Math.min(...graphData[paramId].captureTimes.map((date: string) => new Date(date).getTime())) - TIME_CONSTANT

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
        .invalidateIntensityValues(graphData[paramId].data)
        .setName('show graph')

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