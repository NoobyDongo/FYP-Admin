'use client';
const startEvent = (id, detail) => new CustomEvent("makingProgress" + id, { detail: {status: true,  ...detail} });
const stopEvent = (id, detail) => new CustomEvent("makingProgress" + id, { detail:  {status: false,  ...detail} });

export const startLoadingEvent = (id, detail) => window.dispatchEvent(startEvent(id, detail));
export const stopLoadingEvent = (id, detail) => window.dispatchEvent(stopEvent(id, detail));

export default function useProgress(id = "") {

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
    const start = (sid = id, detail) => window.dispatchEvent(startEvent(sid, detail));
    const stop = (sid = id, detail) => window.dispatchEvent(stopEvent(sid, detail));
    return { start, stop, startAsync };
}
