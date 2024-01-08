import { makedirOption } from "../../../../../config.js";
import manageDirectory from "./manageDirectory.js";

export default async function createDirectory(directoryName, directoryPath) {
    return await manageDirectory(makedirOption.create, directoryName, null, directoryPath);
}
