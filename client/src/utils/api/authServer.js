import { skIndicator } from "../../config";
import Unauthorized from "./response/unauthorized";

export async function authServer(req, targetKey, func){
  const token = req.headers.get(skIndicator);
  console.log("Token", token)
  if (!token || token != targetKey) {
    return Unauthorized()
  }
  return await func()
}