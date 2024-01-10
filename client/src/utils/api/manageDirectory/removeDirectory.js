import { dirOption } from "../../../config.js";
import manageDirectory from "./manageDirectory.js";

export default async function removeDirectory(directoryName, directoryPath) {
    return await manageDirectory(dirOption.remove, directoryName, null, directoryPath);
}
