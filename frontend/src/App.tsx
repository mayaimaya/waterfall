import { useState } from 'react'
import HeatmapDashboard from './Components/Dashboard/dashboard'
import { DrawingProvider } from './context/drawingContext'
import { ThemeProvider } from '@mui/styles'
import theme from './style/theme'
import { CssBaseline } from '@mui/material'

const App = () => {
  const [enableDraw, setEnableDraw] = useState<boolean>(false)

  const clickDraw = () => {
    setEnableDraw(true) 
  }

  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DrawingProvider enableDraw={enableDraw} setEnableDraw ={setEnableDraw}>
          <button
            style={{width:'100px', height:'100px', backgroundColor:'green'}} 
            onClick={clickDraw}
          >
          צייר
        </button>
        <HeatmapDashboard/>
      </DrawingProvider>
    </ThemeProvider>
  )
}

export default App
