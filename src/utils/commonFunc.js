import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export const clearLocalStorage = async () => {
    await AsyncStorage.clear();
}

export const notifyMessage = (msg1, type, msg2) => {
    let msgType = "info";

    if (type === 2) {
        msgType = "info"
    } else if (type === 0) {
        msgType = "error"
    } else if (type === 1) {
        msgType = "success"
    }

    Toast.show({
        type: msgType,
        position: 'top',
        text1: msg1,
        text2: msg2,
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
    });

}
