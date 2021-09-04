import React, { useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StorageStrings} from "../utils/constants";

// let user = localStorage.getItem("currentUser")
//   ? JSON.parse(localStorage.getItem("currentUser")).user
//   : "";
// let token = localStorage.getItem("currentUser")
//   ? JSON.parse(localStorage.getItem("currentUser")).auth_token
//   : "";

let user =  AsyncStorage.getItem(StorageStrings.LOGGED)?AsyncStorage.getItem(StorageStrings.LOGGED):"";
let token =  AsyncStorage.getItem(StorageStrings.ACCESS_TOKEN)?AsyncStorage.getItem(StorageStrings.ACCESS_TOKEN):"";

export const initialState = {
  userDetails: "" || user,
  token: "" || token,
  loading: false,
  errorMessage: null
};

export const AuthReducer = (initialState, action) => {
  switch (action.type) {
    case "REQUEST_LOGIN":
      return {
        ...initialState,
        loading: true
      };
    case "LOGIN_SUCCESS":
      return {
        ...initialState,
        user: action.payload.user,
        token: action.payload.auth_token,
        loading: false
      };
    case "LOGOUT":
      return {
        ...initialState,
        user: "",
        token: ""
      };

    case "LOGIN_ERROR":
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
