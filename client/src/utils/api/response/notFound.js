import { NextResponse } from "next/server";

export default function NotFound(error) {
    return NextResponse.json({ error: error || "resource not found" }, { status: 404 })
}