import React, { useEffect } from 'react'

import { AxisTickStrategies, LegendBoxBuilders } from '@arction/lcjs'

import { DashboardRefs } from '../../../../existCode/components/src/components/generic/LCHeatmap/types'
import { Location, SweepData } from '../../../interfaces/interfaces'
import { calcPsdData } from '../../../utils/utiles'

const X_AXIS_TITLE = 'Frequency (Hz)'
const Y_AXIS_TITLE = 'Power (dB)'
const LEGENDS_TEXT_MEAN = 'Mean PSD'
const LEGENDS_TEXT_MAX = 'Max PSD'

interface Props {
  graphsRef: React.MutableRefObject<DashboardRefs>
  startFrequency: number
  endFrequency: number
  sweepData: SweepData
  sensor: Location
  rowIndex: number
  columnIndex: number
}

const PSD: React.FC<Props> = ({
  graphsRef,
  startFrequency,
  endFrequency,
  sweepData,
  sensor,
  rowIndex,
  columnIndex,
}) => {
  useEffect(() => {
    const dashboard = graphsRef.current?.dashboard
    if (!dashboard || !sweepData[sensor.id]) return
    console.log(dashboard, 'here')

    const chart = dashboard.createChartXY({ columnIndex, rowIndex })

    const meanPsd = calcPsdData(sweepData[sensor.id].data, startFrequency, endFrequency, 'mean')
    const maxPsd = calcPsdData(sweepData[sensor.id].data, startFrequency, endFrequency, 'max')

    chart
      .getDefaultAxisX()
      .setTitle(X_AXIS_TITLE)
      .setTickStrategy(AxisTickStrategies.Numeric)
      .setInterval({ start: startFrequency, end: endFrequency })

    chart.getDefaultAxisY().setTitle(Y_AXIS_TITLE).setTickStrategy(AxisTickStrategies.Numeric)

    //     // Create series
    const meanSeries = chart
      .addLineSeries()
      .setName(LEGENDS_TEXT_MEAN)
      .setStrokeStyle((stroke) => stroke.setThickness(2))

    const maxSeries = chart
      .addLineSeries()
      .setName(LEGENDS_TEXT_MAX)
      .setStrokeStyle((stroke) => stroke.setThickness(2))

    meanSeries.add(meanPsd)
    maxSeries.add(maxPsd)

    chart.addLegendBox(LegendBoxBuilders.VerticalLegendBox).add(meanSeries).add(maxSeries)

    graphsRef.current.psdGraph = {
      ...graphsRef.current.psdGraph,
      chart,
    }

    return () => {
      chart?.dispose()
    }
  }, [graphsRef.current.dashboard])

  return null
}

export default PSD
