import ApiService from "./apiService";

export async function addCustomer(body){
    const apiObject = {};
    apiObject.method = 'POST';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/customer/add`;
    apiObject.multipart = false;
    apiObject.body = body;
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
