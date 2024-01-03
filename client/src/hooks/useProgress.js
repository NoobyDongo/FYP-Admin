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

export function useProgress(id = "") {
    const startEvent = new CustomEvent("makingProgress" + id, { detail: true })
    const stopEvent = new CustomEvent("makingProgress" + id, { detail: false })

    const startAsync = async (func) => {
        start();
        const startTime = Date.now();
        const result = await func();
        const elapsedTime = Date.now() - startTime;

        if (elapsedTime < 1000) {
            await new Promise((resolve) => setTimeout(resolve, 1000 - elapsedTime));
        }

        stop();
        return result;
    };
    const start = () => window.dispatchEvent(startEvent);
    const stop = () => window.dispatchEvent(stopEvent);
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
