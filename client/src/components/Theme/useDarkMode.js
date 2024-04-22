'use client'
import React from "react";
import setDarkModeCookie from "./setDarkModeCookie";
import { useCookies } from "next-client-cookies";

export default function useDarkMode() {
    const cookiesDarkMode = useCookies().get('darkMode') === 'true' ? true : false;
    const [darkMode, setDarkMode] = React.useState(cookiesDarkMode);

    React.useEffect(() => {
        setDarkModeCookie(String(darkMode))
    }, [darkMode]);

    const toggleDarkMode = React.useCallback(() => {
        setDarkMode(prev => !prev);
    }, []);
    return { toggleDarkMode, darkMode };
}