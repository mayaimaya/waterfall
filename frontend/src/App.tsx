import { ThemeProvider } from '@mui/styles'
import Dashboard from './Components/Heatmap/Dashboard/dashboard'
import theme from './style/theme'
import { CssBaseline } from '@mui/material'

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  )
}

export default App
