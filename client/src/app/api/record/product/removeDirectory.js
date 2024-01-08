import { makedirOption } from "../../../../../config.js";
import manageDirectory from "./manageDirectory.js";

export default async function removeDirectory(directoryName, directoryPath) {
    return await manageDirectory(makedirOption.remove, directoryName, null, directoryPath);
}
