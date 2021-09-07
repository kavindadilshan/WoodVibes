import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button, Card} from 'react-native-elements';

import * as Constants from '../../utils/constants';
import TabHeader from '../../components/tabHeader';
import * as InvoiceServices from '../../services/invoice';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StorageStrings} from "../../utils/constants";
import * as CustomerServices from "../../services/customer";
import * as commonFunc from "../../utils/commonFunc";

const WoodSetupBase = ({navigation}) => {

    const [invoiceList,setInvoiceList]=useState({});

    useEffect(async () => {
        await getAllCustomersList();
    }, [])

    async function getAllCustomersList() {
        const factoryId = await AsyncStorage.getItem(StorageStrings.FACTORYID);
        await InvoiceServices.getAllInvoice(factoryId)
            .then(response => {
                setInvoiceList(response);
            })
            .catch(error => {
                commonFunc.notifyMessage(error.message, 0);
            })
    }

    const addOnPress = () => {
        // do logic
    }

    const headerRightBtn = <Button
                                title="Add New"
                                onPress={addOnPress}
                                containerStyle={styles.addNewButtonContainerStyle}
                                buttonStyle={styles.addNewButtonStyle}
                                titleStyle={styles.addNewButtonTitleStyle}
                            />

    return (
        <View style={styles.container}>
            <TabHeader title='Invoice Details'/>
            <ScrollView contentContainerStyle={{paddingBottom:10}}>
                {Object.keys(invoiceList).map((item,i)=>(
                    <Card containerStyle={styles.listCard} key={i}>
                        <Card.Title style={styles.listCardTitle}>
                            Sample Invoice
                        </Card.Title>
                        <Card.Divider/>
                        <View style={styles.listCardItem}>
                            <Text style={styles.listCardItemHeader}>Total Amount</Text>
                            <Text style={styles.listCardItemDesc}>{invoiceList[item].totalAmount}</Text>
                        </View>
                        <View style={styles.listCardItem}>
                            <Text style={styles.listCardItemHeader}>Invoice Date</Text>
                            <Text style={styles.listCardItemDesc}>{invoiceList[item].invoiceDate}</Text>
                        </View>
                    </Card>
                ))}

            </ScrollView>
        </View>
    )
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
      backgroundColor: Constants.COLORS.PRIMARY_COLOR
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
});

export default WoodSetupBase;
