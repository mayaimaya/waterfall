// App.tsx
import React, { useState } from 'react'
import { generateSnapshotData } from './Components/mockData'
import { InteractiveRectangleChart } from './Components/heatmapRectangle'
import { StaticHeatmap } from './Components/heatmapAnomalies'
import NoamGraph from './Components/Noam/noamGraph'

 const App = () => {
  const [data, setData] = useState<number[][]>([])

  const loadData = () => {
    const snapshot = generateSnapshotData()
    setData(snapshot)
  }

  return (
    <div>
      <button onClick={loadData}>Load Snapshot</button>
      {/* <InteractiveRectangleChart /> */}
      {data.length > 0 && <NoamGraph data={data} />}

      {/* {data.length > 0 && <StaticHeatmap data={data} />} */}
    </div>
  )
}

export default App


