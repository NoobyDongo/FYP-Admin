'use client'
import Fade from '@mui/material/Fade';
import { useEffect, useState } from 'react'

export default function DynamicText({ event, placeholder = "" }) {
    const [text, setText] = useState(placeholder)

    const handleEvent = (e) => {
        setText(e.detail.text)
    }

    useEffect(() => {
        window.addEventListener(event, handleEvent)
        return () => {
            window.removeEventListener(event, handleEvent)
        }
    }, [event])

    return <Fade in={Boolean(text)}>
        <div>{text}</div>
    </Fade>
}
