import { CircularProgress } from '@mui/material'

import useStyles from './loadingProgressStyle'

const LOADING_TEXT = 'טוען מידע חדש לפי רזולוציה שנבחרה...'

const LoadingProgress: React.FC = () => {
    const classes = useStyles()
    return (
        <div className={classes.loadingOverlay}>
            <div className={classes.blurBackground} />
            <div className={classes.loadingContent}>
                <CircularProgress size={60} thickness={5} color='secondary' />
                <div className={classes.loadingText}>{LOADING_TEXT}</div>
            </div>
        </div>
    )
}

export default LoadingProgress
