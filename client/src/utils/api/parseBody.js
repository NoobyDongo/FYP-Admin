import BadRequest from "./response/badRequest"

export default async (req) => {
    try {
        return { status: true, res: await req.json() }
    }
    catch (err) {
        console.log("Error parsing body:", err)
        return { status: false, res: BadRequest("Empty Request Body") }
    }
}