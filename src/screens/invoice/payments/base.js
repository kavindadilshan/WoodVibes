import React, {Component, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Button, Card, Divider, Input, Overlay} from "react-native-elements";
import * as Constants from "../../../utils/constants";
import IconI from "react-native-vector-icons/Ionicons";
import * as Constance from "../../../utils/constants";
import TabHeader from "../../../components/tabHeader";
import * as InvoiceServices from "../../../services/invoice";
import * as commonFunc from "../../../utils/commonFunc";
import Loading from "../../../components/loading";
import AlertMessage from "../../../components/AlertMessage";
import * as actionTypes from "../../../store/actions";
import {connect} from "react-redux";
import Connecting from "../../../components/connecting";
import {BluetoothEscposPrinter, BluetoothManager} from "tp-react-native-bluetooth-printer";

const PayList = ({navigation, route,devicePairHandler, pairedDevices, asDeviceConnect, setDeviceConnectStatus, saveConnectedDeviceAddress, deviceAddress}) => {
    const [payList, setPayList] = useState([]);
    const [totalAmount, setTotalAmount] = useState('');
    const [payableAmount, setPayableAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [selectedPayId, setSelectedPayId] = useState();
    const [invoiceId, setInvoiceId] = useState();
    const [payAmount, setPayAmount] = useState();
    const [status, setStatus] = useState('');
    const [discount, setDiscount] = useState('');
    const [printerFindVisible, setPrinterFindVisible] = useState(false);
    const [printObject, setPrintObject] = useState({});
    const [isConnecting, setIsConnecting] = useState(false);
    const [printSize, setPrintSize] = useState(false);

    useEffect(async () => {
        setLoading(true);
        setInvoiceId(route.params.invoiceId)
        await getPayList(route.params.invoiceId)
    }, [])

    async function getPayList(invoiceId) {
        await InvoiceServices.getInvoicePaymentDetails(invoiceId)
            .then(response => {
                if (response) {
                    setPayList(response.paymentDetails !== null ? response.paymentDetails : []);
                    setTotalAmount(response.totalAmount.toFixed(2));
                    setPayableAmount(response.payableAmount.toFixed(2));
                    setStatus(response.status)
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
                        if (response.success) {
                            commonFunc.notifyMessage('Payment record delete successfully', 1);
                            await getPayList(invoiceId);
                        } else {
                            commonFunc.notifyMessage(response.message, response.status);
                        }
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

    const payInvoiceHandler = async () => {
        const data = {
            payAmount: payAmount
        }
        if (status !== 'ACTIVE') {
            Object.assign(data, {
                discount: discount
            })
        }
        setLoading(true)
        await InvoiceServices.invoicePay(invoiceId, data)
            .then(async response => {
                if (response.success) {
                    if (response.billPrintRequired) {
                        setPrintObject(response.content);
                        setPrintSize(response.printerSize);
                        if (asDeviceConnect){
                            printBill(response.content,response.printerSize)
                        }else {
                            setPrinterFindVisible(true)
                        }
                    }
                    setPayAmount('');
                    commonFunc.notifyMessage('Payment record added successfully', 1);
                    await getPayList(invoiceId);
                } else {
                    commonFunc.notifyMessage(response.message, response.status);
                }
            })
            .catch(error => {
                commonFunc.notifyMessage('You connection was interrupted', 0);
            })
        setLoading(false);
    }

    const onTextChange = (val) => {
        const discountedPrice = totalAmount - val;
        setPayableAmount(discountedPrice);
        setDiscount(val)
    }

    const printBill=(printObject,printerSize)=>{
        switch (printerSize) {
            case 'SMALL':
                printSmallSize(printObject);
                break;
            case 'MEDIUM':
                printMediumSize(printObject);
                break;
            default:
                break;

        }
    }


    const printSmallSize = (printObject) => {
        BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
        // await BluetoothEscposPrinter.setBlob(0);
        BluetoothEscposPrinter.printText(`${printObject.factoryName}\n\r`, {
            encoding: "GBK",
            codepage: 0,
            widthtimes: 1,
            heigthtimes: 1,
            fonttype: 1,
        });
        // BluetoothEscposPrinter.printText("\n\r", {});
        // await BluetoothEscposPrinter.setBlob(0);
        BluetoothEscposPrinter.printText(`T.P :- ${printObject.factoryContact}\n\r`, {
            encoding: "GBK",
            codepage: 0,
            widthtimes: 0,
            heigthtimes: 0,
            fonttype: 1,
        });

        // BluetoothEscposPrinter.printText(" \n\r", {});

        BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        BluetoothEscposPrinter.printText(`Invoice No: ${printObject.invoiceNo}\n\r`, {});
        BluetoothEscposPrinter.printText(`Order Date: ${printObject.orderDate}\n\r`, {});
        BluetoothEscposPrinter.printText(`Customer Name: ${printObject.customerName}\n\r`, {});
        BluetoothEscposPrinter.printText(
            "--------------------------------\n\r",
            {}
        );

        let columnWidths = [7, 6, 7, 12];
        {
            printObject.invoiceBillRecordGroups.map((items, i) => {

                BluetoothEscposPrinter.printText(`Wood Type       : ${items.woodType}\n\r`, {});
                BluetoothEscposPrinter.printText(`Unit Cost       : Rs.${(items.unitCost).toFixed(2)}\n\r`, {});
                BluetoothEscposPrinter.printText(`Item Count      : ${items.itemCount}\n\r`, {});
                BluetoothEscposPrinter.printText(`Total Cubic Feet: ${items.totalCubicFeet}\n\r`, {});
                // BluetoothEscposPrinter.printText("\n\r", {});

                BluetoothEscposPrinter.printColumn(columnWidths,
                    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT], ["Length", "C.F", "Cubic F.", "Amount"], {}
                )
                {
                    items.records.map((item, j) => {

                        BluetoothEscposPrinter.printColumn(columnWidths,
                            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT], [`${item.length}'`, `${item.circumference}"`, `${item.cubicFeet}`, `Rs.${item.amount.toFixed(2)}`], {}
                        )

                    })
                }

                BluetoothEscposPrinter.printText(
                    "--------------------------------\n\r",
                    {}
                );

            })
        }


        let bottomColumnWidth = [18, 18]
        BluetoothEscposPrinter.printColumn(bottomColumnWidth,
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER], ["Total Amount  :", `Rs.${printObject.totalAmount.toFixed(2)}`], {}
        )
        BluetoothEscposPrinter.printColumn(bottomColumnWidth,
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER], ["Discount      :", `Rs.${printObject.discount.toFixed(2)}`], {}
        )
        BluetoothEscposPrinter.printColumn(bottomColumnWidth,
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER], ["Amount        :", `Rs.${printObject.amount.toFixed(2)}`], {}
        )
        BluetoothEscposPrinter.printColumn(bottomColumnWidth,
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER], ["Payable Amount:", `Rs.${printObject.totalAmountToPaid.toFixed(2)}`], {}
        )
        BluetoothEscposPrinter.printColumn(bottomColumnWidth,
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER], ["Paid Amount   :", `Rs.${printObject.totalAmountPaid.toFixed(2)}`], {}
        )

        BluetoothEscposPrinter.printText(" \n\r", {});

        BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
        BluetoothEscposPrinter.printText("Thank you and come again!\n\r", {});
        BluetoothEscposPrinter.printText("Software by @ CodeLogicIT Solutions\n\r", {});
        BluetoothEscposPrinter.printText("T.P 074-1253110\n\r\n\r\n\r", {});
        BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);

    }

    const printMediumSize = (printObject) => {
        BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
        // await BluetoothEscposPrinter.setBlob(0);
        BluetoothEscposPrinter.printText(`${printObject.factoryName}\n\r`, {
            encoding: "GBK",
            codepage: 0,
            widthtimes: 1,
            heigthtimes: 1,
            fonttype: 1,
        });
        BluetoothEscposPrinter.printText("\n\r", {});
        // await BluetoothEscposPrinter.setBlob(0);
        BluetoothEscposPrinter.printText(`T.P :- ${printObject.factoryContact}\n\r`, {
            encoding: "GBK",
            codepage: 0,
            widthtimes: 0,
            heigthtimes: 0,
            fonttype: 1,
        });

        BluetoothEscposPrinter.printText(" \n\r", {});

        BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        BluetoothEscposPrinter.printText(`Invoice No: ${printObject.invoiceNo}\n\r`, {});
        BluetoothEscposPrinter.printText(`Order Date: ${printObject.orderDate}\n\r`, {});
        BluetoothEscposPrinter.printText(`Customer Name: ${printObject.customerName}\n\r`, {});
        BluetoothEscposPrinter.printText(
            "------------------------------------------------\n\r",
            {}
        );

        let columnWidths = [7, 17, 12, 12];
        {
            printObject.invoiceBillRecordGroups.map((items, i) => {

                BluetoothEscposPrinter.printText(`Wood Type       : ${items.woodType}\n\r`, {});
                BluetoothEscposPrinter.printText(`Unit Cost       : Rs.${(items.unitCost).toFixed(2)}\n\r`, {});
                BluetoothEscposPrinter.printText(`Item Count      : ${items.itemCount}\n\r`, {});
                BluetoothEscposPrinter.printText(`Total Cubic Feet: ${items.totalCubicFeet}\n\r`, {});

                BluetoothEscposPrinter.printColumn(columnWidths,
                    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT], ["Length", "Circumference", "Cubic Feet", "Amount"], {}
                )
                {
                    items.records.map((item, j) => {

                        BluetoothEscposPrinter.printColumn(columnWidths,
                            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT], [`${item.length}'`, `${item.circumference}"`, `${item.cubicFeet}`, `Rs.${item.amount.toFixed(2)}`], {}
                        )

                    })
                }

                BluetoothEscposPrinter.printText(
                    "------------------------------------------------\n\r",
                    {}
                );

            })
        }

        BluetoothEscposPrinter.printText("\n\r", {});

        let bottomColumnWidth = [20, 25]
        BluetoothEscposPrinter.printColumn(bottomColumnWidth,
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT], ["Total Amount  :", `Rs.${printObject.totalAmount.toFixed(2)}`], {}
        )
        BluetoothEscposPrinter.printColumn(bottomColumnWidth,
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT], ["Discount      :", `Rs.${printObject.discount.toFixed(2)}`], {}
        )
        BluetoothEscposPrinter.printColumn(bottomColumnWidth,
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT], ["Amount        :", `Rs.${printObject.amount.toFixed(2)}`], {}
        )
        BluetoothEscposPrinter.printColumn(bottomColumnWidth,
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT], ["Payable Amount:", `Rs.${printObject.totalAmountToPaid.toFixed(2)}`], {}
        )
        BluetoothEscposPrinter.printColumn(bottomColumnWidth,
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT], ["Paid Amount   :", `Rs.${printObject.totalAmountPaid.toFixed(2)}`], {}
        )

        BluetoothEscposPrinter.printText(" \n\r", {});

        BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
        BluetoothEscposPrinter.printText("Thank you and come again!\n\r", {});
        BluetoothEscposPrinter.printText("Software by @ CodeLogicIT Solutions\n\r", {});
        BluetoothEscposPrinter.printText("T.P 074-1253110\n\r\n\r\n\r\n\r", {});
        BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
    }

    const _connectPrinter=(printer)=>{
        setIsConnecting(true);
        BluetoothManager.connect(printer.address)
            .then(
                (s) => {
                    console.log('Connect status:::::::::::::::::::::::::' + JSON.stringify(s))
                    setPrinterFindVisible(false);
                    setIsConnecting(false);
                    setDeviceConnectStatus(true);
                    saveConnectedDeviceAddress(printer.address)
                    commonFunc.notifyMessage('Printer Connect Successfully!', 1);
                    printBill(printObject,printSize);
                },
                (e) => {
                    console.log(e);
                    setIsConnecting(false);
                    commonFunc.notifyMessage('Printer Connect Failed!', 0)
                }
            );
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

                    {status !== 'ACTIVE' && !route.params.asApproved &&(
                        <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                            <View>
                                <Text>Discount</Text>
                                <Text style={{fontFamily: 'Amalee'}}>වට්ටම්</Text>
                            </View>
                            <Input
                                containerStyle={styles.inputContainerStyle}
                                inputContainerStyle={{borderBottomWidth: 0}}
                                textAlign={'right'}
                                placeholder='Discount'
                                keyboardType='decimal-pad'
                                onChangeText={val => onTextChange(val)}
                                value={discount}
                            />
                        </View>
                    )}

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

                    {payList.length !== 0 && (
                        <Card containerStyle={styles.listCard}>
                            <View>
                                <View style={styles.listItemHeader}>
                                    <Card.Title style={{fontSize: 18, color: Constants.COLORS.PRIMARY_COLOR}}>Payment
                                        Records |
                                        ගෙවීම් වාර්තා</Card.Title>
                                    <Divider style={{marginVertical: 5}}/>
                                    <View style={styles.listItemHeaderItem}>
                                        <Text style={[styles.listItemHeaderItemTitle, {width: '30%'}]}>Amount
                                            (Rs.)</Text>
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
                    )}

                </Card>
            </ScrollView>

            <Overlay
                isVisible={printerFindVisible}
                overlayStyle={styles.overlay}
                onBackdropPress={() => setPrinterFindVisible(!printerFindVisible)}>
                <Card containerStyle={styles.overlayCard}>
                    <Card.Title style={{fontSize: 17}}>
                        Select Printer | මුද්‍රණ යන්ත්‍රය තෝරගන්න
                    </Card.Title>
                    <Card.Divider style={{backgroundColor: Constants.COLORS.BLACK}}/>

                    {
                        pairedDevices.map((printer, i) => (
                            <View style={[styles.cardItemConatiner, {marginBottom: 10}]} key={i}>
                                <TouchableOpacity style={styles.deviceContainer}
                                                  onPress={() => _connectPrinter(printer)}>
                                    <View style={{flexDirection: 'column',}}>
                                        <View style={{flexDirection: 'row',}}>
                                            <Text style={styles.deviceNameStyle}>Device Name:</Text>
                                            <Text style={styles.deviceSubTitle}>{printer.name}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row',}}>
                                            <Text style={styles.deviceNameStyle}>Device Mac :</Text>
                                            <Text style={styles.deviceSubTitle}>{printer.address}</Text>
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            </View>
                        ))
                    }
                </Card>
            </Overlay>

            <Loading isVisible={loading}/>
            <Connecting isVisible={isConnecting}/>
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
    deviceContainer: {
        backgroundColor: Constants.COLORS.WHITE,
        width: '100%',
        paddingVertical: 10,
        borderRadius: 10,
        // justifyContent:'space-between',
        paddingHorizontal: 5,
        flex: 1
    },
    deviceNameStyle: {
        color: Constants.COLORS.BLACK,
        fontWeight: 'bold'
    },
    deviceSubTitle: {
        marginLeft: 5,
        color: Constants.COLORS.ICON_ASH
    },
    overlayCard: {
        borderRadius: 10,
        backgroundColor: Constants.COLORS.BACKGROUND_GREEN,
        borderWidth: 0,
        marginBottom: 15,
    },
    overlay: {
        borderRadius: 10,
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
        borderWidth: 0,
        width: '100%'
    },
})

const mapStateToProps = (state) => ({
    pairedDevices: state.user.pairedDevices,
    asDeviceConnect: state.user.asDeviceConnect,
    deviceAddress: state.user.deviceAddress,
});

const mapDispatchToProps = dispatch => {
    return {
        devicePairHandler: pairedDevices => dispatch(actionTypes.devicePairHandler(pairedDevices)),
        setDeviceConnectStatus: asDeviceConnect => dispatch(actionTypes.setDeviceConnectStatus(asDeviceConnect)),
        saveConnectedDeviceAddress: deviceAddress => dispatch(actionTypes.saveConnectedDeviceAddress(deviceAddress))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PayList);
