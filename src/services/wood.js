import ApiService from "./apiService";

export async function getAllWoodType(){
    const apiObject = {};
    apiObject.method = 'GET';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/woodType/list`;
    apiObject.multipart = false;
    apiObject.body = null;
    return await ApiService.callApi(apiObject);
}

export async function addWoodCost(body){
    const apiObject = {};
    apiObject.method = 'POST';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `wood-cost/add`;
    apiObject.multipart = false;
    apiObject.body = body;
    return await ApiService.callApi(apiObject);
}

export async function getAllWoodCost(data){
    const apiObject = {};
    apiObject.method = 'GET';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `/wood-cost/list/${data.factoryId}`;
    apiObject.multipart = false;
    apiObject.body = null;
    return await ApiService.callApi(apiObject);
}

export async function getAllWoodCostById(data){
    const apiObject = {};
    apiObject.method = 'GET';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/wood-cost/${data}`;
    apiObject.multipart = false;
    apiObject.body = null;
    return await ApiService.callApi(apiObject);
}

export async function getAllCustomers(data){
    const apiObject = {};
    apiObject.method = 'GET';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/customer/list/${data}`;
    apiObject.multipart = false;
    apiObject.body = null;
    return await ApiService.callApi(apiObject);
}
