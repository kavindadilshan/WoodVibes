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

export async function getAllInvoice(data,body){
    const apiObject = {};
    apiObject.method = 'POST';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/invoice/${data.factoryId}?size=10&page=${data.page}`;
    apiObject.multipart = false;
    apiObject.body = body;
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

export async function getInvoiceById(id){
    const apiObject = {};
    apiObject.method = 'GET';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/invoice/${id}/details`;
    apiObject.multipart = false;
    apiObject.body = null;
    apiObject.isRefreshToken=false;
    return await ApiService.callApi(apiObject);
}

export async function getInvoicePaymentDetails(id){
    const apiObject = {};
    apiObject.method = 'GET';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/invoice/${id}/payments`;
    apiObject.multipart = false;
    apiObject.body = null;
    apiObject.isRefreshToken=false;
    return await ApiService.callApi(apiObject);
}

export async function deletePayRecord(id){
    const apiObject = {};
    apiObject.method = 'DELETE';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/invoice/payment/${id}/delete`;
    apiObject.multipart = false;
    apiObject.body = null;
    apiObject.isRefreshToken=false;
    return await ApiService.callApi(apiObject);
}

export async function invoicePay(id,body){
    const apiObject = {};
    apiObject.method = 'POST';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `api/invoice/${id}/pay`;
    apiObject.multipart = false;
    apiObject.body = body;
    return await ApiService.callApi(apiObject);
}
