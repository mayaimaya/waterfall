// Components/mockData.ts

export function generateSnapshotData(rows = 200, cols = 200): number[][] {
  const data: number[][] = []
  for (let r = 0; r < rows; r++) {
    const row: number[] = []
    for (let c = 0; c < cols; c++) {
      // לדוגמה: אות עם רעש אקראי
      // נוכל להכניס כאן כל פונקציית סינוס, גל, או רנדום לפי הצורך
      const baseSignal = Math.sin((c / cols) * Math.PI * 4) * 0.5 + 0.5  // בין 0 ל-1
      const noise = Math.random() * 0.2  // רעש קטן
      row.push(Math.min(1, Math.max(0, baseSignal + noise)))
    }
    data.push(row)
  }
  return data
}
