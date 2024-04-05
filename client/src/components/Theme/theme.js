'use client'
import { alpha, createTheme, lighten, darken } from '@mui/material/styles';
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
    let background = sharedPalette.background.default
    let formLabelOffset = theme.spacing(1)
    return ({
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        '& ::-webkit-scrollbar': {
                            width: '0.8em',
                            height: '0.8em',
                            background: 'transparent',
                        },
                        '& ::-webkit-scrollbar-corner': {
                            backgroundColor: sharedPalette.scrollBar.secondary,
                        },
                        '& ::-webkit-scrollbar-thumb': {
                            backgroundClip: 'content-box',
                            backgroundColor: sharedPalette.scrollBar.main,
                            borderRadius: 8,
                            border: `3px solid transparent`,
                        },
                        '*': {
                            scrollbarColor: `${sharedPalette.scrollBar.main} ${sharedPalette.scrollBar.secondary}`,
                            scrollBehavior: 'smooth',
                            scrollbarTransition: "smooth",
                            scrollbarWidth: 'thin',
                        },
                    },
                },
            },
            MuiPopover: {
                styleOverrides: {
                    paper: {
                        '& > *': {
                            transform: 'translateX(0) !important', //prevent weird pixel shift
                        },
                    },
                },
            },
            MuiMenu: {
                styleOverrides: {
                    paper: {
                        backgroundColor: background,
                        backgroundImage: "none !important",
                        boxShadow: 'none',
                        border: `1px solid ${sharedPalette.border.main}`,
                    },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        transform: 'translateX(0) !important', //prevent weird pixel shift
                        color: theme.palette.text.primary,
                        backgroundColor: background,
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    root: {
                        '& .MuiBackdrop-root': {
                            backdropFilter: 'blur(.5px) brightness(0.8)',
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
                        color: theme.palette.text.primary,
                        '& > .MuiToolbar-root': {
                            minHeight: 58,
                        },
                    }
                }
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        '&.MuiInputLabel-outlined':{
                            marginTop: formLabelOffset,
                        },
                        color: sharedPalette.input.label.main,
                    },
                },
            },
            MuiFormHelperText: {
                styleOverrides: {
                    root: {
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        zIndex: 10,
                        cursor: 'default',
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        marginTop: formLabelOffset,
                        '& .MuiInput-underline::before': {
                            borderColor: sharedPalette.input.border.main,
                        },
                        '&.Mui-disabled .MuiInput-underline::before': {
                            borderColor: sharedPalette.input.border.secondary,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            zIndex: 10,
                            transition: 'border-color 100ms',
                            borderColor: sharedPalette.input.border.main,
                        },
                        '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderWidth: '1px !important',
                            },
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
        fontSize: 13,
        "fontFamily": "inherit",
    }
}
const sharedPalette = (shade, defaultTheme) => {

    let darkMode = defaultTheme.palette.mode === 'dark'
    let background = darken(defaultTheme.palette.background.default, darkMode ? .10 : .000)
    let paper = darken(defaultTheme.palette.background.paper, darkMode ? .15 : 0)
    let primary = orange[shade]
    let secondary = red[500]
    return ({
        primary: {
            main: primary,
            secondary: darkMode ? darken(primary, .8) : lighten(primary, .8),
        },
        secondary: {
            main: secondary,
        },
        scrollBar: {
            main: darkMode ? lighten(background, .05) : darken(background, .15),
            secondary: background,
        },
        input: {
            border: {
                main: alpha(defaultTheme.palette.text.disabled, 0.1),
                secondary: alpha(defaultTheme.palette.text.disabled, 0)
            },
            label: {
                main: defaultTheme.palette.text.primary
            }
        },
        background: {
            default: background,
            paper: paper,
        },
        border: {
            main: alpha(defaultTheme.palette.text.disabled, 0.1)
        },
        progressbar: {
            main: darkMode ? primary : secondary,
        },
        navbar: {
            backgroundColor: {
                primary: darkMode ? 'transparent' : "#FFFFFF !important",
                secondary: 'transparent',
            },
            text: {
                fontWeight: {
                    primary: 600,
                    secondary: 400
                },
                color: {
                    primary: primary,
                    secondary: darkMode ? defaultTheme.palette.text.primary : "#FFFFFF",
                }
            }
        },
        table: {
            selected: darkMode ? darken(primary, 0.6) : lighten(primary, 0.5),
            selectedhover: darkMode ? darken(primary, 0.55) : lighten(primary, 0.65),
            hover: darkMode ? lighten(background, 0.1) : darken(background, 0.05),
        },
        logo: {
            main: darkMode ? orange[500] : "#FFFFFF",
            secondary: darkMode ? orange[700] : "#FFFFFF",
            contrast: darkMode ? "#FFFFFF" : "#000000",
        },
    })
}
//does not work!!!
const sharedOverride = () => ({
})

const darkSharedPalette = { ...sharedPalette(400, defaultDarkTheme) }
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        ...darkSharedPalette,
    },
    ...sharedOverride(),
    ...sharedComponentsTheme(defaultDarkTheme, darkSharedPalette),
    ...sharedTypographyTheme,
});
const lightSharedPalette = { ...sharedPalette(800, defaultLightTheme) }
export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        ...lightSharedPalette
    },
    ...sharedOverride(),
    ...sharedComponentsTheme(defaultLightTheme, lightSharedPalette),
    ...sharedTypographyTheme,
});