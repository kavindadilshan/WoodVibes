import React, {Component, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";
import TabHeader from "../../../components/tabHeader";
import * as Constants from "../../../utils/constants";
import {Card, Divider, Input} from "react-native-elements";
import {Picker} from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StorageStrings} from "../../../utils/constants";
import * as InvoiceServices from "../../../services/invoice";
import * as commonFunc from "../../../utils/commonFunc";
import IconI from "react-native-vector-icons/Ionicons";

const InvoiceDetailsBase = ({navigation, route}) => {
    const [woodType, setWoodType] = useState([]);
    const [selectedWoodDetails, setSelectedWoodDetails] = useState({});
    const [invoiceDetailsList, setInvoiceDetailsList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        // setLoading(true);
        await getInvoiceById(route.params.invoiceId)
    }, [])

    async function getInvoiceById(invoiceId) {
        await InvoiceServices.getInvoiceById(invoiceId)
            .then(response => {
                if (response.invoiceDetails!==null) {
                    setInvoiceDetailsList(response.invoiceDetails);
                }
            })
            .catch(error => {
                commonFunc.notifyMessage(error.message, 0);
            })
        // setLoading(false);
    }

    return (
        <View style={styles.container}>
            <TabHeader title='Invoice Details' backButton={true} navigation={navigation}/>
            <ScrollView contentContainerStyle={{paddingBottom: 10}}>
                <Card containerStyle={styles.orderCard}>
                    <Card.Title style={{fontSize: 18}}>Invoice Details | ඉන්වොයිසි විස්තර</Card.Title>
                    <Card.Divider style={{backgroundColor: Constants.COLORS.BLACK}}/>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Invoice Number</Text>
                            <Text style={{fontFamily: 'Amalee'}}>ඉන්වොයිසි අංකය</Text>
                        </View>
                        <View style={styles.pickerConatiner}>
                        <Picker
                            mode='dropdown'
                            dropdownIconColor={Constants.COLORS.BLACK}
                            selectedValue={selectedWoodDetails}
                            onValueChange={(itemValue, itemIndex) => {
                                setSelectedWoodDetails(invoiceDetailsList[itemIndex])
                            }}
                        >
                            {invoiceDetailsList.map((items, i) => (
                                <Picker.Item label={`item ${i}`} value={items.id} key={i}/>
                            ))}
                        </Picker>
                        </View>
                    </View>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Cubic feet</Text>
                            <Text style={{fontFamily: 'Amalee'}}>ඝන අඩි</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            textAlign={'right'}
                            placeholder='Cubic Feet'
                            value={(selectedWoodDetails.cubicFeet?selectedWoodDetails.cubicFeet:'').toString()}
                        />
                    </View>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Amount</Text>
                            <Text style={{fontFamily: 'Amalee'}}>මුදල</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            textAlign={'right'}
                            placeholder='Enter here...'
                            value={`Rs. ${(selectedWoodDetails.amount?selectedWoodDetails.amount:'').toString()}`}
                        />
                    </View>
                </Card>
                <Card containerStyle={styles.listCard}>
                    <View>
                        <View style={styles.listItemHeader}>
                            <Card.Title style={{fontSize: 18,color: Constants.COLORS.PRIMARY_COLOR}}>Pay List | ගෙවීම් ලැයිස්තුව</Card.Title>
                            <Divider style={{marginVertical: 5}}/>
                            <View style={styles.listItemHeaderItem}>
                                <Text style={[styles.listItemHeaderItemTitle, {width: '20%'}]}>Payment Id</Text>
                                <Text style={[styles.listItemHeaderItemTitle, {width: '30%'}]}>amount (Rs.)</Text>
                                <Text
                                    style={[styles.listItemHeaderItemTitle, {width: '40%'}]}>Payment Date</Text>
                                <View style={{width: '10%'}}></View>
                            </View>
                        </View>
                        <View style={styles.listItemBody}>
                            <View style={styles.listItemBodyItem}>
                                <Text
                                    style={[styles.listItemBodyItemText, {width: '20%'}]}>1</Text>
                                <Text
                                    style={[styles.listItemBodyItemText, {width: '30%'}]}>1200</Text>
                                <Text
                                    style={[styles.listItemBodyItemText, {width: '40%'}]}>07-09-2021 19:37 PM</Text>
                                <View style={{
                                    width: '10%',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <IconI
                                        name='close-circle-outline'
                                        size={25}
                                        style={styles.listItemCloseIcon}
                                        color={Constants.COLORS.RED}
                                        // onPress={() => removeSelectedObject(i, j, groupList)}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                </Card>
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.COLORS.BACKGROUND_ASH,
    },
    orderCard: {
        borderRadius: 10,
        backgroundColor: Constants.COLORS.BACKGROUND_GREEN,
        borderWidth: 0,
    },
    cardItemConatiner: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    inputContainerStyle: {
        backgroundColor: Constants.COLORS.WHITE,
        width: '45%',
        height: 45,
        borderRadius: 10,
    },
    pickerConatiner: {
        width: '45%',
    },
    listCard: {
        borderRadius: 10,
        borderWidth: 0,
    },
    listItemHeader: {},
    listItemHeaderItem: {
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listItemHeaderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Constants.COLORS.PRIMARY_COLOR
    },
    listItemHeaderWood: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Constants.COLORS.WHITE,
        backgroundColor: Constants.COLORS.LIME_GREEN,
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 20,
    },
    listItemHeaderItemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Constants.COLORS.BLACK,
        textAlign: 'center',
        alignSelf: 'stretch'
    },
    listItemBody: {},
    listItemBodyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    listItemBodyItemText: {
        fontSize: 14,
        color: Constants.COLORS.BLACK,
        textAlign: 'center',
        alignSelf: 'stretch',
        marginTop: 4,
    },
    listItemCloseIcon: {},
})
export default InvoiceDetailsBase;
