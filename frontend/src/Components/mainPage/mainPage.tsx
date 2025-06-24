import React, { useEffect, useState } from 'react';
import {
    Button,
} from '@mui/material';
import GraphsDialog from '../GraphsDialog/GraphDialog';
import useStyles from './mainPageStyles';
import { GraphConfig, SweepData } from '../interfaces/interfaces';
import SweepsClient from '../utils/backend';

interface MainPageProps {
    setMode: React.Dispatch<React.SetStateAction<"light" | "dark">>}

const MainPage: React.FC<MainPageProps> = (props: MainPageProps) => {
    const { setMode } = props

    const [sweepData, setSweepData] = useState<SweepData | undefined>(undefined)
    const end = new Date();
    const start = new Date(end.getTime() - 10 * 60 * 60 * 1000);

    const [graphConfig, setGraphConfig] = useState<GraphConfig>({
        locationId: 5,
        startVolume: 2000,
        endVolume: 3000,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
    })

    const [open, setOpen] = useState(true);
    const classes = useStyles()

    useEffect(() => {
        new SweepsClient().getSweepData(graphConfig.locationId, graphConfig.startDate, graphConfig.endDate)
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
            <GraphsDialog 
                open={open}
                setOpen={setOpen}
                sweepData={sweepData}
                setSweepData={setSweepData}
                graphConfig={graphConfig}
                setGraphConfig={setGraphConfig}
            />
        </div>
    );
}
export default MainPage