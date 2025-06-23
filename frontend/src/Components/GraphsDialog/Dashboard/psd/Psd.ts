import {
    ChartXY,
    AxisTickStrategies,
    LegendBoxBuilders,
} from '@arction/lcjs';
import { SweepData } from '../../../interfaces/interfaces';
import { calcPsdData } from '../../../utils/utiles';

const X_AXIS_TITLE = 'Frequency (Hz)';
const Y_AXIS_TITLE = 'Power (dB)';
const LEGENDS_TEXT = 'PSD';

export const createPsd = (
    chart: ChartXY,
    sweepData: SweepData,
    locationId: number,
    startFrequency: number,
    endFrequency: number
): ChartXY => {

    const strategy = 'mean'; // or 'max' based on your requirement
    const averagedPsd: { x: number, y: number }[] = calcPsdData(sweepData[locationId].data, startFrequency, endFrequency, strategy);

    chart.getDefaultAxisX()
        .setInterval({ start: startFrequency, end: endFrequency })
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTitle(X_AXIS_TITLE)

    chart.getDefaultAxisY()
        .setTitle(Y_AXIS_TITLE)
        .setTickStrategy(AxisTickStrategies.Numeric);

    const psdSeries = chart.addLineSeries()
        .setName(LEGENDS_TEXT)
        .setStrokeStyle((stroke) => stroke.setThickness(2));

    psdSeries.add(averagedPsd)

    chart.addLegendBox(LegendBoxBuilders.VerticalLegendBox)
        .add(psdSeries)

    return chart;
};
