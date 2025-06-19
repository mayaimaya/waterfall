import {
    PalettedFill,
    LUT,
    emptyLine,
    ChartXY,
    LegendBoxBuilders,
    regularColorSteps,
    AxisTickStrategies,
} from '@arction/lcjs'
import { GraphData } from '../interfaces/interfaces'

const X_AXIS_TITLE = 'Volume (mL)'
const Y_AXIS_TITLE = 'Time (s)'    
const TIME_CONSTANT = 1000000000000 * 1.7

export const createHeatmap = (chart: ChartXY, graphData: GraphData, param_id: number) => {
    const startVolume = 1000
    const endVolume = 2000
    const rows = graphData[param_id].captureTimes.length
    const columns = graphData[param_id].data[0].length
    const maxValue = Math.max(...graphData[param_id].captureTimes.map((date: string) => new Date(date).getTime())) - TIME_CONSTANT
    const minValue = Math.min(...graphData[param_id].captureTimes.map((date: string) => new Date(date).getTime())) - TIME_CONSTANT

    chart.getDefaultAxisX()
        .setInterval({ start: startVolume, end: endVolume })
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTitle(X_AXIS_TITLE)

    chart.getDefaultAxisY()
        .setInterval({ start: minValue, end: maxValue })
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTitle(Y_AXIS_TITLE)


    const heatmap = chart.addHeatmapGridSeries({
        columns: columns,
        rows: rows,
        start: { x: 1000, y: minValue }, 
        step: { x: 1000 / columns, y: (maxValue - minValue) / rows }, 
        dataOrder: 'rows',
        heatmapDataType: 'intensity',
    })


    heatmap.setWireframeStyle(emptyLine)
        .setFillStyle(new PalettedFill({
            lookUpProperty: 'value',
            lut: new LUT({
                interpolate: true,
                steps: regularColorSteps(
                    -200,
                    -250, 
                    chart.getTheme().examples?.spectrogramColorPalette ?? [],
                ),

            }),
        }))
    heatmap.invalidateIntensityValues(graphData[param_id].data)

    chart
        .addLegendBox(LegendBoxBuilders.VerticalLegendBox)
        .setAutoDispose({
            type: 'max-width',
            maxWidth: 0.8,
        })
        .add(chart) 

    heatmap.setName('show graph')

    return heatmap
}