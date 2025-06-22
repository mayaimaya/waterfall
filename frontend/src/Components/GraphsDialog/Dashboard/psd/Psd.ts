import {
    ChartXY,
    AxisTickStrategies,
    LegendBoxBuilders,
} from '@arction/lcjs';
import { SweepData } from '../../../interfaces/interfaces';
import { computeChunkAveragedPSD } from '../../../../utiles/utiles';

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

    const rows = sweepData[locationId].captureTimes.length;
    const columns = sweepData[locationId].data[0].length;

    const VolumeStep = (endFrequency - startFrequency) / columns;

    // We'll average the power across all sweeps (rows) per frequency point (column)
    const averagedPsd: { x: number, y: number }[] = computeChunkAveragedPSD(sweepData[locationId].data, startFrequency, endFrequency);

    // sweepData[locationId].data.forEach((packet: number[], packetNum: number) => {
    //     let sum = 0
    //     packet.forEach((value) => sum += value)
    //     const avgPower = sum / rows;
    //     averagedPsd.push({
    //         x: startFrequency + packetNum * VolumeStep,
    //         y: avgPower
    //     });
    // })
    // for (let col = 0; col < columns; col++) {
    //     let sum = 0;
    //     for (let row = 0; row < rows; row++) {
    //         sum += sweepData[locationId].data[row][col];
    //     }
    //     const avgPower = sum / rows;
    //     averagedPsd.push({
    //         x: startFrequency + col * VolumeStep,
    //         y: avgPower
    //     });
    // }
    // Configure axes
    chart.getDefaultAxisX()
        .setInterval({ start: startFrequency, end: endFrequency })
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTitle(X_AXIS_TITLE);

    chart.getDefaultAxisY()
        .setTitle(Y_AXIS_TITLE)
        .setTickStrategy(AxisTickStrategies.Numeric);

    const psdSeries = chart.addLineSeries()
        .setName(LEGENDS_TEXT)
        .setStrokeStyle((stroke) => stroke.setThickness(2));

    psdSeries.add(averagedPsd);

    chart.addLegendBox(LegendBoxBuilders.VerticalLegendBox)
        .add(psdSeries);

    return chart;
};
