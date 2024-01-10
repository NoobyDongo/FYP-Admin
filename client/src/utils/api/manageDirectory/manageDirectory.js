import { skIndicator, dirKey, server } from "../../../config.js";

export default async function manageDirectory(option, directoryName, newDirectoryName, directoryPath) {
    return (await (await fetch(`${server}/api/dir?` + new URLSearchParams({
        option: option,
        folderName: directoryName,
        path: directoryPath,
        ...(newDirectoryName && { newName: newDirectoryName })
    }), {
        headers: { [skIndicator]: dirKey }
    })).json());
}
