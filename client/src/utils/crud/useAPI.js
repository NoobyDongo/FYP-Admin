import dataFn from "./clientToServer";

export default (path, service, router) => {
    return dataFn(path + '/' + service + '/', router)
}