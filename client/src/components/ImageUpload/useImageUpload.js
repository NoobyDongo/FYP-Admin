'use client'

import { useEffect } from "react"

export function useImageUpload(id = ""){
    const uploadEvent = new CustomEvent("uploadImage" + id)
    const execute = () => window.dispatchEvent(uploadEvent)
    return execute
}

export function useImageUploadListener(id = "", fn){
    useEffect(() => {
        window.addEventListener("uploadImage" + id, fn || (() => {})) 
        return () => {
            window.removeEventListener("uploadImage" + id, fn || (() => {}))
        }
    }, [])
}