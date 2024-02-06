'use client'
import React from "react"

export default function useProgressListener(id = "", fn) {
    const [loading, setLoading] = React.useState(false)

    const onMakingProgress = (e) => {
        console.log("making progress..................",id, e.detail.status)
        setLoading(e.detail.status)
    }
    React.useEffect(() => {
        window.addEventListener("makingProgress" + id, fn || onMakingProgress)
        return () => {
            window.removeEventListener("makingProgress" + id, fn || onMakingProgress)
        }
    }, [])

    return { loading }
}
