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

  const handleSelect = (event: React.MouseEvent<HTMLLIElement>) => {
    const res = event.currentTarget.dataset.resolution
    if (res) {
      onSelect(res)
      handleClose()
    }
  }

  return (
    <Menu
      anchorReference='anchorPosition'
      anchorPosition={{ top: position.top, left: position.left + 10 }}
      open={open}
      onClose={handleClose}
    >
      {resolutions.map((res) => (
        <MenuItem key={res} data-resolution={res} onClick={handleSelect}>
          {res}
        </MenuItem>
      ))}
    </Menu>
  )
}

export default ResolutionPopupMenu
