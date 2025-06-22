import React, { useEffect, useState } from 'react';
import {
    Button,
} from '@mui/material';
import GraphsDialog from '../GraphsDialog/GraphDialog';
import useStyles from './mainPageStyles';
import { SweepData } from '../interfaces/interfaces';
import SweepsClient from '../API/backend';

const MainPage: React.FC = () => {
    const [sweepData, setSweepData] = useState<SweepData | undefined>(undefined)
    const locationId = 5

    const [open, setOpen] = useState(false);
    const classes = useStyles()

    useEffect(() => {
        new SweepsClient().getSweepData(locationId)
            .then((response: SweepData) => {
                setSweepData(response)
            })
            .catch((error: any) => {
                console.error('Error fetching data:', error)
                setSweepData(undefined)
            })
    }, [])


    return (
        <div className={classes.mainContainer}>
            <Button variant="outlined" onClick={() => setOpen(true)}>
                Open Graphs Dialog
            </Button>
            <GraphsDialog open={open} setOpen={setOpen} sweepData={sweepData} />
        </div>
    );
}
export default MainPage