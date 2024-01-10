import { NextResponse } from "next/server";

export default function Unauthorized(error) {
    return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 })
}