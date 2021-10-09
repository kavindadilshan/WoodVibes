import axios from 'axios';
import apiConfig from './apiConfig';
import {StorageStrings} from "../utils/constants";
import * as authService from "./auth";
import * as commonFunc from "../utils/commonFunc";
import qs from "qs";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import * as constants from "../utils/constants";
import {CommonActions} from "@react-navigation/native";


export const callApi = async (apiObject) => {
    let body = {};
    let headers;
    let method = apiObject.method ? apiObject.method.toLowerCase() : 'get';


    if (method === 'post' || method === 'put' || method === 'patch' || method === 'delete') {
        body = apiObject.body ? apiObject.body : {};
    }

    headers = {
        'Content-Type': apiObject.urlencoded ? 'application/x-www-form-urlencoded' : apiObject.multipart ? 'multipart/form-data' : 'application/json',
        'factory': await AsyncStorage.getItem(StorageStrings.FACTORYID)
    };
    if (apiObject.authentication) {
        let access_token = await AsyncStorage.getItem(StorageStrings.ACCESS_TOKEN);
        if (access_token) {
            headers.Authorization = `Bearer ${access_token}`;
        }
    }
    if (apiObject.isBasicAuth) {
        headers.Authorization = 'Basic ' + btoa('' + constants.CLIENT_NAME + ':' + constants.CLIENT_SECRET + '');
    }

    if (apiObject.isRefreshToken) {
        headers.isRefreshToken = true
    }


    const url = `${apiConfig.serverUrl}/${apiConfig.basePath}/${apiObject.endpoint}`;
    let result;

    await axios[method](url, method !== 'get' && method !== 'delete' ? body : {headers: headers}, {headers: headers})
        .then(async response => {
            let code = response.status;
            if (!response.data.success) {
                if (code === 470 || code === 471) {
                    await commonFunc.clearLocalStorage();
                    //navigations
                }
            }

            if (code === 200 || code === 201) {
                result = await {...response.data, success: true, status: 1}
            } else {
                result = await {...response.data, success: false, status: 2}
            }
        })
        .catch(async error => {
            console.log(JSON.stringify(error.response.data))
            if (error !== undefined) {
                if (error.response === undefined) {
                    result = await {
                        success: false,
                        status: 2,
                        message: "Your connection was interrupted",
                        data: null,
                    }
                } else if (error.response.status === 401) {

                    if (apiObject.state === "renewToken") {
                        result = await {success: false, status: 2, message: error.response.data};
                        return;
                    }
                    if (apiObject.state === "login") {
                        result = await {success: false, status: 0, message: error.response.data};
                        return;
                    }
                    result = await renewTokenHandler(apiObject);

                } else if (error.response.status === 403) {
                    result = await {
                        success: false,
                        status: 2,
                        message: "Access is denied.",
                        data: null,
                    };
                } else if (error.response.status === 417) {
                    result = await {
                        success: false,
                        status: 2,
                        message: "Oops! Something went wrong.",
                        data: null,
                    };
                } else if (error.response.status === 400) {
                    result = await {
                        success: false,
                        status: 0,
                        message: error.response.data,
                        data: null
                    }
                } else if (error.response.data !== undefined) {
                    result = await {
                        success: false,
                        status: 0,
                        message: error.response.data,
                        data: null,
                    }
                } else {
                    result = await {
                        success: false,
                        status: 0,
                        message: "Sorry, something went wrong.",
                        data: null,
                    };
                }
            } else {
                result = await {
                    success: false,
                    status: 0,
                    message: "Your connection was interrupted!",
                    data: null,
                };
            }
        });

    return result;

};

const renewTokenHandler = async (apiObject) => {
    let result;
    await authService.renewToken()
        .then(async response => {
            if (response.token) {
                await AsyncStorage.setItem(StorageStrings.ACCESS_TOKEN, response.token);
                result = await callApi(apiObject);
            } else {
                await commonFunc.clearLocalStorage();
                this.props.navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            {name: 'Login'},
                        ],
                    })
                );
            }
        })
        .catch(error => {
            commonFunc.clearLocalStorage();
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        {name: 'Login'},
                    ],
                })
            );
        })

    // renew token - end
    return result;
};

export default {callApi, renewTokenHandler};
