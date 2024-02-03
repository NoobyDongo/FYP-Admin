import dataFn from "./clientToServer";

export default (path, services, router) => {
    let dataFns = [];
    services.forEach((service) => {
        let api = path + '/' + service.name + '/';
        dataFns.push({ fn: () => dataFn(api, router)(service.param), name: service.name });
    });
    return dataFns;
}