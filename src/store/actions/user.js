import * as actionTypes from '../actions/actionTypes';

export const devicePairHandler = (pairedDevices) => {
    return {
        type: actionTypes.BLE_DEVICES,
        pairedDevices: pairedDevices
    };
};
