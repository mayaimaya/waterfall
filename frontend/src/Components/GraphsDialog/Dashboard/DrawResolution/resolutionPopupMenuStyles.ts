import { makeStyles } from '@mui/styles'

interface positionProps {
    left: number;
    top: number;
}
interface StylesProps {
    position: positionProps;        
}

const useStyles = makeStyles<{}, StylesProps>({
    popupMenu: (props) => ({
        position: 'absolute',
        left: props.position.left,
        top: props.position.top,
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: 4,
        padding: 8,
        boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
        zIndex: 1000,
    }),
    menuItem: {
        padding: 4,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        '&:hover': {
            backgroundColor: '#eee',
        },
    },
});

export default useStyles
