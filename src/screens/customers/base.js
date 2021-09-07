import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button, Card, Divider, Input, Overlay} from 'react-native-elements';
import IconI from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Validation from '../../utils/validation';

import * as Constants from '../../utils/constants';
import TabHeader from '../../components/tabHeader';
import * as customerService from '../../services/customer';
import * as commonFunc from "../../utils/commonFunc";
import {StorageStrings} from "../../utils/constants";
import * as CustomerServices from "../../services/customer";

const CustomerBase = ({navigation}) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [idType, setIdType] = useState('1');
    const [idNumber, setIdNumber] = useState('');
    const [factoryId, setFactoryId] = useState('');
    const [customerList,setCustomerList]=useState([]);

    useEffect(async () => {
        await getAllCustomersList();
    }, [])

    async function getAllCustomersList() {
        const factoryId = await AsyncStorage.getItem(StorageStrings.FACTORYID);
        await CustomerServices.getAllCustomers(factoryId)
            .then(response => {
                setCustomerList(response.customers);
            })
            .catch(error => {
                commonFunc.notifyMessage(error.message, 0);
            })
    }

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const addOnPress = async () => {
        if (!Validation.textFieldValidator(name.trim(),1)){
            commonFunc.notifyMessage('Please Enter Name', 2);
        }else if (!Validation.nicValidator(idNumber.trim())){
            commonFunc.notifyMessage('Please Enter Correct NIC', 2);
        }else if (!Validation.mobileNumberValidator(mobile.trim())){
            commonFunc.notifyMessage('Please Enter Correct Mobile Number', 2);
        }else {
            setVisible(true);
            await customerAddHandler();
        }

    };

    const customerAddHandler = async () => {
        const data = {
            name: name,
            mobile: mobile,
            idType: idType,
            identityNo: idNumber,
            factoryId: await AsyncStorage.getItem(StorageStrings.FACTORYID)
        }
        await customerService.addCustomer(data)
            .then(res => {
                setVisible(false);
                commonFunc.notifyMessage("Customer has been successfully created!", 0);
            })
            .catch(error => {
                commonFunc.notifyMessage(error.message, 0);
            })
    }

    const headerRightBtn = (
        <Button
            title="Add New"
            onPress={toggleOverlay}
            containerStyle={styles.addNewButtonContainerStyle}
            buttonStyle={styles.addNewButtonStyle}
            titleStyle={styles.addNewButtonTitleStyle}
        />
    );

    return (
        <View style={styles.container}>
            <TabHeader title="Customers" rightComponent={headerRightBtn}/>
            <ScrollView contentContainerStyle={{paddingBottom:10}}>
                {customerList.map((items,i)=>(
                    <Card containerStyle={styles.listCard} key={i}>
                        <Card.Title style={styles.listCardTitle}>
                            {items.name}
                        </Card.Title>
                        <Card.Divider/>
                        <View style={styles.listCardItem}>
                            <Text style={styles.listCardItemHeader}>Total Orders</Text>
                            <Text style={styles.listCardItemDesc}>4</Text>
                        </View>
                        <View style={styles.listCardItem}>
                            <Text style={styles.listCardItemHeader}>Last Order</Text>
                            <Text style={styles.listCardItemDesc}>{items.lastOrderDate}</Text>
                        </View>
                    </Card>
                ))}
            </ScrollView>


            <Overlay
                isVisible={visible}
                overlayStyle={styles.overlay}
                onBackdropPress={toggleOverlay}>
                <Card containerStyle={styles.overlayCard}>
                    <Card.Title style={{fontSize: 17}}>
                        New Customer | නව ගණුදෙනුකරුවන්
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.COLORS.BACKGROUND_ASH,
    },
    addNewButtonContainerStyle: {
        borderRadius: 10,
        height: 40,
    },
    addNewButtonStyle: {
        height: 40,
        paddingHorizontal: 20,
        backgroundColor: Constants.COLORS.PRIMARY_BLUE,
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
    },
    overlayCard: {
        borderRadius: 10,
        backgroundColor: Constants.COLORS.BACKGROUND_BLUE,
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
        borderRadius: 10,
        alignSelf: 'center',
        width: '80%',
        height: 50,
    },
    buttonStyle: {
        height: 50,
        backgroundColor: Constants.COLORS.PRIMARY_COLOR,
    },
    buttonTitleStyle: {
        fontSize: 20,
    },
});

export default CustomerBase;
