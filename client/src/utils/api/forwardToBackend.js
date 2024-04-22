import toApi from "../crud/serverToBackend";
import BadRequest from "./response/badRequest";
import Response from "./response/response";

export default async (body, tableName) => {
    let res, errorStatus = -100, errorCode
    try {
        res = await toApi(body, tableName);
    } catch (err) {
        errorStatus = err.errors?.[0]?.errno
        errorCode = err.code
        console.error({
            code: err.code,
            status: res?.status,
            error_status: errorStatus,
            config: {
                url: err.config.url,
                method: err.config.method,
                data: err.config.data
            },
        })
    }

    if (res?.status === 200)
        return Response(res.data)
    else if (errorCode === 'ERR_BAD_RESPONSE')
        return BadRequest("Backend server error")
    else if (res?.status === undefined)
        return BadRequest("Backend server cannot be reached", undefined)
    else
        return BadRequest("Error occured", errorStatus)
}