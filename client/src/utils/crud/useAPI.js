import dataFn from "./clientToServer";

export default function useAPI(path, service, router){
    return dataFn(path + '/' + service + '/', router)
}