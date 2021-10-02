import React, {Component} from 'react';
import {StorageStrings} from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Image, View,StyleSheet} from "react-native";
import { CommonActions } from '@react-navigation/native';
import * as Constants from "../../utils/constants";
import AppIcon from '../../resources/images/lineLogo.png'

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
            <View style={styles.container}>
                <View style={styles.appIcon}>
                    <Image source={AppIcon} style={{width:'100%',height:'100%'}} resizeMode={'contain'}/>
                </View>

            </View>
        );
    }
}

export const styles=StyleSheet.create({
    container:{
        backgroundColor: Constants.COLORS.THEME_COLOR,
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    appIcon:{
        width:320,
        height:320,
        alignContent:'center',
        margin: 24
    }
})

export default Base;
