import React, {Component, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {Button, Card, Divider, Input} from "react-native-elements";
import * as Constants from "../../../utils/constants";
import IconI from "react-native-vector-icons/Ionicons";
import * as Constance from "../../../utils/constants";
import TabHeader from "../../../components/tabHeader";
import * as InvoiceServices from "../../../services/invoice";
import * as commonFunc from "../../../utils/commonFunc";
import Loading from "../../../components/loading";
import AlertMessage from "../../../components/AlertMessage";

const PayList = ({navigation, route}) => {
    const [payList, setPayList] = useState([]);
    const [totalAmount, setTotalAmount] = useState('');
    const [payableAmount, setPayableAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [selectedPayId, setSelectedPayId] = useState();
    const [invoiceId,setInvoiceId]=useState();
    const [payAmount,setPayAmount]=useState();

    useEffect(async () => {
        setLoading(true);
        setInvoiceId(route.params.invoiceId)
        await getPayList(route.params.invoiceId)
    }, [])

    async function getPayList(invoiceId) {
        await InvoiceServices.getInvoicePaymentDetails(invoiceId)
            .then(response => {
                if (response){
                    setPayList(response.paymentDetails);
                    setTotalAmount(response.totalAmount.toFixed(2));
                    setPayableAmount(response.payableAmount.toFixed(2));
                }

            })
            .catch(error => {
                commonFunc.notifyMessage('You connection was interrupted', 0);
            })
        setLoading(false);
    }

    async function deletePayRecord(item) {
        switch (item) {
            case 'yes':
                setShowAlert(false);
                setLoading(true);
                await InvoiceServices.deletePayRecord(selectedPayId)
                    .then(async response => {
                        commonFunc.notifyMessage('Payment record delete successfully', 1);
                        await getPayList(invoiceId);
                    })
                    .catch(error => {
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

    const payInvoiceHandler=async ()=>{
        const data={
            payAmount:payAmount
        }
        setLoading(true)
        await InvoiceServices.invoicePay(invoiceId,data)
            .then(async response => {
                setLoading(false)
                commonFunc.notifyMessage('Payment record added successfully', 1);
                await getPayList(invoiceId);
            })
            .catch(error => {
                setLoading(false)
                commonFunc.notifyMessage('You connection was interrupted', 0);
            })
    }

    return (
        <View style={styles.container}>
            <TabHeader title='Pay List' backButton={true} navigation={navigation}/>
            <ScrollView contentContainerStyle={{paddingBottom: 10}}>
                <Card containerStyle={styles.orderCard}>
                    <Card.Title style={{fontSize: 18}}>Pay List | ගෙවීම් ලැයිස්තුව</Card.Title>
                    <Card.Divider style={{backgroundColor: Constants.COLORS.BLACK}}/>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Total Amount</Text>
                            <Text style={{fontFamily: 'Amalee'}}>මුලු වටිනාකම</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            textAlign={'right'}
                            placeholder='Cubic Feet'
                            value={`Rs. ${totalAmount}`}
                            disabled={true}
                        />
                    </View>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Payable Amount</Text>
                            <Text style={{fontFamily: 'Amalee'}}>ගෙවිය යුතු මුදල</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            textAlign={'right'}
                            placeholder='Cubic Feet'
                            value={`Rs. ${payableAmount}`}
                            disabled={true}
                        />
                    </View>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Pay Amount</Text>
                            <Text style={{fontFamily: 'Amalee', marginBottom: 8}}>ගෙවන මුදල</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            placeholder='Pay Amount'
                            textAlign={'right'}
                            keyboardType='decimal-pad'
                            value={payAmount}
                            onChangeText={val => setPayAmount(val)}
                        />
                    </View>

                    <Button
                        title="Save | සුරකින්න"
                        containerStyle={styles.buttonContainerStyle}
                        buttonStyle={styles.buttonStyle}
                        titleStyle={styles.buttonTitleStyle}
                        disabled={payAmount === undefined || payAmount === ''}
                        onPress={() => payInvoiceHandler()}
                    />

                    <Card containerStyle={styles.listCard}>
                        <View>
                            <View style={styles.listItemHeader}>
                                <Card.Title style={{fontSize: 18, color: Constants.COLORS.PRIMARY_COLOR}}>Payment
                                    Records |
                                    ගෙවීම් වාර්තා</Card.Title>
                                <Divider style={{marginVertical: 5}}/>
                                <View style={styles.listItemHeaderItem}>
                                    <Text style={[styles.listItemHeaderItemTitle, {width: '30%'}]}>Amount (Rs.)</Text>
                                    <Text
                                        style={[styles.listItemHeaderItemTitle, {width: '50%'}]}>Payment Date</Text>
                                    <View style={{width: '10%'}}></View>
                                </View>
                            </View>
                            <View style={styles.listItemBody}>
                                {payList.map((items, i) => (
                                    <View style={styles.listItemBodyItem} key={i}>
                                        <Text
                                            style={[styles.listItemBodyItemText, {width: '30%'}]}>{items.amount.toFixed(2)}</Text>
                                        <Text
                                            style={[styles.listItemBodyItemText, {width: '50%'}]}>{items.paymentDate}</Text>
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
                                                onPress={() => {
                                                    setSelectedPayId(items.id);
                                                    setShowAlert(true)
                                                }}
                                            />
                                        </View>
                                    </View>
                                ))}

                            </View>
                        </View>

                    </Card>
                </Card>
            </ScrollView>
            <Loading isVisible={loading}/>
            <AlertMessage
                show={showAlert}
                title={"Do you want to delete this record?"}
                onCancelPressed={() => deletePayRecord('yes')}
                onConfirmPressed={() => deletePayRecord('no')}
                cancelText={'Yes'}
                confirmText={'Not Now'}
            />
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
    buttonContainerStyle: {
        marginVertical: 20,
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
})

export default PayList;
