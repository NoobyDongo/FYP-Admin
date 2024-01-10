export const hostname = process.env.NEXT_PUBLIC_HOSTNAME
export const serverPort = process.env.NEXT_PUBLIC_SERVER_PORT
export const wsPort = process.env.NEXT_PUBLIC_WS_PORT
export const apiPort = process.env.NEXT_PUBLIC_API_PORT
export const authPort = process.env.NEXT_PUBLIC_AUTH_PORT
export const wsKey = process.env.WS_KEY

export const server = `http://${hostname}:${serverPort}`
export const serverApi = `${server}/api`
export const ws = `http://${hostname}:${wsPort}`
export const api = `http://${hostname}:${apiPort}`

export const skIndicator= process.env.SK_INDICATOR

export const imageUploadKey = process.env.IMAGE_UPLOAD_KEY

export const dirKey = process.env.DIR_KEY
export const dirOption = {
    create: process.env.DIR_CREATE,
    remove: process.env.DIR_REMOVE,
    rename: process.env.DIR_RENAME,
}
export const imageUploadPath = process.env.IMAGE_UPLOAD_PATH
export const imageUploadWs = {
    start: process.env.IMAGE_UPLOAD_WS_START,
    end: process.env.IMAGE_UPLOAD_WS_END,
}
export const productImagePath = process.env.PRODUCT_IMAGE_PATH