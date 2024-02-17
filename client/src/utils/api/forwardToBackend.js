import toApi from "../crud/serverToBackend";
import BadRequest from "./response/badRequest";
import Response from "./response/response";

export default async(body, tableName) => {
    let res
    try {
        res = await toApi(body, tableName);
    } catch (err) {
        console.error(err)
    }

    if (res?.status === 200)
        return Response(res.data)
    else if (res?.status === 500)
        return BadRequest("Backend server error")
    else
        return BadRequest("Backend server cannot be reached")
}