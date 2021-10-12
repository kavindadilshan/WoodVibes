import * as actionTypes from '../actions/actionTypes';

export const devicePairHandler = (pairedDevices) => {
    return {
        type: actionTypes.BLE_DEVICES,
        pairedDevices: pairedDevices
    };
};

export const setDeviceConnectStatus = (asDeviceConnect) => {
    return {
        type: actionTypes.DEVICE_AS_CONNECTED,
        asDeviceConnect: asDeviceConnect
    };
};

export const saveConnectedDeviceAddress = (deviceAddress) => {
    return {
        type: actionTypes.CONNECTED_DEVICE_ADDRESS,
        deviceAddress: deviceAddress
    };
};
