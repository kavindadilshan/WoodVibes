import 'react-native-gesture-handler';
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigator/appNavigator';
import { AuthProvider } from "./src/context";


const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator/>
      </AuthProvider>
    </SafeAreaProvider>  
  );
}

export default App;