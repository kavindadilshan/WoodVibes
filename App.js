import 'react-native-gesture-handler';
import * as React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import AppNavigator from './src/navigator/appNavigator';
import {AuthProvider} from "./src/context";
import Toast from 'react-native-toast-message';


const App = () => {
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
