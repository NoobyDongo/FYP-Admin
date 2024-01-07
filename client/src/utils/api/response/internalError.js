import { NextResponse } from "next/server";

export default function InternalError(error) {
    return NextResponse.json({ error: error.message }, { status: 200 })
}