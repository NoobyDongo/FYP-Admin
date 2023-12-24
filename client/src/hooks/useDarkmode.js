'use client'
import { useEffect, useState } from "react";

export default function useDarkMode() {
    const [darkmode, setDarkmode] = useState(true)
    useEffect(() => {
        // Add listener to update styles
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => setDarkmode(e.matches));
        setDarkmode(window.matchMedia('(prefers-color-scheme: dark)').matches)
        return () => {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => {
            });
        }
    }, []);

    const toggleDarkMode = (e) => {
        setDarkmode(!darkmode)
    }

    return { toggleDarkMode, darkmode }
}