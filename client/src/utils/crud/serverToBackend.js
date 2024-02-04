import { api } from "@/config";
import axios from "axios";

//server to backend
export default async (reqBody, tableName) => {
    const { option, method, headers, body, simple, urlParam } = reqBody;
    const url = api + "/" + tableName + '/' + option + (simple ? "/simple" : "") + (urlParam ? "?" + urlParam : "");

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
    };
    console.log("Before", url);
    let res = await axios(reqParam);
    console.log("after", url, res.status);
    return res;
};
