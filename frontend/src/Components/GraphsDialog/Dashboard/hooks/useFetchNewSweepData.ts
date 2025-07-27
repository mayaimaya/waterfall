import { useCallback } from 'react'

import { TIME_CONSTANT } from '../../../constants'
import { GraphConfig, SelectionArea, SweepData } from '../../../interfaces/interfaces'
import SweepsClient from '../../../utils/backend'

interface Props {
  setLoading: (val: boolean) => void
  setPreviousData: (val: SweepData | null) => void
  sweepData?: SweepData
  graphConfig: GraphConfig
  setGraphConfig: React.Dispatch<React.SetStateAction<GraphConfig>>
  setSweepData: React.Dispatch<React.SetStateAction<SweepData>>
}

export const useFetchNewSweepData = ({
  setLoading,
  setPreviousData,
  sweepData,
  graphConfig,
  setGraphConfig,
  setSweepData,
}: Props) => {
  const sweepsClient = new SweepsClient()

  return useCallback(
    async (selection: SelectionArea, resolution: string) => {
      try {
        setLoading(true)
        setPreviousData(sweepData || null)

        const startDate = new Date(selection.startTime + TIME_CONSTANT).toISOString()
        const endDate = new Date(selection.endTime + TIME_CONSTANT).toISOString()

        console.log(
          'Getting new data of those dates ->  ',
          startDate,
          endDate,
          ' \n and those volumes -> ',
          selection.minVolume,
          selection.maxVolume,
          '\n and those resolution -> ',
          resolution,
        )

        const response = await sweepsClient.getSweepData(graphConfig.locationId, startDate, endDate)

        await new Promise((resolve) => setTimeout(resolve, 1000)) // סימולציה של טעינה

        setSweepData(response)
        setGraphConfig((prev) => ({
          ...prev,
          startVolume: selection.minVolume,
          endVolume: selection.maxVolume,
          startDate,
          endDate,
        }))
      } catch (err) {
        console.error('Error fetching new data:', err)
      } finally {
        setLoading(false)
      }
    },
    [sweepData, graphConfig, setGraphConfig, setSweepData],
  )
}
