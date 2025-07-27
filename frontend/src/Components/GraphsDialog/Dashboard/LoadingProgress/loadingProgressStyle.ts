import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },

  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(3px)',
    zIndex: -1,
  },

  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'white',
    zIndex: 2100,
  },

  loadingText: {
    marginTop: 16,
    fontSize: '1.2rem',
    fontWeight: 500,
    textAlign: 'center',
  },

  loadingSpinner: {
    color: 'white',
  },
}))

export default useStyles
