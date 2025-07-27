import { lightningChart, Themes } from '@arction/lcjs'

import { TIME_CONSTANT } from '../../constants'
import { GraphConfig, SweepData } from '../../interfaces/interfaces'

import { createHeatmapGraph } from './Heatmap/createHeatmapGraph'

export const createDashboardWithGraphs = (
  container: HTMLDivElement,
  sweepData: SweepData,
  graphConfig: GraphConfig,
) => {
  const dashboard = lightningChart().Dashboard({
    container,
    numberOfColumns: 1,
    numberOfRows: 2,
    theme: Themes.darkGold,
  })

  const heatmap = dashboard.createChartXY({ columnIndex: 0, rowIndex: 0 }).setTitle('Heatmap')
  const psd = dashboard.createChartXY({ columnIndex: 0, rowIndex: 1 }).setTitle('PSD')

  createHeatmapGraph({
    chart: heatmap,
    startFreq: graphConfig.startVolume,
    endFreq: graphConfig.endVolume,
    x: Array.from(
      { length: graphConfig.endVolume - graphConfig.startVolume + 1 },
      (_, i) => graphConfig.startVolume + i,
    ),
    y: sweepData[graphConfig.locationId].captureTimes.map(
      (time) => new Date(time).getTime() - TIME_CONSTANT,
    ),
    times: sweepData[graphConfig.locationId].captureTimes.map(
      (time) => new Date(time).getTime() - TIME_CONSTANT,
    ),
    z: sweepData[graphConfig.locationId].data,
    heatmapLUT: undefined,
  })

  return { dashboard, heatmapChart: heatmap, psdChart: psd }
}
