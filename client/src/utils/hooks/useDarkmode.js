'use client'
import React from "react";

export default function useDarkMode() {
    const [darkmode, setDarkmode] = React.useState(true)
    React.useEffect(() => {
        const changeDarkMode = e => {
            if(localStorage.getItem('darkmode') === null){
                setDarkmode(e.matches)
            }
        }
        setDarkmode(localStorage.getItem('darkmode') === 'true')
        changeDarkMode(window.matchMedia('(prefers-color-scheme: dark)'))
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', changeDarkMode)
        return () => {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', changeDarkMode);
        }
    }, []);

    const toggleDarkMode = (e) => {
        setDarkmode(prev => {
            localStorage.setItem('darkmode', !prev)
            return !prev
        })
    }

    return { toggleDarkMode, darkmode }
}