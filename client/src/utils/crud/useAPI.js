import { serverPath } from "./resources";

const dataFn = (api) => async ({ option, method, headers, body, simple }) => {
    console.log("Before", api, {
        method: method || 'GET',
        headers: {
            ...headers
        },
        ...(body && {
            body: JSON.stringify(body || {})
        })

    })
    let res = await fetch(api + option + (simple ? "/simple" : ""), {
        method: method || 'GET',
        headers: {
            ...headers,
            "Content-Type": "application/json"
        },
        ...(body && {
            body: JSON.stringify(body || {})
        })

    })
    let t;
    if (res.headers.get('Content-Type').includes('application/json')) {
        t = await res.json();
    } else {
        t = await res.text();
    }
    console.log(api, t)
    return t
}

function getApi(service) { return serverPath + service + "/" }

export function useAPI(service) {
    let api = getApi(service)
    return dataFn(api)
}

export function useAPIs(services) {
    let dataFns = []
    services.forEach((service) => {
        let api = getApi(service.name)
        dataFns.push({ fn: () => dataFn(api)(service.param), name: service.name })
    })
    return dataFns
}