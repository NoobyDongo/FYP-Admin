import { api } from "@/config";
import axios from "axios"

export const toApi = async (reqBody, tableName) => {
    const { option, method, headers, body, simple } = reqBody
    const url = api + "/" + tableName + '/' + option + (simple ? "/simple" : "")

    let reqParam = {
        url,
        method: method || 'GET',
        headers: {
            ...headers,
            "Content-Type": "application/json"
        },
        ...(body && {
            data: body || {}
        })
    }

    //console.log("Before", url, body)
    let res = await axios(reqParam)
    //console.log("after", url, res)
    return res
}

export const dataFn = (api) => async ({ option, method, headers, body, simple }) => {
    const url = api + '/' + option + (simple ? "/simple" : "")
    console.log("Before:", url, body)
    let reqParam = {
        url,
        method: method || 'GET',
        headers: {
            ...headers,
            "Content-Type": "application/json"
        },
        ...(body && {
            data: body || {}
        })
    }

    let res = await axios(reqParam)
    console.log("After:", res)
    return res.data
}

export const dataPostFn = (api) => async (props) => {
    console.log("Before:", props)

    let res = await axios.post(api, props)
    console.log("After:", res)
    return res.data
}

export function useAPI(path, service) {
    return dataPostFn(path + '/' + service + '/')
}

export function useAPIs(path, services) {
    let dataFns = []
    services.forEach((service) => {
        let api = path + '/' + service.name + '/'
        dataFns.push({ fn: () => dataPostFn(api)(service.param), name: service.name })
    })
    return dataFns
}