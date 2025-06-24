import React, { useEffect, useRef, useState } from 'react'
import { Menu, MenuItem } from '@mui/material'
import { Position } from '../../../interfaces/interfaces'
import useStyles from './resolutionPopupMenuStyles'

interface Props {
  position: Position
  onSelect: (resolution: string) => void
}

const resolutions = ['resolution 1', 'resolution 2', 'resolution 3', 'resolution 4']

const ResolutionPopupMenu: React.FC<Props> = ({ position, onSelect }) => {
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)

  const classes = useStyles({ left: position.left, top: position.top })

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
    <>
      <div ref={anchorRef} className={classes.virtualAnchor} />
      <Menu
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
      >
        {resolutions.map((res) => (
          <MenuItem key={res} onClick={() => handleSelect(res)}>
            {res}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default ResolutionPopupMenu
