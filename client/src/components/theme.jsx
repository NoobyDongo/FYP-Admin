'use client'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { blue, red } from '@mui/material/colors';

const defaultDarkTheme = createTheme({
  palette: {
    mode: 'dark',
  }
});
const defaultLightTheme = createTheme({
  palette: {
    mode: 'light',
  }
});
const sharedDrawerTheme = (background, color) => ({
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: background,
          color: color
        }
      }
    }
  }
})
const sharedPalette = (shade) => ({
  primary: {
    main: blue[shade],
  }
})

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      ...sharedPalette(100)
    },
    ...sharedDrawerTheme('black', "white"),
});
const lightSharedPalette = {...sharedPalette(500)}
const lightTheme = createTheme({
    palette: {
      mode: 'light',
      ...lightSharedPalette
    },
    ...sharedDrawerTheme(lightSharedPalette.primary.main, "white"),
});
  
export default function Themed({darkmode, children}){

    return(
        <ThemeProvider theme={darkmode? darkTheme : lightTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
    )
}