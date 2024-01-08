import { api, headersSkIndicator, imageUploadWsKey, makedirKey, productImagePath, server, uploadImageKey, ws, wsKey } from "../../../../../config.js"
import path from 'path'
import BadRequest from '@/utils/api/response/badRequest.js'
import Response from '@/utils/api/response/response.js'
import { dataFn } from '@/utils/crud/useAPI.js'
import InternalError from "@/utils/api/response/internalError.js"
import directoryExists from "./directoryExists.js"
import createDirectory from "./createDirectory.js"
import removeDirectory from "./removeDirectory.js"
import renameDirectory from "./renameDirectory.js"

function deleteFilesExcept(folderPath, filenamesToKeep) {
    return new Promise((resolve, reject) => {
        fs.readdir(folderPath, (err, files) => {
            if (err) reject(err)

            console.log("files", files)
            console.log("filenamesToKeep", filenamesToKeep)
            const deletePromises = files
                .filter(file => !filenamesToKeep.some(f => f.name === file))
                .map(file => fs.promises.unlink(path.join(folderPath, file)))

            Promise.all(deletePromises)
                .then(() => resolve())
                .catch(reject)
        })
    })
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

        let productDirectory = path.join(process.cwd(), productImagePath, directoryName + "")
        console.log(productDirectory)

        requireNewFolder = !form.id || !directoryExists(productDirectory)
        let savedImages = images.filter(img => img.id)

        if (requireNewFolder) {
            directoryName = (await createDirectory(directoryName, productImagePath, makedirKey)).name
            console.log("new directory created", directoryName)
        } else {
            //console.log("unwanted images deleted", savedImages, unsavedImages)
            await deleteFilesExcept(productDirectory, savedImages)
        }

        await Promise.all(images.map(async (img, index) => {
            if (img.data) {
                let image = await uploadImage(img, directoryName, socket)
                console.log("New image uploaded", image)
                form.images[index] = image
            }
        }))
        console.log("images uploaded", form.images)

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
}

export async function DELETE(req) {
    try {
        const { id } = await req.json()
        if (!id) {
            return BadRequest("id is undefined")
        }
        let productApi = dataFn(api + '/' + "product" + '/')
        let response = await productApi({
            option: "remove/" + id,
            method: "DELETE",
            simple: false,
        })
        console.log("response from product api", response)
        if (response === "deleted"){
            if (directoryExists(path.join(process.cwd(), productImagePath, id + ""))) {
                let res = await removeDirectory(id, productImagePath, makedirKey)
                console.log(res)
            }
            return Response({id: id})
        }
        else
            return InternalError({ error: "Failed to delete record" })
    } catch (error) {
        console.log(error)
        return InternalError(error)
    }
}

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
    })

    const uploadData = await uploadResponse.json()

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
