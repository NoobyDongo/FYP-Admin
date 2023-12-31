'use client'
import { useEffect, useState } from "react"
import { stateTransitionMixin } from "@/style/TransitionMixin";
import { Collapse, LinearProgress, Slide } from "@mui/material";

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

const CustomProgressBar = stateTransitionMixin({
    component: LinearProgress,
    transition: "opacity", 
    onOpen: {opacity: 1},
    onClose: {opacity: 0}
})
const CustomProgressBarBase = stateTransitionMixin({
    component: LinearProgress,
    transition: "opacity", 
    onOpen: {opacity: 1},
    onClose: {opacity: 0}
})

const barHeight = .3

export function ProgressBar(){
    const { loading } = useProgressListener()

    return (
        <>
            <Slide direction="down" in={loading} timeout={230}>
                <LinearProgress sx={{height: barHeight, position: "absolute", top: 0, width: 1}}variant="determinate" value={0} />
            </Slide>
            <CustomProgressBar sx={{height: barHeight}} state={loading} />
        </>
    )
}