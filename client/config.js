export const {hostname, serverPort, wsPort, apiPort, authServerPort, wsKey} = require('./server.config')

export const server = `http://${hostname}:${serverPort}`
export const serverApi = `${server}/api`
export const ws = `http://${hostname}:${wsPort}`
export const api = `http://${hostname}:${apiPort}`

export const headersSkIndicator="x-secret-key"

export const uploadImageKey = "9daa2a7fffbea7d6e70c55397cd31628"

export const makedirKey = "9cb93ea87ed984dcb9677f7510e99956"
export const makedirOption = {
    create: "create",
    remove: "remove",
    rename: "rename",
}
export const imageUploadPath = "public/image/upload"
export const imageUploadWsKey = {
    start: "startImageUpload",
    end: "endImageUpload"
}
export const productImagePath = "public/image/product"