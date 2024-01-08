import { makedirOption } from "../../../../../config.js";
import manageDirectory from "./manageDirectory.js";

export default async function renameDirectory(directoryName, newDirectoryName, directoryPath) {
    return await manageDirectory(makedirOption.rename, directoryName, newDirectoryName, directoryPath);
}
