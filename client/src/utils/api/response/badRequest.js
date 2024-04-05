import { NextResponse } from "next/server";

export default function BadRequest(message, status = 400) {
    return NextResponse.json({ error:message? message : "Bad Request"}, { status })
}