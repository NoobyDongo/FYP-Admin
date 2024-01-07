import { NextResponse } from "next/server";
import { headersSkIndicator } from "../../../config";

export async function auth(req, targetKey, func){
  const token = req.headers.get(headersSkIndicator);
  console.log("Token", token)
  if (!token || token != targetKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return await func()
}