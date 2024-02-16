'use client'
import link from "@/app/admin/link";
import useNotification from "@/components/Notifications/useNotification";
import axios from "axios";

//client to server
export default function clientToServer(api, router) {
    return async (props) => {
        //console.log("Before:", props);
        //const { error } = useNotification()
        try {
            let res = await axios({
                url: api,
                method: 'POST',
                data: props
            });
            //console.log("After:", res.status, res.data);
            return res.data;
        } catch (err) {
            //console.log("Error:", err?.response || 'no response');
            if (err.response.status === 401) {
                //error({ error: "Unauthorized" })
                router?.push(link.signin);
                return err.response.data;
            }
            return err.response.data;
        }
    }
}
