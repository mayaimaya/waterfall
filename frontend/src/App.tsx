import { useState } from 'react'
import HeatmapDashboard from './Components/Dashboard/dashboard'
import { DrawingProvider } from './context/drawingContext'
import { ThemeProvider } from '@mui/styles'
import theme from './style/theme'
import { CssBaseline } from '@mui/material'
import { GraphConfig } from './Components/interfaces/interfaces'


const App = () => {
  const [enableDraw, setEnableDraw] = useState<boolean>(false)

  const end = new Date();
  const start = new Date(end.getTime() - 60 * 60 * 1000);
  const [graphConfig, setGraphConfig] = useState<GraphConfig>({startVolume: 1000, endVolume: 2000, locationId: 5, startDate: start.toISOString(), endDate: end.toISOString() })

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
        <HeatmapDashboard graphConfig = {graphConfig} setGraphConfig={setGraphConfig}/>
      </DrawingProvider>
    </ThemeProvider>
  )
}

export default App
