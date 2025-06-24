// resolutionPopupMenuStyles.ts
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'

interface StyleProps {
  left: number
  top: number
}

const useStyles = makeStyles<Theme, StyleProps>({
  virtualAnchor: {
    position: 'absolute',
    left: ({ left }) => left,
    top: ({ top }) => top,
    width: 0,
    height: 0,
    zIndex: -1, // שלא ייראה
  },
})

export default useStyles
