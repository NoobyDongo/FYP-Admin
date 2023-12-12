'use client'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});
const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
});
  
export default function Themed({darkmode, children}){

    return(
        <ThemeProvider theme={darkmode? darkTheme : lightTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
    )
}