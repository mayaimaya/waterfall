import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
  dashboardContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },

  dashboard: {
    width: '100%',
    height: '100%',
  },

  overlayContainer: {
    position: 'relative',
  },

  
}))

export default useStyles
