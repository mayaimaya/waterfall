// OptionsMenu.tsx
import React, { useState } from "react";
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

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const OptionsMenu: React.FC<Props> = ({ setOpen }) => {
    const [selectedPSD, setSelectedPSD] = useState("PSD הצג");
    const classes = useStyles();

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
                value={selectedPSD}
                onChange={(e) => setSelectedPSD(e.target.value)}
                className={classes.radioGroup}
            >
                <FormControlLabel
                    value="PSD הצג"
                    control={<Radio size="small" />}
                    label="PSD הצג"
                    className={classes.radioItem}
                />
                <FormControlLabel
                    value="גן PSD"
                    control={<Radio size="small" />}
                    label="גן PSD"
                    className={classes.radioItem}
                />
            </RadioGroup>
            <Divider />

            {/* Buttons */}
            <Box className={classes.buttonGroup}>
                <Button>מצב תצוגה</Button>
                <Button>שנה תצוגה</Button>
            </Box>
        </Box>
    );
};

export default OptionsMenu;
