import ApiService from "./apiService";

export async function saveInvoice(body){
    const apiObject = {};
    apiObject.method = 'POST';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/invoice/save`;
    apiObject.multipart = false;
    apiObject.body = body;
    return await ApiService.callApi(apiObject);
}

export async function getAllInvoice(id){
    const apiObject = {};
    apiObject.method = 'GET';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/invoice/${id}`;
    apiObject.multipart = false;
    apiObject.body = null;
    return await ApiService.callApi(apiObject);
}

export async function deleteInvoice(id){
    const apiObject = {};
    apiObject.method = 'DELETE';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/invoice/${id}/delete`;
    apiObject.multipart = false;
    apiObject.body = null;
    return await ApiService.callApi(apiObject);
}
