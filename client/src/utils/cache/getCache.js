export default (CACHE_NAME) => {
    const cache = localStorage.getItem(CACHE_NAME) || '';
    let j;
    if (cache)
        j = JSON.parse(cache);
    return j;
}