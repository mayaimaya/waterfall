import React, { useContext, useEffect, useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import RoomIcon from '@mui/icons-material/Room'
import {
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    Button,
    IconButton,
} from '@mui/material'
import { boolean } from 'mathjs'

import { DrawingContext } from '../../../context/drawingContext'

import useStyles from './OptionsMenuStyles'

const TAGGING_STATE = 'מצב תיוג'
const RESOLUTION_STATE = 'שנה רזולוציה'
const PLAY_PSD = 'נגן PSD'
const SHOWֹֹֹֹֹ_PSD = 'נגן PSD'

interface Props {
    showPSD: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    setShowPSD: React.Dispatch<React.SetStateAction<boolean>>
}
const OptionsMenu: React.FC<Props> = ({ showPSD, setOpen, setShowPSD }) => {
    const { classes } = useStyles()

    const { enableDraw, setEnableDraw } = useContext(DrawingContext)

    const handleDraw = () => {
        setEnableDraw(!enableDraw)
    }

    const handlePSDOptionsClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowPSD(boolean(e.target.value))
    }

    return (
        <div className={classes.menuContainer}>
            <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
            </IconButton>
            <div className={classes.locationHeader}>
                <div className={classes.textLocation}>
                    <Typography className={classes.locationName}>שם המיקום</Typography>
                    <Typography>צפון</Typography>
                </div>
                <RoomIcon className={classes.locationIcon} />
            </div>

            {/* Apply fullWidthItem class to Divider */}
            <Divider className={classes.divider} />
            <RadioGroup
                value={showPSD}
                onChange={(e) => handlePSDOptionsClick(e)}
                className={classes.radioGroup}
            >
                <FormControlLabel
                    value='true'
                    control={<Radio />}
                    label={SHOWֹֹֹֹֹ_PSD}
                    className={classes.radioItem}
                />
                <FormControlLabel
                    value='false'
                    control={<Radio />}
                    label={PLAY_PSD}
                    className={classes.radioItem}
                />
            </RadioGroup>
            <Divider className={classes.divider} />
            <div className={classes.buttonGroup}>
                <Button>{TAGGING_STATE}</Button>
                <Button onClick={handleDraw}>{RESOLUTION_STATE}</Button>
            </div>
        </div>
    )
}

export default OptionsMenu
