import React, {useContext, useState} from 'react';
import {ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {BottomSheet, Button, Image, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import * as authService from '../../services/auth';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as commonFunc from '../../utils/commonFunc';
import Loading from '../../components/loading';

import * as Constants from '../../utils/constants';
import {loginUser, useAuthDispatch} from '../../context';
import {StorageStrings} from "../../utils/constants";

const LoginBase = ({navigation}) => {

    const dispatch = useAuthDispatch()

    const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
    const [registerVisible, setRegisterVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const forgotPasswordOnPress = () => {
        setForgotPasswordVisible(!forgotPasswordVisible)
    }

    const registerOnPress = () => {
        setRegisterVisible(!registerVisible)
    }

    const loginOnPress = async () => {
        // do login logic
        // let response = await loginUser(dispatch, {email, password});
        // if (!response.user) return
        setLoading(!loading);
    }

    const loginHandler = async () => {
        const data = {
            username: email,
            password: password
        }
        await authService.loginUser(qs.stringify(data))
            .then(response => {
                if (response.token) {
                    AsyncStorage.setItem(StorageStrings.ACCESS_TOKEN, response.token);
                    AsyncStorage.setItem(StorageStrings.FACTORYID, response.factoryId);

                }
                if (!response.success) {
                    commonFunc.notifyMessage(response.message, 0);
                }
            })
            .catch(error => {
                commonFunc.notifyMessage(error.message, 0);
            })
        setLoading(!loading);
    }

    return (
        <View>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View style={styles.container}>
                    <Image
                        source={require('../../resources/images/logo.jpg')}
                        style={styles.logo}
                        PlaceholderContent={<ActivityIndicator/>}/>
                    <Text style={styles.title}>Welcome to {Constants.APP_NAME}</Text>
                    <Input
                        placeholder="Username"
                        placeholderTextColor={Constants.COLORS.PLACEHOLDER_ASH}
                        containerStyle={styles.inputContainerStyle}
                        inputContainerStyle={{borderBottomWidth: 0}}
                        leftIcon={
                            <Icon
                                name='user'
                                size={24}
                                color={Constants.COLORS.PLACEHOLDER_ASH}
                            />
                        }
                        onChangeText={value => setEmail(value)}
                    />
                    <Input
                        placeholder="Password"
                        secureTextEntry={true}
                        placeholderTextColor={Constants.COLORS.PLACEHOLDER_ASH}
                        containerStyle={styles.inputContainerStyle}
                        inputContainerStyle={{borderBottomWidth: 0}}
                        leftIcon={
                            <Icon
                                name='lock'
                                size={24}
                                color={Constants.COLORS.PLACEHOLDER_ASH}
                            />
                        }
                        onChangeText={value => setPassword(value)}
                    />
                    <Text
                        onPress={forgotPasswordOnPress}
                        style={styles.forgotPassword}>
                        Forgot Password?
                    </Text>
                    <Button
                        title="Login"
                        onPress={loginOnPress}
                        containerStyle={styles.buttonContainerStyle}
                        buttonStyle={styles.buttonStyle}
                        titleStyle={styles.buttonTitleStyle}
                    />
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Don't have an account?</Text>
                        <Text
                            onPress={registerOnPress}
                            style={styles.registerLisk}>
                            Register now
                        </Text>
                    </View>
                </View>
                <BottomSheet
                    isVisible={forgotPasswordVisible}
                    containerStyle={{backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'}}>
                    <View style={styles.bottomSheetContainer}>
                        <Text style={styles.bottomSheetTitle}>Forget Password!</Text>
                        <Text style={styles.bottomSheetText}>Please contact our agent through {Constants.AGENT_CONTACT} to
                            reset your password</Text>
                        <Button
                            title="Close"
                            onPress={forgotPasswordOnPress}
                            containerStyle={styles.bottomSheetCloseButtonContainerStyle}
                            buttonStyle={styles.bottomSheetCloseButtonStyle}
                            titleStyle={styles.bottomSheetCloseButtonTitleStyle}
                        />
                    </View>
                </BottomSheet>
                <BottomSheet
                    isVisible={registerVisible}
                    containerStyle={{backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'}}>
                    <View style={styles.bottomSheetContainer}>
                        <Text style={styles.bottomSheetTitle}>Join with us!</Text>
                        <Text style={styles.bottomSheetText}>Please contact our agent through {Constants.AGENT_CONTACT} to
                            register</Text>
                        <Button
                            title="Close"
                            onPress={registerOnPress}
                            containerStyle={styles.bottomSheetCloseButtonContainerStyle}
                            buttonStyle={styles.bottomSheetCloseButtonStyle}
                            titleStyle={styles.bottomSheetCloseButtonTitleStyle}
                        />
                    </View>
                </BottomSheet>
            </ScrollView>
            <Loading isVisible={loading}/>
        </View>

    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Constants.COLORS.BACKGROUND_ASH
    },
    logo: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width,
        alignSelf: 'center'
    },
    title: {
        marginTop: 20,
        marginHorizontal: 20,
        color: Constants.COLORS.BLACK,
        fontSize: 28,
        fontWeight: "bold",
        textAlign: 'left',
        alignSelf: 'stretch'
    },
    inputContainerStyle: {
        marginTop: 10,
        backgroundColor: Constants.COLORS.WHITE,
        width: '90%',
        height: 50,
        borderRadius: 10,
    },
    forgotPassword: {
        fontSize: 14,
        color: Constants.COLORS.PRIMARY_COLOR,
        textAlign: 'right',
        alignSelf: 'stretch',
        marginHorizontal: 20,
        marginTop: 5,
        fontWeight: "bold",
    },
    buttonContainerStyle: {
        marginTop: 50,
        borderRadius: 10,
        width: '90%',
        height: 50,
    },
    buttonStyle: {
        height: 50,
        backgroundColor: Constants.COLORS.PRIMARY_COLOR
    },
    buttonTitleStyle: {
        fontSize: 20,
    },
    registerContainer: {
        flexDirection: 'row',
        marginBottom: 50,
    },
    registerText: {
        fontSize: 14,
        color: Constants.COLORS.BLACK,
        marginTop: 5,
    },
    registerLisk: {
        fontSize: 14,
        color: Constants.COLORS.PRIMARY_COLOR,
        marginLeft: 5,
        marginTop: 5,
        fontWeight: "bold",
    },
    bottomSheetContainer: {
        backgroundColor: Constants.COLORS.WHITE,
        paddingVertical: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomSheetTitle: {
        fontSize: 20,
        color: Constants.COLORS.PRIMARY_COLOR,
        marginLeft: 5,
        marginTop: 5,
        fontWeight: "bold",
    },
    bottomSheetText: {
        fontSize: 16,
        color: Constants.COLORS.BLACK,
        marginLeft: 5,
        marginTop: 5,
        textAlign: 'center'
    },
    bottomSheetCloseButtonContainerStyle: {
        marginTop: 20,
        borderRadius: 10,
        width: '50%',
        height: 40,
    },
    bottomSheetCloseButtonStyle: {
        height: 40,
        backgroundColor: Constants.COLORS.WHITE,
        borderColor: Constants.COLORS.RED,
        borderWidth: 1,
        borderRadius: 10,
    },
    bottomSheetCloseButtonTitleStyle: {
        fontSize: 16,
        color: Constants.COLORS.RED,
    },
});

export default LoginBase;
