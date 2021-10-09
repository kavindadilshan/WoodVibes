import React, {useContext, useEffect, useState} from 'react';
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
import * as factoryServices from '../../services/factory';
import DropDown from "../../components/dropDown";

const LoginBase = ({navigation}) => {

    const dispatch = useAuthDispatch()

    const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
    const [registerVisible, setRegisterVisible] = useState(false);
    const [email, setEmail] = useState({value: '', valid: true});
    const [password, setPassword] = useState({value: '', valid: true});
    const [loading, setLoading] = useState(false);
    const [factoryList, setFactoryList] = useState([]);
    const [selectedFactoryList, setSelectedFactoryList] = useState([]);
    const [selectedFactoryId, setSelectedFactoryId] = useState('');
    const [dropDownVisible, setDropDownVisible] = useState(true);


    useEffect(async () => {
        const factoryId = await AsyncStorage.getItem(StorageStrings.FACTORYID);
        if (factoryId !== null) {
            setDropDownVisible(false);
            setSelectedFactoryId(factoryId);
        }
        await getAllFactoryList();
    }, [])

    const getAllFactoryList = async () => {
        factoryServices.getAllFactories()
            .then(res => {
                const list = [];
                for (let i = 0; i < Object.keys(res).length - 2; i++) {
                    list.push({
                        id: res[i].factoryId,
                        name: res[i].factoryName
                    })
                }

                console.log(list)
                setFactoryList(list)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const forgotPasswordOnPress = () => {
        setForgotPasswordVisible(!forgotPasswordVisible)
    }

    const registerOnPress = () => {
        setRegisterVisible(!registerVisible)
        // navigation.navigate('Register')
    }

    const loginOnPress = async () => {
        if (selectedFactoryId !== '') {
            await AsyncStorage.setItem(StorageStrings.FACTORYID, selectedFactoryId.toString());
        }
        if (await AsyncStorage.getItem(StorageStrings.FACTORYID) !== null) {
            email.valid = Validation.textFieldValidator(email.value.trim(), 1);
            password.valid = Validation.textFieldValidator(password.value.trim(), 1);
            setEmail({value: email.value, valid: email.valid});
            setPassword({value: password.value, valid: password.valid});

            if (email.valid && password.valid) {
                setLoading(!loading);
                await loginHandler();
            }
        } else {
            commonFunc.notifyMessage('Please select your factory!', 0);
        }


    }

    const loginHandler = async () => {
        let data = {
            username: email.value,
            password: password.value
        }
        await authService.loginUser(data)
            .then(async response => {
                // console.log(JSON.stringify(response))
                if (response.token) {
                    await AsyncStorage.setItem(StorageStrings.LOGGED, 'true');
                    await AsyncStorage.setItem(StorageStrings.ACCESS_TOKEN, response.token);
                    await AsyncStorage.setItem(StorageStrings.FACTORYID, response.factoryId.toString());
                    await AsyncStorage.setItem(StorageStrings.ROLE, response.role);
                    await AsyncStorage.setItem(StorageStrings.USER_ID, response.userId.toString())
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                {name: 'AppStack'},
                            ],
                        })
                    );
                } else {
                    commonFunc.notifyMessage(response.message, response.status);
                }
            })
            .catch(error => {
                commonFunc.notifyMessage('You connection was interrupted', 0);
            })
        setLoading(false);
    }

    return (
        <View>
            <ScrollView contentContainerStyle={{flexGrow: 1}} nestedScrollEnabled={true}
                        keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <View style={styles.logo}>
                        <View style={{
                            width: Dimensions.get('window').width / 100 * 60,
                            height: Dimensions.get('window').width / 100 * 60,
                            marginLeft: '5%'
                        }}>
                            <Image
                                source={require('../../resources/images/logo.png')}
                                style={{width: '100%', height: '100%'}}
                                PlaceholderContent={<ActivityIndicator/>}
                                resizeMode={'contain'}
                            />
                        </View>

                    </View>
                    <Text style={styles.title}>Welcome to {Constants.APP_NAME}</Text>
                    {dropDownVisible && (
                        <View style={styles.dropdownContent}>
                            <Text style={styles.dropdownTile}>Factory</Text>
                            <View style={{width: '70%'}}>
                                <DropDown
                                    onItemSelect={async (item) => {
                                        setSelectedFactoryList(item);
                                        setSelectedFactoryId(item.id);
                                    }}
                                    selectedItems={selectedFactoryList}
                                    onRemoveItem={(item, index) => {
                                        const items = selectedFactoryList.filter((sitem) => sitem.id !== item.id);
                                        setSelectedFactoryList(items)
                                    }}
                                    items={factoryList}
                                    placeholder={"Select Factory"}
                                />
                            </View>

                        </View>
                    )}

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
        alignItems: 'center'
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
    dropdownTile: {
        fontSize: 15,
        color: Constants.COLORS.BLACK,
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
    dropdownContent: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        marginTop: 25
    }
});

export default LoginBase;
