import axios from "axios";

//client to server
export default (api, router) => async (props) => {
    console.log("Before:", props);

    try {
        let res = await axios({
            url: api,
            method: 'POST',
            data: props
        });
        console.log("After:", res.status, res.data);
        return res.data;
    } catch (err) {
        console.log("Error:", err?.response || 'no response');
        if (err.response.status === 401) {
            router?.push("/signin");
            return err.response.data;
        }
        return err.response.data;
    }
};
