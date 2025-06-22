import { useState } from 'react'
import { CssBaseline, useColorScheme } from '@mui/material'
import MainPage from './Components/mainPage/mainPage'
import { ThemeProvider } from '@mui/material'
import { darkTheme, lightTheme } from './style/theme.ts'

const App = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  return (
    <>
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <MainPage setMode={setMode}/>
    </ThemeProvider>
    </>
  )
}

export default App
