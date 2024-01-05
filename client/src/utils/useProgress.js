'use client'
import { useEffect, useState } from "react"
import { ButtonGroup, LinearProgress, Slide } from "@mui/material";
import LoadingButton from "@/components/LoadingButton";

export function useProgressListener(id = "", fn) {
    const [loading, setLoading] = useState(false)

    const onMakingProgress = (e) => {
        console.log("making progress..................", e.detail)
        setLoading(e.detail)
    }
    useEffect(() => {
        window.addEventListener("makingProgress" + id, fn || onMakingProgress) 
        return () => {
            window.removeEventListener("makingProgress" + id, fn || onMakingProgress)
        }
    }, [])

    return { loading }
}

export function useRawProgressListener(id = "", start, end) {
    const onMakingProgress = (e) => {
        console.log("making progress..................", e.detail)
        if(e.detail)
            start()
        else
            end()
    }
    useEffect(() => {
        window.addEventListener("makingProgress" + id, onMakingProgress) 
        return () => {
            window.removeEventListener("makingProgress" + id, onMakingProgress)
        }
    }, [])
}

export function useProgress(id = "") {
    const startEvent = (sid = id) => new CustomEvent("makingProgress" + sid, { detail: true })
    const stopEvent = (sid = id) => new CustomEvent("makingProgress" + sid, { detail: false })

    const startAsync = async (func, sid) => {
        start(sid);
        const startTime = Date.now();
        const result = await func();
        const elapsedTime = Date.now() - startTime;

        if (elapsedTime < 1000) {
            await new Promise((resolve) => setTimeout(resolve, 1000 - elapsedTime));
        }

        stop(sid);
        return result;
    };
    const start = (sid) => window.dispatchEvent(startEvent(sid));
    const stop = (sid) => window.dispatchEvent(stopEvent(sid));
    return { start, stop, startAsync }
}


const barHeight = .3

export function ProgressBar({ id }) {
    const { loading } = useProgressListener(id)

    return (
        <>
            <Slide direction="down" in={loading} timeout={250}>
                <LinearProgress sx={{ height: barHeight, position: "absolute", top: 0, width: 1 }} variant="determinate" value={0} />
            </Slide>
            {loading && <LinearProgress sx={{ height: barHeight}}  />}
        </>
    )
}

export function ProgressButton({ id, children, ...others }) {
    const { loading } = useProgressListener(id)
    return (
        <ButtonGroup>
            <LoadingButton
                loading={loading}
                {...others}
            >
                <span>{children}</span>
            </LoadingButton>
        </ButtonGroup>
    )

}
