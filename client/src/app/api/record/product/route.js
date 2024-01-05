import { Server } from "socket.io";
import { NextResponse } from 'next/server';
import { headersSkIndicator, imageUploadWsKey, makedirKey, makedirOption, productImagePath, server, uploadImageKey, ws, wsKey } from "../../../../utils/config.js";

export async function POST(req) {
    try {
        const { form, images, socket } = await req.json()
        console.log(images)
        if (images.length > 0) {
            let res = (await (await fetch(`${server}/api/makedir?` + new URLSearchParams({
                option: makedirOption.create,
                folderName: "temp",
                path: productImagePath
            }), {
                headers: { [headersSkIndicator]: makedirKey, }
            })).json())
            console.log(res)
            let directoryName = res.name

            
            await Promise.all(images.map(async (img) => {
                let body = {
                    socket: socket,
                    key: imageUploadWsKey.start,
                    value: img.name
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
                console.log('Uploaded image link:', uploadData.link);

                body = {
                    socket: socket,
                    key: imageUploadWsKey.end,
                    value: img.name
                }
                await fetch(`${ws}`, {
                    method: "POST",
                    headers: { [headersSkIndicator]: wsKey },
                    body: JSON.stringify(body)
                })
            }))
        }
        return NextResponse.json({ error: "dwa" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
};