import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from './theme';
import useDarkMode from './useDarkMode';
import { default as MuiThemeProvider } from '@mui/material/styles/ThemeProvider';
import ThemeContext from './themeContext';


export const ThemeProvider = ({ children }) => {

    //const {darkMode, toggleDarkMode} = useDarkMode();

    return (
        <ThemeContext.Provider value={{ darkMode: false, toggleDarkMode: () => { } }}>
            <MuiThemeProvider theme={false ? darkTheme : lightTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    return React.useContext(ThemeContext);
};