import 'react-native-gesture-handler';
import React,{useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './src/navigator/appNavigator';
import {AuthProvider} from "./src/context";
import Toast from 'react-native-toast-message';



const App = () => {
    useEffect(()=>{
        SplashScreen.hide();
    },[])
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <AppNavigator/>
                <Toast ref={(ref) => Toast.setRef(ref)}/>
            </AuthProvider>
        </SafeAreaProvider>
    );
}

export default App;
