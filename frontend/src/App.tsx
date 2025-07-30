import { useState } from 'react'

import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material'

import MainPage from './Components/mainPage/mainPage'
import { darkTheme, lightTheme } from './style/theme.ts'

const App = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  return (
    <>
      <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
        <CssBaseline />
        <MainPage setMode={setMode} />
      </ThemeProvider>
    </>
  )
}

export default App
