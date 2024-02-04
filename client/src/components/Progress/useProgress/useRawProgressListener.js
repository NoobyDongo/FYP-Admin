'use client';
import React from "react";

export default function useRawProgressListener(id = "", start, end) {
    const onMakingProgress = (e) => {
        console.log("making progress..................", id, e.detail.status);
        if (e.detail.status)
            start(e);
        else
            end(e);
    };
    React.useEffect(() => {
        window.addEventListener("makingProgress" + id, onMakingProgress);
        return () => {
            window.removeEventListener("makingProgress" + id, onMakingProgress);
        };
    }, []);
}