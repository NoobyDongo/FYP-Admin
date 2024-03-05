import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from './theme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

export default function Themed({ children, darkMode }) {

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}