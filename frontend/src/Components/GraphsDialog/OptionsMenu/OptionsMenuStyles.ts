import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  container: {
    width: '25%',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end',
    gap: '15px',
  },
  locationHeader: {
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'end',
  },
  textAlignRight: {
    textAlign: 'right',
  },
  radioGroup: {
    alignItems: 'start',
    direction: 'rtl',
  },
  radioItem: {
    justifyContent: 'flex',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
  },
}));

export default useStyles;
