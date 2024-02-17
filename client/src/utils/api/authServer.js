import { skIndicator } from "../../config";
import Unauthorized from "./response/unauthorized";

export default async (req, targetKey, func) => {
  const token = req.headers.get(skIndicator);
  if (!token || token != targetKey) {
    return Unauthorized()
  }
  return await func()
}