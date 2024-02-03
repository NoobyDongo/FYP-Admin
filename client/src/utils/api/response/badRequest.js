import { NextResponse } from "next/server";

export default function BadRequest(message) {
    return NextResponse.json({ error:"Bad Request" + message? `:${message}` : '' }, { status: 400 })
}