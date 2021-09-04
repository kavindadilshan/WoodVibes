import React, {Component} from 'react';
import {StorageStrings} from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {View} from "react-native";
import { CommonActions } from '@react-navigation/native';

class Base extends Component {

    async componentDidMount() {
        if (await AsyncStorage.getItem(StorageStrings.LOGGED) === 'true') {
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'AppStack' },
                    ],
                })
            );
        } else {
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'Login' },
                    ],
                })
            );
        }
    }

    render() {
        return (
           <View/>
        );
    }
}

export default Base;
