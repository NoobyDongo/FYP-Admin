'use client'
import { ThemeProvider, alpha, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { red, orange } from '@mui/material/colors';

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
const sharedComponentsTheme = (theme, sharedPalette) => {

  let darkMode = theme.palette.mode === 'dark'
  let background = theme.palette.background.default
  return ({
    components: {
      MuiDialog: {
        styleOverrides: {
          root: {
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Change the opacity here
              backdropFilter: 'blur(2px) brightness(0.5) saturate(1.2) contrast(1.2)',
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
            backgroundColor: darkMode ? background : sharedPalette.primary.main,
            color: theme.palette.text.primary
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: background,
            color: theme.palette.text.primary
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: sharedPalette.input.label.main,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              transition: 'border-color 0.25s',
              borderColor: sharedPalette.input.border.main,
            },
            '&.Mui-disabled  .MuiOutlinedInput-notchedOutline ': {
              borderColor: sharedPalette.input.border.secondary,
            },
          },
        },
      },
    }
  })
}
const sharedTypographyTheme = {
  typography: {
    "fontFamily": "Inter"
  }
}
const sharedPalette = (shade, defaultTheme) => {

  let darkMode = defaultTheme.palette.mode === 'dark'
  return ({
    primary: {
      main: orange[shade],
    },
    secondary: {
      main: red[500],
    },
    input:{
      border: {
        main: alpha(defaultTheme.palette.text.disabled, 0.1),
        secondary: alpha(defaultTheme.palette.text.disabled, 0)
      },
      label:{
        main: defaultTheme.palette.text.primary
      }
    },
    border: {
      main: alpha(defaultTheme.palette.text.disabled, 0.1)
    },
    logo: {
      main: darkMode? orange[500] : "#FFFFFF",
      secondary:  darkMode? orange[700] : "#FFFFFF",
      contrast: darkMode? "#FFFFFF" : "#000000",
    },
  })
}
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

const darkSharedPalette = { ...sharedPalette(400, defaultDarkTheme) }
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    ...darkSharedPalette,
  },
  ...sharedOverride(),
  ...sharedComponentsTheme(defaultDarkTheme, darkSharedPalette),
  ...sharedTypographyTheme,
});
const lightSharedPalette = { ...sharedPalette(800, defaultLightTheme) }
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...lightSharedPalette
  },
  ...sharedOverride(),
  ...sharedComponentsTheme(defaultLightTheme, lightSharedPalette),
  ...sharedTypographyTheme,
});

export default function Themed({ darkmode, children }) {

  return (
    <ThemeProvider theme={darkmode ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}