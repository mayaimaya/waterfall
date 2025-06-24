// OptionsMenu.tsx
import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    Button,
    IconButton,
} from "@mui/material";

import RoomIcon from "@mui/icons-material/Room";
import useStyles from "./OptionsMenuStyles";
import CloseIcon from '@mui/icons-material/Close';
import { DrawingContext } from "../../../context/drawingContext";
import { boolean } from "mathjs";

const TAGGING_STATE = 'מצב תיוג'
const RESOLUTION_STATE = 'שנה רזולוציה'

interface Props {
    showPSD: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setShowPSD: React.Dispatch<React.SetStateAction<boolean>>;
}
const OptionsMenu: React.FC<Props> = ({ showPSD, setOpen, setShowPSD}) => {
    const { classes } = useStyles()

    const { enableDraw, setEnableDraw } = useContext(DrawingContext);

    const handleDraw = () => {
        setEnableDraw(!enableDraw);
    }

    const handlePSDOptionsClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowPSD(boolean(e.target.value))
    }

    return (
        <Box className={classes.container}>
            <IconButton
                onClick={() => setOpen(false)}
            >
                <CloseIcon />
            </IconButton>
            <Box className={classes.locationHeader}>
                <Box className={classes.textAlignRight}>
                    <Typography>
                        שם המיקום
                    </Typography>
                    <Typography
                    >
                        צפון
                    </Typography>
                </Box>
                <RoomIcon />
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Radio Group */}
            <RadioGroup
                value={showPSD}
                onChange={(e) => handlePSDOptionsClick(e)}
                className={classes.radioGroup}
            >
                <FormControlLabel
                    value='true'
                    control={<Radio />}
                    label="PSD הצג"
                    className={classes.radioItem}
                />
                <FormControlLabel
                    value='false'
                    control={<Radio />}
                    label="PSD נגן"
                    className={classes.radioItem}
                />
            </RadioGroup>
            <Divider />
            <Box className={classes.buttonGroup}>
                <Button>{TAGGING_STATE}</Button>
                <Button onClick={handleDraw}>{RESOLUTION_STATE}</Button>
            </Box>
        </Box>
    );
};

export default OptionsMenu;
