'use client';
import React from "react";
import startEvent from "./startEvent";
import stopEvent from "./stopEvent";

export default function useProgress(id = "") {

    const startAsync = React.useCallback(async (func, sid) => {
        start(sid);
        /*
        const startTime = Date.now();
        const result = await func();
        const elapsedTime = Date.now() - startTime;

        if (elapsedTime < 1000) {
            await new Promise((resolve) => setTimeout(resolve, 1000 - elapsedTime));
        }

        */
        const result = await func();
        stop(sid);
        return result;
    }, []);
    const start = (sid = id, detail) => window.dispatchEvent(startEvent(sid, detail));
    const stop = (sid = id, detail) => window.dispatchEvent(stopEvent(sid, detail));
    return { start, stop, startAsync };
}
