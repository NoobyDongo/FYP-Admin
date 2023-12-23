'use client'
import { ThemeProvider, alpha, createTheme } from '@mui/material/styles';
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
const sharedTypographyTheme = {
  typography: {
    "fontFamily": "Inter"
   }
}
const sharedPalette = (shade, defaultTheme) => ({
  primary: {
    main: blue[shade],
  },
  border: {
    main: alpha(defaultTheme.palette.text.disabled, 0.1)
  }
})
//does not work!!!
const sharedOverride = () => ({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*": {
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "black",
            width: "1rem",
            height: "1rem",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "black",
            minHeight: 24,
            border: "3px solid black",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "black",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
  },
})

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      ...sharedPalette(100, defaultDarkTheme)
    },
    ...sharedOverride(),
    ...sharedDrawerTheme('black', "white"),
    ...sharedTypographyTheme,
});
const lightSharedPalette = {...sharedPalette(500, defaultLightTheme)}
const lightTheme = createTheme({
    palette: {
      mode: 'light',
      ...lightSharedPalette
    },
    ...sharedOverride(),
    ...sharedDrawerTheme(lightSharedPalette.primary.main, "white"),
    ...sharedTypographyTheme,
});
  
export default function Themed({darkmode, children}){

    return(
        <ThemeProvider theme={darkmode? darkTheme : lightTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
    )
}