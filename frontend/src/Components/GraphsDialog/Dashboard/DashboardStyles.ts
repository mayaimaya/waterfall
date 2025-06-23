import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  dashboard: {
    width: '100%', 
    height: '100%'
  },
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
}))

export default useStyles

