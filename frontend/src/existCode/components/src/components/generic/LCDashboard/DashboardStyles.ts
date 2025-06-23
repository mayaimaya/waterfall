import { makeStyles } from 'tss-react/mui'
import { GaussTheme } from '@gauss/theme'

interface Props extends GaussTheme{
  columnNumber: number
}

const useStyles = makeStyles<Props>()((_, theme: Props) => ({
  graphs: {
    width: '100vw',
    height: '100%',
    backgroundColor: theme.background,
    direction: 'ltr'
  }
}))

export default useStyles
