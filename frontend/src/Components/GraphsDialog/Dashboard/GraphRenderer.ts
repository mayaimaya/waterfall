import { lightningChart, Themes } from '@arction/lcjs'
import { createHeatmap } from './Heatmap/createHeatmap'
// import { createPsd } from './psd/Psd'
import { GraphConfig, SweepData } from '../../interfaces/interfaces'

export const createDashboardWithGraphs = (
  container: HTMLDivElement,
  sweepData: SweepData,
  config: GraphConfig
) => {
  const dashboard = lightningChart().Dashboard({
    container,
    numberOfColumns: 1,
    numberOfRows: 2,
    theme: Themes.darkGold,
  })

  const heatmap = dashboard.createChartXY({ columnIndex: 0, rowIndex: 0 }).setTitle('Heatmap')
  const psd = dashboard.createChartXY({ columnIndex: 0, rowIndex: 1 }).setTitle('PSD')

  createHeatmap(heatmap, sweepData, config.locationId, config.startVolume, config.endVolume)
  // createPsd(psd, sweepData, config.locationId, config.startVolume, config.endVolume)

  return { dashboard, heatmapChart: heatmap, psdChart: psd }
}
