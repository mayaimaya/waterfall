import {
    PalettedFill,
    LUT,
    emptyLine,
    ChartXY,
    LegendBoxBuilders,
    regularColorSteps,
    AxisTickStrategies,
    AxisScrollStrategies,
    UIElementBuilders
} from '@arction/lcjs'
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
    endVolume: number
): ChartXY => {
    const captureTimesRaw = sweepData[locationId].captureTimes
    const captureTimes = captureTimesRaw.map((d) => new Date(d).getTime())
    const rows = captureTimes.length
    const columns = sweepData[locationId].data[0].length

    const stepY = captureTimes[1] - captureTimes[0]
    const minTime = captureTimes[0]
    const maxTime = captureTimes[captureTimes.length - 1]
    console.log('minTime:', minTime, 'maxTime:', maxTime, 'captureTimes:', captureTimes, 'rows:', rows, 'columns:', columns)

    chart.getDefaultAxisX()
        .setInterval({ start: startVolume, end: endVolume })
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTitle(X_AXIS_TITLE)

    const yAxis = chart.getDefaultAxisY()
    .setTickStrategy(AxisTickStrategies.Empty)
    .setScrollStrategy(undefined)
    .setTitle(Y_AXIS_TITLE)
    .setMouseInteractions(true)
    .setInterval({ start: minTime, end: maxTime })

// yAxis.addCustomTick(UIElementBuilders.AxisTickMajor)
//     .setValue(minTime)
//     .setTextFormatter(() => new Date(minTime).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }))

// yAxis.addCustomTick(UIElementBuilders.AxisTickMajor)
//     .setValue(maxTime)
//     .setTextFormatter(() => new Date(maxTime).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }))

    

// טיקים מותאמים (רק כל N צעדים)
// יצירת טיקים מותאמים
//  const tickStep = Math.max(1, Math.floor(rows / 10))

// for (let i = 0; i < rows; i += tickStep) {
//     const time = captureTimes[i]
//     yAxis.addCustomTick(UIElementBuilders.AxisTickMajor)
//         .setValue(time)
//         .setTextFormatter(() =>
//             new Date(time).toLocaleTimeString('he-IL', {
//                 hour: '2-digit',
//                 minute: '2-digit'
//             })
//         )
// }



    chart.addHeatmapGridSeries({
        columns,
        rows,
        start: { x: startVolume, y: minTime },
step: {
    x: (endVolume - startVolume) / columns,
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
                        chart.getTheme().examples?.spectrogramColorPalette ?? []
                    ),
                }),
            })
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
