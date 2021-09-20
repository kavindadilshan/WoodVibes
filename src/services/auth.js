import ApiService from './apiService';

export async function loginUser(userCredentials){
    const apiObject={};
    apiObject.method = 'POST';
    apiObject.authentication = false;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = 'authenticate';
    apiObject.body = userCredentials;
    apiObject.state = "login";
    apiObject.isRefreshToken=false;
    return await ApiService.callApi(apiObject)
}

export async function renewToken() {
    const apiObject = {};
    apiObject.method = 'GET';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = 'refresh-token';
    apiObject.body = null;
    apiObject.state = "renewToken";
    apiObject.isRefreshToken=true;
    return await ApiService.callApi(apiObject);
}

export async function registerUser(body){
    const apiObject = {};
    apiObject.method = 'POST';
    apiObject.authentication = false;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `user/add`;
    apiObject.multipart = false;
    apiObject.body = body;
    apiObject.isRefreshToken=false;
    return await ApiService.callApi(apiObject);
}

export async function changePassword(body){
    const apiObject = {};
    apiObject.method = 'PUT';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = ``;
    apiObject.multipart = false;
    apiObject.body = body;
    apiObject.isRefreshToken=false;
    return await ApiService.callApi(apiObject);
}
