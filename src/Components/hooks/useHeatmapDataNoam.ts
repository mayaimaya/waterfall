// סימולציה של fetch API שמחזיר מטריצת ערכים בין 0 ל-1 ברזולוציה מותאמת לפי המלבן
export const fetchHeatmapData = async (
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  resolutionX: number,
  resolutionY: number,
): Promise<number[][]> => {
  // מחולל נתונים דינמי לדוגמה
  const data: number[][] = []
  for (let i = 0; i < resolutionY; i++) {
    const row: number[] = []
    for (let j = 0; j < resolutionX; j++) {
      // ערך מדומה תלוי במיקום
      const normalizedX = j / resolutionX
      const normalizedY = i / resolutionY
      const value = Math.abs(Math.sin(normalizedX * Math.PI) * Math.cos(normalizedY * Math.PI))
      row.push(value)
    }
    data.push(row)
  }
  // הסמכת זמן טעינה לדוגמה
  await new Promise((resolve) => setTimeout(resolve, 500))
  return data
}
