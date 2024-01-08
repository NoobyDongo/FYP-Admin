import { headersSkIndicator, makedirKey, server } from "../../../../../config.js";

export default async function manageDirectory(option, directoryName, newDirectoryName, directoryPath) {
    return (await (await fetch(`${server}/api/makedir?` + new URLSearchParams({
        option: option,
        folderName: directoryName,
        path: directoryPath,
        ...(newDirectoryName && { newName: newDirectoryName })
    }), {
        headers: { [headersSkIndicator]: makedirKey }
    })).json());
}
