import * as actionTypes from "../actions/actionTypes";

const initialState = {
    pairedDevices:[]
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.BLE_DEVICES:
            return {
                ...state,
                pairedDevices: action.pairedDevices
            };
        default:
            return state
    }
}

export default reducer;
