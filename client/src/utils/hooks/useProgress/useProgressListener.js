'use client';
import { useEffect, useState } from "react";

export default function useProgressListener(id = "", fn) {
    const [loading, setLoading] = useState(false);

    const onMakingProgress = (e) => {
        console.log("making progress..................",id, e.detail.status);
        setLoading(e.detail.status);
    };
    useEffect(() => {
        window.addEventListener("makingProgress" + id, fn || onMakingProgress);
        return () => {
            window.removeEventListener("makingProgress" + id, fn || onMakingProgress);
        };
    }, []);

    return { loading };
}
