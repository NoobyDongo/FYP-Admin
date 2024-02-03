import { NextResponse } from "next/server";

export default function BadRequest(message) {
    return NextResponse.json({ error:message? message : "Bad Request"}, { status: 400 })
}