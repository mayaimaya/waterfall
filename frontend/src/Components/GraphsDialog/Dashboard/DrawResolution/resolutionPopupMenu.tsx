import React, { useEffect, useState } from 'react'
import { Menu, MenuItem } from '@mui/material'
import { Position } from '../../../interfaces/interfaces'

interface Props {
  position: Position
  onSelect: (resolution: string) => void
}

const resolutions = ['resolution 1', 'resolution 2', 'resolution 3', 'resolution 4']

const ResolutionPopupMenu: React.FC<Props> = ({ position, onSelect }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [position])

  const handleClose = () => {
    setOpen(false)
  }

  const handleSelect = (res: string) => {
    onSelect(res)
    handleClose()
  }

  return (
      <Menu
        anchorReference="anchorPosition"
        anchorPosition={{ top: position.top, left: position.left  + 10}}
        open={open}
        onClose={handleClose} >

        {resolutions.map((res) => (
          <MenuItem key={res} onClick={() => handleSelect(res)}>
            {res}
          </MenuItem>
        ))}
      </Menu>
    
  )
}

export default ResolutionPopupMenu
