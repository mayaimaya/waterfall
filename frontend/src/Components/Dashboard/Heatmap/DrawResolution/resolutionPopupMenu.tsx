import React from 'react'
import useStyles from './resolutionPopupMenuStyles';
import { Position } from '../../../interfaces/interfaces';

interface Props {
  position: Position
  onSelect: (resolution: string) => void
}

const resolutions = ['resolution 1', 'resolution 2', 'resolution 3', 'resolution 4']

const ResolutionPopupMenu: React.FC<Props> = ({ position, onSelect }) => {
    const classes = useStyles({position})
  return (
    <div
      className={classes.popupMenu}
    >
      {resolutions.map((res) => (
        <div
          key={res}
          onClick={() => onSelect(res)}
          className={classes.menuItem}
          
        >
          {res}
        </div>
      ))}
    </div>
  )
}

export default ResolutionPopupMenu
