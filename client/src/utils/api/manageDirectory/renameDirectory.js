import { dirOption } from "../../../config.js";
import manageDirectory from "./manageDirectory.js";

export default async function renameDirectory(directoryName, newDirectoryName, directoryPath) {
    return await manageDirectory(dirOption.rename, directoryName, newDirectoryName, directoryPath);
}
