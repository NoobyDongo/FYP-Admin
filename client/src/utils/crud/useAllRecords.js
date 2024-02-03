'use client'
import React from "react";
import cacheable from "../cache/cacheable";
import clearCache from "../cache/clearCache";
import _getCache from "../cache/getCache";
import { serverPath } from "./resources";

export default (tableName) => {
    const api = serverPath + tableName + "/"
    const [data, setData] = React.useState([])
    const [loaded, setLoaded] = React.useState(false)

    const getData = async () => {
        let res = await fetch(api + "all", {
            method: 'GET',
            headers: {
            }
        })
        let t = await res.json()
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

    React.useEffect(() => {
        clearCache(tableName)
        const fetchData = async () => {
            let d = await get()
            setLoaded(true)
        };

        let d = getCache()
        if(!d){
            fetchData()
            return
        }
        setLoaded(true)
    }, [])

    return [data, loaded, get, getCache]
}