import React, { useEffect, useState } from 'react';
import {
    Button,
} from '@mui/material';
import GraphsDialog from '../GraphsDialog/GraphDialog';
import useStyles from './mainPageStyles';
import { SweepData } from '../interfaces/interfaces';
import SweepsClient from '../API/backend';

interface MainPageProps {
    setMode: React.Dispatch<React.SetStateAction<"light" | "dark">>}

const MainPage: React.FC<MainPageProps> = (props: MainPageProps) => {
    const { setMode } = props

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
                  <Button onClick={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}>
                  Toggle  mode
                </Button>
            <Button variant="outlined" onClick={() => setOpen(true)}>
                Open Graphs Dialog
            </Button>
            <GraphsDialog open={open} setOpen={setOpen} sweepData={sweepData} />
        </div>
    );
}
export default MainPage