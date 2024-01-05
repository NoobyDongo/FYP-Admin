import { useEffect, useState } from "react";

//https://stackoverflow.com/a/57203332 from T.J. Crowder
export function useFetchJSON(url, init, deps) {
    // Allow the user to leave off `init` even if they include `deps`
    if (typeof deps == "undefined" && Array.isArray(init)) {
        deps = init;
        init = undefined;
    }
    if (!deps) {
        console.warn(
            "Using `useFetchJSON` with no dependencies array means you'll " +
                "re-fetch on EVERY render. You probably want an empty dependency " +
                "array instead."
        );
    }
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(undefined);
    const [error, setError] = useState(undefined);
    

    useEffect(() => {
        setLoading(true);
        setData(undefined);
        setError(undefined);
        fetch(url, init)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                return response.json();
            })
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, deps);

    return [loading, data, error];
}