import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  menuContainer: {
    width: '25%',
    padding: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end',
    gap: '10px',
  },
  textLocation: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
  },
  radioGroup: {
    alignSelf: 'end',
    direction: 'rtl',
  },
  radioItem: {
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px'
  },
  locationHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end'
  },
  locationIcon: {
    width: '50px',
    height: '50px',
  },
  locationName: {
    fontSize: '16px',
    fontWeight: 600
  },
  divider: {
    width: '100%',
    // to do
    // borderColor: 
  }
}));

export default useStyles;