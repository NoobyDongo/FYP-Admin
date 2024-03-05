'use client'
import axios from "axios";

//client to server
export default function clientToServer(api) {
    return async (props) => {
        try {
            let res = await axios({
                url: api,
                method: 'POST',
                data: props
            });
            return res.data;
        } catch (err) {
            return err.response;
        }
    }
}