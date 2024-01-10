import { dirOption } from "../../../config.js";
import manageDirectory from "./manageDirectory.js";

export default async function createDirectory(directoryName, directoryPath) {
    return await manageDirectory(dirOption.create, directoryName, null, directoryPath);
}
