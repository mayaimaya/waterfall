// App.tsx
import React, { useRef, useState } from 'react'
import HeatmapDashboard from './Components/Heatmap/Dashboard/dashboard'
import { DrawingProvider } from './context/drawingContext'

function App() {
  const [enableDraw, setEnableDraw] = useState<boolean>(false)


  const clickDraw = () => {
    setEnableDraw(true) 
  }

  return (
    <div>
      <DrawingProvider enableDraw={enableDraw} setEnableDraw ={setEnableDraw}>
          <button
            style={{width:'100px', height:'100px', backgroundColor:'green'}} 
            onClick={clickDraw}
          >
          צייר
        </button>
        <HeatmapDashboard/>
      </DrawingProvider>
     
    </div>
  )
}

export default App
