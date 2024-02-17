'use client'
import link from "@/app/admin/link";
import axios from "axios";

//client to server
export default function clientToServer(api, router) {
    return async (props) => {
        try {
            let res = await axios({
                url: api,
                method: 'POST',
                data: props
            });
            return res.data;
        } catch (err) {
            if (err.response.status === 401) {
                router?.push(link.signin);
                return err.response.data;
            }
            return err.response.data;
        }
    }
}
