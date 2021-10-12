import * as actionTypes from "../actions/actionTypes";

const initialState = {
    pairedDevices: [],
    asDeviceConnect: false,
    deviceAddress:''
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.BLE_DEVICES:
            return {
                ...state,
                pairedDevices: action.pairedDevices
            };
        case actionTypes.DEVICE_AS_CONNECTED:
            return {
                ...state,
                asDeviceConnect: action.asDeviceConnect
            };
        case actionTypes.CONNECTED_DEVICE_ADDRESS:
            return {
                ...state,
                deviceAddress: action.deviceAddress
            };
        default:
            return state
    }
}

export default reducer;
