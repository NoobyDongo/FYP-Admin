import { NextResponse } from "next/server";

export default function Response(message) {
    return NextResponse.json(message, { status: 200 })
}