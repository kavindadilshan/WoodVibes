import React, {Component, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";
import TabHeader from "../../../components/tabHeader";
import * as Constants from "../../../utils/constants";
import {Button, Card, Divider, Input} from "react-native-elements";
import {Picker} from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StorageStrings} from "../../../utils/constants";
import * as InvoiceServices from "../../../services/invoice";
import * as commonFunc from "../../../utils/commonFunc";
import IconI from "react-native-vector-icons/Ionicons";
import * as Constance from "../../../utils/constants";
import Loading from "../../../components/loading";

const InvoiceDetailsBase = ({navigation, route}) => {
    const [woodType, setWoodType] = useState([]);
    const [selectedWoodDetails, setSelectedWoodDetails] = useState({});
    const [invoiceDetailsList, setInvoiceDetailsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [invoiceId, setInvoiceId] = useState();
    const [invoiceIdentityNum, setInvoiceIdentityNum] = useState();
    const [role, setRole] = useState();

    useEffect(async () => {
        setLoading(true);
        setRole(await AsyncStorage.getItem(StorageStrings.ROLE));
        setInvoiceId(route.params.invoiceId);
        setInvoiceIdentityNum(route.params.invoiceNo.toString())
        await getInvoiceById(route.params.invoiceId)
    }, [])

    async function getInvoiceById(invoiceId) {
        await InvoiceServices.getInvoiceById(invoiceId)
            .then(response => {
                setCustomerName(response.customerName);
                setTotalAmount(response.totalAmount.toFixed(2));
                groupBy(response.invoiceDetails);
            })
            .catch(error => {
                commonFunc.notifyMessage('You connection was interrupted', 0);
            })
        setLoading(false);
    }

    const groupBy = (data) => {

        // this gives an object with dates as keys
        const groups = data.reduce((groups, game) => {
            const woodType = game.woodType;
            if (!groups[woodType]) {
                groups[woodType] = [];
            }
            groups[woodType].push(game);
            return groups;
        }, {});

        // Edit: to add it in the array format instead
        const groupArrays = Object.keys(groups).map((woodType) => {
            return {
                woodType,
                subList: groups[woodType]
            };
        });

        setInvoiceDetailsList(groupArrays);

        console.log(groupArrays);
    };

    const headerRightBtn = (
        <Button
            title="Pay List"
            onPress={() => navigation.navigate('PayList', {invoiceId: invoiceId})}
            containerStyle={styles.addNewButtonContainerStyle}
            buttonStyle={styles.addNewButtonStyle}
            titleStyle={styles.addNewButtonTitleStyle}
        />
    );

    return (
        <View style={styles.container}>
            <TabHeader title='Invoice Details' backButton={true} navigation={navigation}
                       rightComponent={role === 'ROLE_ADMIN' ? headerRightBtn : null}/>
            <ScrollView contentContainerStyle={{paddingBottom: 10}}>
                <Card containerStyle={styles.orderCard}>
                    <Card.Title style={{fontSize: 18}}>Invoice Details | ඉන්වොයිසි විස්තර</Card.Title>
                    <Card.Divider style={{backgroundColor: Constants.COLORS.BLACK}}/>
                    {/*<View style={[styles.cardItemConatiner, {marginBottom: 10}]}>*/}
                    {/*    <View>*/}
                    {/*        <Text>Invoice Number</Text>*/}
                    {/*        <Text style={{fontFamily: 'Amalee'}}>ඉන්වොයිසි අංකය</Text>*/}
                    {/*    </View>*/}
                    {/*    /!*<View style={styles.pickerConatiner}>*!/*/}
                    {/*    /!*<Picker*!/*/}
                    {/*    /!*    mode='dropdown'*!/*/}
                    {/*    /!*    dropdownIconColor={Constants.COLORS.BLACK}*!/*/}
                    {/*    /!*    selectedValue={selectedWoodDetails}*!/*/}
                    {/*    /!*    onValueChange={(itemValue, itemIndex) => {*!/*/}
                    {/*    /!*        setSelectedWoodDetails(invoiceDetailsList[itemIndex])*!/*/}
                    {/*    /!*    }}*!/*/}
                    {/*    /!*>*!/*/}
                    {/*    /!*    {invoiceDetailsList.map((items, i) => (*!/*/}
                    {/*    /!*        <Picker.Item label={`item ${i}`} value={items.id} key={i}/>*!/*/}
                    {/*    /!*    ))}*!/*/}
                    {/*    /!*</Picker>*!/*/}
                    {/*    /!*</View>*!/*/}
                    {/*</View>*/}
                    {/*{invoiceDetailsList.map((items,i)=>(*/}
                    {/*    <View>*/}
                    {/*        */}
                    {/*    </View>*/}
                    {/*))}*/}
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Invoice Number</Text>
                            <Text style={{fontFamily: 'Amalee'}}>ඉන්වොයිසි අංකය</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            textAlign={'right'}
                            value={invoiceIdentityNum}
                            disabled={true}
                        />
                    </View>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Customer Name</Text>
                            <Text style={{fontFamily: 'Amalee'}}>පාරිභෝගිකයාගේ නම</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            textAlign={'right'}
                            value={customerName}
                            disabled={true}
                        />
                    </View>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Total Amount</Text>
                            <Text style={{fontFamily: 'Amalee'}}>මුලු වටිනාකම</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            textAlign={'right'}
                            value={`Rs. ${totalAmount}`}
                            disabled={true}
                        />
                    </View>

                    {invoiceDetailsList.map((items, i) => (
                        <Card containerStyle={styles.listCard} key={i}>
                            <View style={styles.listItemHeader}>
                                <View style={styles.listItemHeaderItem}>
                                    <Text style={styles.listItemHeaderTitle}>{items.woodType}</Text>
                                </View>
                                <Divider style={{marginVertical: 5}}/>
                                <View style={styles.listItemHeaderItem}>
                                    <Text style={[styles.listItemHeaderItemTitle, {width: '30%'}]}>Cubic Feet
                                        (අඩි)</Text>
                                    <Text style={[styles.listItemHeaderItemTitle, {width: '30%'}]}>ඒකක මිල</Text>
                                    <Text
                                        style={[styles.listItemHeaderItemTitle, {width: '40%'}]}>වටිනාකම (Rs.)</Text>
                                </View>
                            </View>

                            {items.subList.map((item, j) => (
                                <View style={styles.listItemBody} key={j}>
                                    <View style={styles.listItemBodyItem}>
                                        <Text
                                            style={[styles.listItemBodyItemText, {width: '30%'}]}>{item.cubicFeet}</Text>
                                        <Text
                                            style={[styles.listItemBodyItemText, {width: '30%'}]}>{item.unitPrice.toFixed(2)}</Text>
                                        <Text
                                            style={[styles.listItemBodyItemText, {width: '40%'}]}>{(item.amount).toFixed(2)}</Text>
                                    </View>
                                </View>
                            ))}

                        </Card>
                    ))}


                </Card>

            </ScrollView>
            <Loading isVisible={loading}/>
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
        width: '100%',
        left: -15
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
})
export default InvoiceDetailsBase;
