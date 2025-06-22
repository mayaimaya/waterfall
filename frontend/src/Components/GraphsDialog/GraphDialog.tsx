import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Dialog,
    DialogContent,
    IconButton,
} from '@mui/material';
import { SweepData } from '../interfaces/interfaces';
import OptionsMenu from './OptionsMenu/OptionsMenu';
import Dashboard from './Dashboard/dashboard';


interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    sweepData: SweepData | undefined
}
const GraphsDialog: React.FC<Props> = ({ open, setOpen, sweepData }) => {
    return (
        <Dialog open={true} fullWidth maxWidth="md">
            <DialogContent sx={{ p: 0, height: '80vh' }}>
                <Box display="flex" height="100%">
                    <Dashboard sweepData={sweepData} />
                    <OptionsMenu setOpen={setOpen}/>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
export default GraphsDialog;