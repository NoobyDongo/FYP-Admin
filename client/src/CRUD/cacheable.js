export async function cacheable(fn, key, defaultValue) {
    let result;
    try {
        // retrieve the data from backend.
        result = await fn();
        console.log("promise", result)
        // save the data to localStorage.
        localStorage.setItem(key, JSON.stringify(result));
    } catch {
        // if failed to retrieve the data from backend, try localStorage.
        const cached = localStorage.getItem(key);
        // use the cached data if available, otherwise the default value.
        result = cached ? JSON.parse(cached) : defaultValue;
    }

    console.log("result",result)
    return result;
}

export function getCache(CACHE_NAME) {
    const cache = localStorage.getItem(CACHE_NAME) || '';
    return JSON.parse(cache);
}