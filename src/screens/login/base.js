import React, {useContext, useState} from 'react';
import {ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {BottomSheet, Button, Image, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import * as authService from '../../services/auth';
import * as Validation from '../../utils/validation';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as commonFunc from '../../utils/commonFunc';
import Loading from '../../components/loading';
import TextInput from '../../components/textInput';

import * as Constants from '../../utils/constants';
import {loginUser, useAuthDispatch} from '../../context';
import {StorageStrings} from "../../utils/constants";
import {CommonActions} from "@react-navigation/native";

const LoginBase = ({navigation}) => {

    const dispatch = useAuthDispatch()

    const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
    const [registerVisible, setRegisterVisible] = useState(false);
    const [email, setEmail] = useState({value: '', valid: true});
    const [password, setPassword] = useState({value: '', valid: true});
    const [loading, setLoading] = useState(false);

    const forgotPasswordOnPress = () => {
        setForgotPasswordVisible(!forgotPasswordVisible)
    }

    const registerOnPress = () => {
        setRegisterVisible(!registerVisible)
        // navigation.navigate('Register')
    }

    const loginOnPress = async () => {

        email.valid = Validation.textFieldValidator(email.value.trim(), 1);
        password.valid = Validation.textFieldValidator(password.value.trim(), 1);
        setEmail({value: email.value, valid: email.valid});
        setPassword({value: password.value, valid: password.valid});

        if (email.valid && password.valid) {
            setLoading(!loading);
            await loginHandler();
        }

    }

    const loginHandler = async () => {
        let data = {
            username: email.value,
            password: password.value
        }
        await authService.loginUser(data)
            .then(async response => {
                if (response.token) {
                    await AsyncStorage.setItem(StorageStrings.LOGGED, 'true');
                    await AsyncStorage.setItem(StorageStrings.ACCESS_TOKEN, response.token);
                    await AsyncStorage.setItem(StorageStrings.FACTORYID, response.factoryId.toString());
                    await AsyncStorage.setItem(StorageStrings.ROLE,response.role);
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                {name: 'AppStack'},
                            ],
                        })
                    );
                } else {
                    commonFunc.notifyMessage('Incorrect username or password', 0);
                }
            })
            .catch(error => {
                commonFunc.notifyMessage('You connection was interrupted', 0);
            })
        setLoading(false);
    }

    return (
        <View>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View style={styles.container}>
                    <View style={styles.logo}>
                        <View style={{width:  Dimensions.get('window').width/100*60,height:Dimensions.get('window').width/100*60,marginLeft:'5%'}}>
                            <Image
                                source={require('../../resources/images/logo.png')}
                                style={{width:'100%',height:'100%'}}
                                PlaceholderContent={<ActivityIndicator/>}
                                resizeMode={'contain'}
                            />
                        </View>

                    </View>

                    <Text style={styles.title}>Welcome to {Constants.APP_NAME}</Text>
                    <TextInput
                        placeholder={"Username"}
                        leftIcon={
                            <Icon
                                name='user'
                                size={24}
                                color={Constants.COLORS.PLACEHOLDER_ASH}
                            />
                        }
                        value={email.value}
                        onChangeText={value => setEmail({value: value, valid: true})}
                        errorMessage={!email.valid ? 'Please Enter Username' : null}
                    />
                    <TextInput
                        placeholder={"Password"}
                        secureTextEntry={true}
                        leftIcon={
                            <Icon
                                name='lock'
                                size={24}
                                color={Constants.COLORS.PLACEHOLDER_ASH}
                            />
                        }
                        value={password.value}
                        onChangeText={value => setPassword({value: value, valid: true})}
                        errorMessage={!password.valid ? 'Please Enter Password' : null}
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
                        <Text style={styles.bottomSheetText}>Please contact our agent
                            through {Constants.AGENT_CONTACT} to
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
                        <Text style={styles.bottomSheetText}>Please contact our agent
                            through {Constants.AGENT_CONTACT} to
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
        justifyContent: 'center',
        alignItems:'center'
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
