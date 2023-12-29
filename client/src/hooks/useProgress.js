'use client'
import { useEffect, useState } from "react"

const startEvent = new CustomEvent("makingProgress", {detail: true})
const stopEvent = new CustomEvent("makingProgress", {detail: false})

export function useProgressListener(){
    const [loading, setLoading] = useState(false)

    const onMakingProgress = (e) => {
        console.log("making progress..................", e.detail)
        setLoading(e.detail)
    }
    useEffect(() => {
        window.addEventListener("makingProgress", onMakingProgress)
        return () => {
            window.removeEventListener("makingProgress", onMakingProgress)
        }
    }, [])

    return {loading}
}

export function useProgress(){
    
    const start = () => window.dispatchEvent(startEvent);
    const stop = () => window.dispatchEvent(stopEvent);
    return {start, stop}
}