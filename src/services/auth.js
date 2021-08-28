import ApiService from './apiService';

export async function loginUser(userCredentials){
    const apiObject={};
    apiObject.method = 'POST';
    apiObject.authentication = false;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = '/authenticate';
    apiObject.body = userCredentials;
    apiObject.state = "login";

    return await ApiService.callApi(apiObject)
}

export async function renewToken(token) {
    const apiObject = {};
    apiObject.method = 'POST';
    apiObject.authentication = false;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = '';
    apiObject.body = token;
    apiObject.state = "renewToken";
    return await ApiService.callApi(apiObject);
}

export async function registerUser(body){
    const apiObject = {};
    apiObject.method = 'POST';
    apiObject.authentication = true;
    apiObject.isBasicAuth = false;
    apiObject.urlencoded = false;
    apiObject.endpoint = `user/add`;
    apiObject.multipart = false;
    apiObject.body = body;
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
    return await ApiService.callApi(apiObject);
}
