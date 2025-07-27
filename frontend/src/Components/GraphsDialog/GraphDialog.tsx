import React, { useState } from 'react'

import { Dialog, DialogContent } from '@mui/material'

import { DrawingProvider } from '../../context/drawingContext'
import { GraphConfig, SweepData } from '../interfaces/interfaces'

import DashboardGraphs from './Dashboard/Dashboard'
import useStyles from './GraphDialogStyles'
import OptionsMenu from './OptionsMenu/OptionsMenu'

interface Props {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  sweepData: SweepData
  setSweepData: React.Dispatch<React.SetStateAction<SweepData>>
  graphConfig: GraphConfig // Adjust type as needed
  setGraphConfig: React.Dispatch<React.SetStateAction<GraphConfig>> // Adjust type as
}
const GraphsDialog: React.FC<Props> = (props: Props) => {
  const { setOpen, sweepData, setSweepData, graphConfig, setGraphConfig, open } = props
  const [enableDraw, setEnableDraw] = useState<boolean>(false)
  const [showPSD, setShowPSD] = useState<boolean>(false)

  const { classes } = useStyles()
  return (
    <DrawingProvider enableDraw={enableDraw} setEnableDraw={setEnableDraw}>
      <Dialog open={open} fullWidth maxWidth='lg'>
        <DialogContent className={classes.dialogContent}>
          <DashboardGraphs
            sweepData={sweepData}
            setSweepData={setSweepData}
            graphConfig={graphConfig}
            setGraphConfig={setGraphConfig}
            showPSD={showPSD}
          />
          <OptionsMenu showPSD={showPSD} setOpen={setOpen} setShowPSD={setShowPSD} />
        </DialogContent>
      </Dialog>
    </DrawingProvider>
  )
}
export default GraphsDialog
