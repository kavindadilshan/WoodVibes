import ApiService from "./apiService";

export async function getAllOperators(data,body) {
    const apiObject = {};
    apiObject.method = 'GET';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/user/list-operators/${data.factoryId}`;
    apiObject.multipart = false;
    apiObject.body = body;
    apiObject.isRefreshToken = false;
    return await ApiService.callApi(apiObject);
}

export async function addOperator(body){
    const apiObject = {};
    apiObject.method = 'POST';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/user/create-operator`;
    apiObject.multipart = false;
    apiObject.body = body;
    return await ApiService.callApi(apiObject);
}

export async function operatorInvoice(data,body){
    const apiObject = {};
    apiObject.method = 'POST';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/invoice/operator/${data.factoryId}/${data.userId}?size=10&page=${data.page}`;
    apiObject.multipart = false;
    apiObject.body = body;
    return await ApiService.callApi(apiObject);
}
