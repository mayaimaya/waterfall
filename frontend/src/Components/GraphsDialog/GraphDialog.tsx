import React from 'react';
import {
    Box,
    Dialog,
    DialogContent,
} from '@mui/material';
import { GraphConfig, SweepData } from '../interfaces/interfaces';
import OptionsMenu from './OptionsMenu/OptionsMenu';
import Dashboard from './Dashboard/Dashboard';
import { DrawingProvider } from '../../context/drawingContext';


interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    sweepData: SweepData | undefined
    setSweepData: React.Dispatch<React.SetStateAction<SweepData | undefined>>
    graphConfig: GraphConfig; // Adjust type as needed
    setGraphConfig: React.Dispatch<React.SetStateAction<GraphConfig>>; // Adjust type as
}
const GraphsDialog: React.FC<Props> = (props:Props) => {
    const { setOpen, sweepData, setSweepData, graphConfig, setGraphConfig, open } = props;
    const [enableDraw, setEnableDraw] = React.useState<boolean>(false);

    return (
        <DrawingProvider enableDraw={enableDraw} setEnableDraw={setEnableDraw}> 
            <Dialog open={open} fullWidth maxWidth="md">
                <DialogContent sx={{ p: 0, height: '100vh' }}>
                    <Box display="flex" height="100%">
                        <Dashboard sweepData={sweepData} setSweepData={setSweepData} graphConfig={graphConfig} setGraphConfig={setGraphConfig} />
                        <OptionsMenu setOpen={setOpen}/>
                    </Box>
                </DialogContent>
            </Dialog>
        </DrawingProvider>
       
    );
}
export default GraphsDialog;