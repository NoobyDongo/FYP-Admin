export const dataFn = (api) => async ({ option, method, headers, body, simple }) => {
    let reqParam = {
        method: method || 'GET',
        headers: {
            ...headers,
            "Content-Type": "application/json"
        },
        ...(body && {
            body: JSON.stringify(body || {})
        })
    }
    //console.log("Before", reqParam)
    let res = await fetch(api + option + (simple ? "/simple" : ""), reqParam)

    let t;
    if (res.headers.get('Content-Type').includes('application/json')) {
        t = await res.json();
    } else {
        t = await res.text();
    }
    console.log("after", api, t)
    return t
}

export function useAPI(path, service) {
    return dataFn(path + '/' + service + '/')
}

export function useAPIs(path, services) {
    let dataFns = []
    services.forEach((service) => {
        let api = path + '/' + service.name + '/'
        dataFns.push({ fn: () => dataFn(api)(service.param), name: service.name })
    })
    return dataFns
}