import { api, headersSkIndicator, imageUploadWsKey, makedirKey, makedirOption, productImagePath, server, uploadImageKey, ws, wsKey } from "../../../../../config.js";
import fs from 'fs';
import path from 'path';
import BadRequest from '@/utils/api/response/badRequest.js';
import Response from '@/utils/api/response/response.js';
import { dataFn, useAPI } from '@/utils/crud/useAPI.js';
import InternalError from "@/utils/api/response/internalError.js";

function directoryExists(path) {
    return fs.existsSync(path);
}

function deleteFilesExcept(folderPath, filenamesToKeep) {
    return new Promise((resolve, reject) => {
        fs.readdir(folderPath, (err, files) => {
            if (err) reject(err);

            const deletePromises = files
                .filter(file => !filenamesToKeep.includes(file))
                .map(file => fs.promises.unlink(path.join(folderPath, file)));

            Promise.all(deletePromises)
                .then(() => resolve())
                .catch(reject);
        });
    });
}

async function manageDirectory(option, directoryName, newDirectoryName, directoryPath) {
    return (await (await fetch(`${server}/api/makedir?` + new URLSearchParams({
        option: option,
        folderName: directoryName,
        path: directoryPath,
        ...(newDirectoryName && {newName: newDirectoryName})
    }), {
        headers: { [headersSkIndicator]: makedirKey }
    })).json())
}

async function createDirectory(directoryName, directoryPath) {
    return await manageDirectory(makedirOption.create, directoryName, null, directoryPath)
}

async function removeDirectory(directoryName, directoryPath) {
    return await manageDirectory(makedirOption.remove, directoryName, null, directoryPath)
}

async function renameDirectory(directoryName, newDirectoryName, directoryPath) {
    return await manageDirectory(makedirOption.rename, directoryName, newDirectoryName, directoryPath)
}

export async function POST(req) {
    try {
        const { form, socket } = await req.json()
        if (!form) {
            return BadRequest("form is undefined")
        }
        const images = form.images
        let requireNewFolder = false
        let directoryName = form.id || ""

        if (images?.length > 0) {
            let productDirectory = path.join(process.cwd(), productImagePath, directoryName)
            console.log(productDirectory)

            requireNewFolder = !form.id || !directoryExists(productDirectory)
            let savedImages = []
            let unsavedImages = images

            if (requireNewFolder) {
                directoryName = (await createDirectory(directoryName, productImagePath, makedirKey)).name
                console.log("new directory created", directoryName)
            } else {
                savedImages = images.filter(img => img.id);
                unsavedImages = images.filter(img => !img.id);
                await deleteFilesExcept(productDirectory, savedImages)
                console.log("unwanted images deleted")
            }

            await Promise.all(unsavedImages.map(async (img, index) => {
                form.images[index] = await uploadImage(img, directoryName, socket)
            }))
            console.log("images uploaded", form.images)
        }
        let productApi = dataFn(api + '/' + "product" + '/')
        let response = await productApi({
            option: "add",
            method: "POST",
            simple: true,
            body: form
        })
        console.log("response from product api", response.id)
        if (requireNewFolder) {
            if (response.id) {
                let res = await renameDirectory(directoryName, response.id, productImagePath, makedirKey)
                console.log("rename file to", res.name)
            } else {
                console.log("api call failed, removing directory")
                let res = await removeDirectory(directoryName, productImagePath, makedirKey)
                console.log(res)
            }

        }
        return Response(response)
    } catch (error) {
        console.log(error)
        return InternalError(error)
    }
};

async function uploadImage(img, directoryName, socket) {
    let body = {
        socket: socket,
        key: imageUploadWsKey.start,
        value: {
            name: img.name
        }
    }
    await fetch(`${ws}`, {
        method: "POST",
        headers: { [headersSkIndicator]: wsKey },
        body: JSON.stringify(body)
    })
    body = {
        image: img.data,
        filename: img.name,
        directory: directoryName,
        path: productImagePath
    }
    const uploadResponse = await fetch(`${server}/api/image/upload`, {
        method: 'POST',
        headers: { [headersSkIndicator]: uploadImageKey },
        body: JSON.stringify(body),
    });

    const uploadData = await uploadResponse.json();

    body = {
        socket: socket,
        key: imageUploadWsKey.end,
        value: {
            name: img.name
        }
    }
    await fetch(`${ws}`, {
        method: "POST",
        headers: { [headersSkIndicator]: wsKey },
        body: JSON.stringify(body)
    })

    return uploadData
}
