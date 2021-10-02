import ApiService from "./apiService";

export async function getAllFactories(body){
    const apiObject = {};
    apiObject.method = 'GET';
    apiObject.authentication = false;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `factory/list`;
    apiObject.multipart = false;
    apiObject.body = body;
    return await ApiService.callApi(apiObject);
}
