'use client';
import React from "react";
import startEvent from "./startEvent";
import stopEvent from "./stopEvent";

export default function useProgress(id = "", minTime = 0) {
    const startAsync = React.useCallback(async (func, sid) => {
        start(sid);
        let result
        if (minTime > 0) {
            let startTime = Date.now();
            result = await func();
            let elapsedTime = Date.now() - startTime;
            if (elapsedTime < minTime) {
                await new Promise((resolve) => setTimeout(resolve, minTime - elapsedTime));
            }
        }else{
            result = await func();
        }
        stop(sid);
        return result;
    }, []);
    const start = (sid = id, detail) => window.dispatchEvent(startEvent(sid, detail));
    const stop = (sid = id, detail) => window.dispatchEvent(stopEvent(sid, detail));
    return { start, stop, startAsync };
}
