// App.tsx
import React, { useState } from 'react'
import NoamGraph from './Components/Noam/noamGraph'
import { generateSnapshotData } from './Components/utils/mockData'

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


