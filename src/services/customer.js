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

export async function getCustomerList(data){
    const apiObject = {};
    apiObject.method = 'POST';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/customer/list/${data}`;
    apiObject.multipart = false;
    apiObject.body = null;
    apiObject.isRefreshToken=false;
    return await ApiService.callApi(apiObject);
}

export async function getAllCustomers(data,body) {
    const apiObject = {};
    apiObject.method = 'POST';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/customer/list/${data.factoryId}?size=10&page=${data.page}`;
    apiObject.multipart = false;
    apiObject.body = body;
    apiObject.isRefreshToken = false;
    return await ApiService.callApi(apiObject);
}
