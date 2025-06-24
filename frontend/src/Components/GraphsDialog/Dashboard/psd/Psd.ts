import {
    ChartXY,
    AxisTickStrategies,
    LegendBoxBuilders,
} from '@arction/lcjs';
import { SweepData } from '../../../interfaces/interfaces';
import { calcPsdData } from '../../../utils/utiles';

const X_AXIS_TITLE = 'Frequency (Hz)';
const Y_AXIS_TITLE = 'Power (dB)';
const LEGENDS_TEXT_MEAN = 'Mean PSD';
const LEGENDS_TEXT_MAX = 'Max PSD';

export const createPsd = (
    chart: ChartXY,
    sweepData: SweepData,
    locationId: number,
    startFrequency: number,
    endFrequency: number
): ChartXY => {

    const strategy = 'mean';
    const meanPsd: { x: number, y: number }[] = calcPsdData(sweepData[locationId].data, startFrequency, endFrequency, strategy);
    const maxPsd: { x: number, y: number }[] = calcPsdData(sweepData[locationId].data, startFrequency, endFrequency, 'max');

    chart.getDefaultAxisX()
        .setInterval({ start: startFrequency, end: endFrequency })
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTitle(X_AXIS_TITLE);

    chart.getDefaultAxisY()
        .setTitle(Y_AXIS_TITLE)
        .setTickStrategy(AxisTickStrategies.Numeric)

    // Mean PSD series
    const meanSeries = chart.addLineSeries()
        .setName(LEGENDS_TEXT_MEAN)
        .setStrokeStyle((stroke) => stroke.setThickness(2));

    // Max PSD series
    const maxSeries = chart.addLineSeries()
        .setName(LEGENDS_TEXT_MAX)
        .setStrokeStyle((stroke) => stroke.setThickness(2));


    meanSeries.add(meanPsd);
    maxSeries.add(maxPsd);

    chart.addLegendBox(LegendBoxBuilders.VerticalLegendBox)
        .add(meanSeries)
        .add(maxSeries);

    return chart;
};
