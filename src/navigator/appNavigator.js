import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IconI from 'react-native-vector-icons/Ionicons';

import LoginScreen from '../screens/login/base';
import HomeScreen from '../screens/home/base';
import CustomersScreen from '../screens/customers/base';
import WoodSetupScreen from '../screens/woodSetup/base';
import ApproveScreen from '../screens/approve/base';
import ProfileScreen from '../screens/profile/base';
import AboutScreen from '../screens/about/base';

import * as Constants from '../utils/constants';
import { useAuthState } from "../context";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppStack = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused
          ? 'ios-home'
          : 'ios-home-outline';
          size = 25;
        } else if (route.name === 'Customers') {
          iconName = focused
          ? 'people-circle'
          : 'people-circle-outline';
          size = 32;
        } else if (route.name === 'Approve') {
          iconName = focused
          ? 'md-shield-checkmark'
          : 'md-shield-checkmark-outline';
          size = 28;
        } else if (route.name === 'WoodSetup') {
          iconName = focused
          ? 'calculator'
          : 'calculator-outline';
          size = 27;
        }
  
        return <IconI name={iconName} size={size} color={color}     />;
      },
    })}
    tabBarOptions={{
      activeTintColor: Constants.COLORS.PRIMARY_BLUE,
      inactiveTintColor: Constants.COLORS.ICON_ASH,
      showLabel: false
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Customers" component={CustomersScreen} />
    <Stack.Screen name="Approve" component={ApproveScreen} />
    <Stack.Screen name="WoodSetup" component={WoodSetupScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {

    const userDetails = useAuthState()
  
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Login'
          screenOptions={{
            headerShown: false
          }}>
          { userDetails.token == "" ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <>
              <Stack.Screen name="AppStack" component={AppStack} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="About" component={AboutScreen} />
            </>
          )}          
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

export default AppNavigator;
