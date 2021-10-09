import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Appearance} from 'react-native';
import {Button, Card, Divider, Input, Overlay} from 'react-native-elements';
import IconI from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Validation from '../../utils/validation';
import Filter from '../../resources/images/filter.png';
import * as Constants from '../../utils/constants';
import TabHeader from '../../components/tabHeader';
import * as OperatorsService from '../../services/operators';
import * as commonFunc from "../../utils/commonFunc";
import {StorageStrings} from "../../utils/constants";
import * as Constance from "../../utils/constants";
import Loading from "../../components/loading";
import FilterButton from "../../components/filterButton";
import TextInput from "../../components/textInput";
import Icon from "react-native-vector-icons/Ionicons";
import gif from '../../resources/gif/loading.gif';
import {Picker} from "@react-native-picker/picker";
import AlertMessage from "../../components/AlertMessage";

let asDarkMode = Appearance.getColorScheme() === 'dark'

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 0;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

const OperatorBase = ({navigation}) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [idType, setIdType] = useState('1');
    const [idNumber, setIdNumber] = useState('');
    const [customerList, setCustomerList] = useState([]);
    const [page, setPage] = useState(0);
    const [searchKey, setSearchKey] = useState('');
    const [miniLoader, setMiniLoader] = useState(false);
    const [searchOverlay, setSearchOverlay] = useState(false);
    const [searchType, setSearchType] = useState('');
    const [finished, setFinished] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [selectedOperatorId, setSelectedOperatorId] = useState();

    useEffect(async () => {
        navigation.addListener('focus', async () => {
            setLoading(true);
            setPage(0);
            setFinished(false);
            setCustomerList([])
            await getAllOperatorList(0, [], true);
        });
    }, [navigation])

    async function getAllOperatorList(pageNo, isEmpty, first) {
        const data = {
            factoryId: await AsyncStorage.getItem(StorageStrings.FACTORYID),
            page: pageNo
        }
        let body;
        if (searchType === 'name') {
            body = {
                name: searchKey
            }
        } else {
            body = {
                nic: searchKey
            }
        }

        await OperatorsService.getAllOperators(data, first === undefined ? body : null)
            .then(response => {
                let list;
                if (isEmpty) {
                    list = isEmpty
                } else {
                    list = customerList;
                }

                response.users !== null && response.users.map(item => {
                    list.push({
                        id: item.id,
                        name: item.name,
                        username: item.username,
                        email: item.email,
                        mobile: item.mobile,
                        identityNo: item.identityNo,
                    })
                })
                setCustomerList(list);
                if (pageNo + 1 >= response.pageCount) {
                    setFinished(true);
                }
            })
            .catch(error => {
                commonFunc.notifyMessage('You connection was interrupted', 0);
            })
        setLoading(false);
        setMiniLoader(false)
    }

    const toggleOverlay = () => {
        setName('');
        setUsername('');
        setPassword('');
        setIdNumber('');
        setMobile('');
        setVisible(false);
        setSearchOverlay(false);
        setSearchKey('');
        setSearchType('');
    };

    const addOnPress = async () => {
        if (!Validation.textFieldValidator(name.trim(), 1)) {
            commonFunc.notifyMessage('Please Enter Name', 2);
        } else if (!Validation.textFieldValidator(username.trim(), 1)) {
            commonFunc.notifyMessage('Please Enter Username', 2);
        } else if (!Validation.textFieldValidator(password.trim(), 1)) {
            commonFunc.notifyMessage('Please Enter Password', 2);
        } else if (!Validation.nicValidator(idNumber.trim())) {
            commonFunc.notifyMessage('Please Enter Correct NIC', 2);
        } else if (!Validation.mobileNumberValidator(mobile.trim())) {
            commonFunc.notifyMessage('Please Enter Correct Mobile Number', 2);
        } else {
            setVisible(true);
            await operatorAddHandler();
        }

    };

    const operatorAddHandler = async () => {
        const data = {
            name: name,
            username: username,
            email: email,
            password: password,
            mobile: mobile,
            identityType: idType,
            identityNo: idNumber,
            factoryId: await AsyncStorage.getItem(StorageStrings.FACTORYID)
        }
        setLoading(true);
        await OperatorsService.addOperator(data)
            .then(async res => {
                console.log(res)
                setVisible(false);
                if (res.success) {
                    await getAllOperatorList(0, []);
                    commonFunc.notifyMessage("Operator has been successfully created!", 1);
                } else {
                    setLoading(false);
                    commonFunc.notifyMessage('', res.status, res.message);
                }
            })
            .catch(error => {
                setLoading(false);
                commonFunc.notifyMessage('You connection was interrupted', 0);
            })
    }

    const headerRightBtn = (
        <Button
            title="Add New"
            onPress={() => {
                setVisible(true);
                setName('');
                setUsername('');
                setPassword('');
                setIdNumber('');
                setMobile('');
                setSearchKey('');
                setSearchType('');
            }}
            containerStyle={styles.addNewButtonContainerStyle}
            buttonStyle={styles.addNewButtonStyle}
            titleStyle={styles.addNewButtonTitleStyle}
        />
    );

    const searchItem = async () => {
        setSearchOverlay(false);
        setCustomerList([]);
        // setSearchKey('');
        // setSearchType('');
        setPage(0);
        setMiniLoader(true)
        await getAllOperatorList(0, []);
    }

    async function deleteOperatorHandler(item) {
        switch (item) {
            case 'yes':
                setShowAlert(false);
                setLoading(true);
                await OperatorsService.deleteOperator(selectedOperatorId)
                    .then(async res => {
                        if (res.success) {
                            commonFunc.notifyMessage('Invoice delete successfully', 1);
                            setCustomerList([]);
                            await getAllOperatorList(0, []);
                        } else {
                            setLoading(false);
                            commonFunc.notifyMessage('', res.status, res.message);
                        }

                    })
                    .catch(error => {
                        setLoading(false);
                        commonFunc.notifyMessage('You connection was interrupted', 0);
                    })
                break;
            case 'no':
                setShowAlert(false);
                break;
            default:
                break;
        }
    }

    return (
        <View style={styles.container}>
            <TabHeader title="Operators" rightComponent={headerRightBtn}/>
            <ScrollView
                // contentContainerStyle={{paddingBottom: 10}}
                showsVerticalScrollIndicator={false}
                // onScroll={({nativeEvent}) => {
                //     if (isCloseToBottom(nativeEvent)) {
                //         if (!finished) {
                //             setMiniLoader(!miniLoader)
                //             setPage(page + 1);
                //             getAllCustomersList(page + 1);
                //         }
                //     }
                // }}

            >

                {/*<FilterButton onPress={() => setSearchOverlay(true)}/>*/}


                {customerList.map((items, i) => (
                    <Card containerStyle={styles.listCard} key={i}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 5
                        }}>
                            <Card.Title style={styles.listCardTitle}>
                                {items.name}
                            </Card.Title>
                            <Button
                                title="Delete"
                                onPress={() => {
                                    setShowAlert(true);
                                    setSelectedOperatorId(items.id)
                                }}
                                containerStyle={styles.addNewButtonContainerStyle}
                                buttonStyle={{
                                    ...styles.addNewButtonStyle,
                                    backgroundColor: Constants.COLORS.PRIMARY_COLOR
                                }}
                                titleStyle={styles.addNewButtonTitleStyle}
                            />
                        </View>
                        <Card.Divider/>
                        <View style={styles.listCardItem}>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={styles.listCardItemHeader}>Username </Text>
                                <Text style={{fontSize: 10}}> පරිශීලක නාමය </Text>
                            </View>

                            <Text style={styles.listCardItemDesc}>{items.username}</Text>
                        </View>
                        <View style={styles.listCardItem}>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={styles.listCardItemHeader}>Email </Text>
                                <Text style={{fontSize: 10}}> විද්යුත් තැපෑල </Text>
                            </View>

                            <Text style={{...styles.listCardItemDesc, fontSize: 14}}>{items.email}</Text>
                        </View>
                        <View style={styles.listCardItem}>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={styles.listCardItemHeader}>Mobile Number </Text>
                                <Text style={{fontSize: 10}}> දුරකතන අංකය </Text>
                            </View>

                            <Text style={styles.listCardItemDesc}>{items.mobile}</Text>
                        </View>
                        <View style={styles.listCardItem}>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={styles.listCardItemHeader}>Identity Number </Text>
                                <Text style={{fontSize: 10}}> හැදුනුම්පත් අංකය </Text>
                            </View>

                            <Text style={styles.listCardItemDesc}>{items.identityNo}</Text>
                        </View>
                    </Card>
                ))}
                {
                    miniLoader ?
                        <View style={styles.gifHolder}>
                            <Image source={gif} style={styles.gif}/>
                        </View>
                        : null
                }

                {!miniLoader && customerList.length === 0 && (
                    <Text style={{textAlign: 'center', marginTop: '5%'}}>No Results found</Text>)}
            </ScrollView>


            <Overlay
                isVisible={visible}
                overlayStyle={styles.overlay}
                onBackdropPress={toggleOverlay}>
                <Card containerStyle={styles.overlayCard}>
                    <Card.Title style={{fontSize: 17}}>
                        New Operators | නව ක්රියාකරුවන්
                    </Card.Title>
                    <Card.Divider style={{backgroundColor: Constants.COLORS.BLACK}}/>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Name</Text>
                            <Text style={{fontFamily: 'Amalee'}}>නම</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            placeholder="Enter here..."
                            value={name}
                            onChangeText={val => setName(val)}
                        />
                    </View>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Username</Text>
                            <Text style={{fontFamily: 'Amalee'}}>පරිශීලක නාමය</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            placeholder="Enter here..."
                            value={username}
                            onChangeText={val => setUsername(val)}
                        />
                    </View>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Email</Text>
                            <Text style={{fontFamily: 'Amalee'}}>විද්යුත් තැපෑල</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            placeholder="Enter here..."
                            value={email}
                            onChangeText={val => setEmail(val)}
                        />
                    </View>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Password</Text>
                            <Text style={{fontFamily: 'Amalee'}}>රහස් පදය</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            placeholder="Enter here..."
                            value={password}
                            onChangeText={val => setPassword(val)}
                        />
                    </View>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Identity No</Text>
                            <Text style={{fontFamily: 'Amalee'}}>හැදුනුම්පත් අංකය</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            placeholder="Enter here..."
                            value={idNumber}
                            onChangeText={val => setIdNumber(val)}
                        />
                    </View>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Phone Number</Text>
                            <Text style={{fontFamily: 'Amalee'}}>දුරකථන අංකය</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            placeholder="Enter here..."
                            keyboardType="decimal-pad"
                            value={mobile}
                            onChangeText={val => setMobile(val)}
                        />
                    </View>
                    <Button
                        title="Add | එකතු කරන්න"
                        onPress={addOnPress}
                        containerStyle={styles.buttonContainerStyle}
                        buttonStyle={styles.buttonStyle}
                        titleStyle={styles.buttonTitleStyle}
                    />
                </Card>
            </Overlay>


            <Overlay
                isVisible={searchOverlay}
                overlayStyle={styles.overlay}
                onBackdropPress={toggleOverlay}>
                <Card containerStyle={styles.overlayCard}>
                    <Card.Title style={{fontSize: 17}}>
                        Filter | පෙරහන
                    </Card.Title>
                    <Card.Divider style={{backgroundColor: Constants.COLORS.BLACK}}/>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <Picker
                            style={{width: '45%', color: Constants.COLORS.BLACK}}
                            color={'red'}
                            mode='dropdown'
                            selectedValue={searchType}
                            dropdownIconColor={Constants.COLORS.BLACK}
                            onValueChange={(itemValue, itemIndex) => {
                                setSearchType(itemValue)
                            }}>
                            <Picker.Item color={asDarkMode ? 'white' : 'black'} label={'Select Type'} value={''}/>
                            <Picker.Item color={asDarkMode ? 'white' : 'black'} label={'NIC'} value={'nic'}/>
                            <Picker.Item color={asDarkMode ? 'white' : 'black'} label={'Name'} value={'name'}/>
                        </Picker>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            placeholder="Enter here..."
                            value={searchKey}
                            onChangeText={val => setSearchKey(val)}
                        />
                    </View>
                    <Button
                        title="Search | සොයන්න"
                        onPress={searchItem}
                        containerStyle={styles.buttonContainerStyle}
                        buttonStyle={styles.buttonStyle}
                        titleStyle={styles.buttonTitleStyle}
                        disabled={searchType === ''}
                    />
                </Card>
            </Overlay>
            <AlertMessage
                show={showAlert}
                title={"Do you want to delete this record?"}
                onCancelPressed={() => deleteOperatorHandler('yes')}
                onConfirmPressed={() => deleteOperatorHandler('no')}
                cancelText={'Yes'}
                confirmText={'Not Now'}
            />
            <Loading isVisible={loading}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.COLORS.BACKGROUND_ASH,
        paddingBottom: 10
    },
    addNewButtonContainerStyle: {
        height: 40,
    },
    addNewButtonStyle: {
        height: 40,
        paddingHorizontal: 20,
        backgroundColor: Constants.COLORS.PRIMARY_BLUE,
        borderRadius: 10,
        shadowColor: Constance.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
    },
    addNewButtonTitleStyle: {
        fontSize: 16,
    },
    listCard: {
        borderRadius: 10,
        borderWidth: 0,
    },
    listCardTitle: {
        fontSize: 16,
        textAlign: 'left',
        color: Constants.COLORS.PRIMARY_COLOR,
    },
    listCardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        alignItems: 'center'
    },
    listCardItemHeader: {
        fontSize: 16,
    },
    listCardItemDesc: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    overlay: {
        borderRadius: 10,
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
        borderWidth: 0,
        width: '100%'
    },
    overlayCard: {
        borderRadius: 10,
        backgroundColor: Constants.COLORS.BACKGROUND_GREEN,
        borderWidth: 0,
        marginBottom: 15,
    },
    cardItemConatiner: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    inputContainerStyle: {
        backgroundColor: Constants.COLORS.WHITE,
        width: '55%',
        height: 45,
        borderRadius: 10,
    },
    cardTotalConatiner: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: Constants.COLORS.WHITE,
        padding: 10,
        borderRadius: 10,
    },
    buttonContainerStyle: {
        marginTop: 20,
        alignSelf: 'center',
        width: '80%',
        height: 50,
    },
    buttonStyle: {
        height: 50,
        backgroundColor: Constants.COLORS.PRIMARY_COLOR,
        borderRadius: 10,
    },
    buttonTitleStyle: {
        fontSize: 20,
    },
    gifHolder: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gif: {
        width: 75,
        height: 75,
    },
});

export default OperatorBase;

