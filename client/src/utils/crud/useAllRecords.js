'use client'
import { useEffect, useState } from "react";
import { cacheable, getCache as _getCache, clearCache } from "./cacheable";
import { serverPath } from "./resources";

export function useAllRecords(tableName) {
    const api = serverPath + tableName + "/"
    const [data, setData] = useState([])
    const [loaded, setLoaded] = useState(false)

    const getData = async () => {
        let res = await fetch(api + "all", {
            method: 'GET',
            headers: {
            }
        })
        let t = await res.json()
        console.log(api, t)
        return t
    }

    const get = async () => {
        let t = await cacheable(getData, tableName, null)
        setData(t)
        return t
    }

    const getCache = () => {
        let t = _getCache(tableName)
        setData(t)
        return t
    }

    useEffect(() => {
        clearCache(tableName)
        const fetchData = async () => {
            let d = await get()
            console.log(api, d)
            setLoaded(true)
        };

        let d = getCache()
        if(!d){
            fetchData()
            return
        }
        console.log(api, d)
        setLoaded(true)
    }, [])

    return [data, loaded, get, getCache]
}