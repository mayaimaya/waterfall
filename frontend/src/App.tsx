import { ThemeProvider } from '@mui/styles'
import theme from './style/theme'
import { CssBaseline } from '@mui/material'
import MainPage from './Components/mainPage/mainPage'


const App = () => {
 
  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainPage />
    </ThemeProvider>
  )
}

export default App
