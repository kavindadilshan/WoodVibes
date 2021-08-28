import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearLocalStorage = async ()=>{
    await AsyncStorage.clear();
}
