import React, {Component, useEffect, useState} from 'react';
import {DeviceEventEmitter, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import TabHeader from "../../../components/tabHeader";
import * as Constants from "../../../utils/constants";
import {Button, Card, Divider, Input, Overlay} from "react-native-elements";
import {Picker} from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StorageStrings} from "../../../utils/constants";
import * as InvoiceServices from "../../../services/invoice";
import * as commonFunc from "../../../utils/commonFunc";
import IconI from "react-native-vector-icons/Ionicons";
import * as Constance from "../../../utils/constants";
import Loading from "../../../components/loading";
import {BluetoothEscposPrinter, BluetoothManager} from "tp-react-native-bluetooth-printer";
import * as actionTypes from "../../../store/actions";
import {connect} from "react-redux";
import Connecting from "../../../components/connecting";

const InvoiceDetailsBase = ({navigation, route, devicePairHandler, pairedDevices, asDeviceConnect, setDeviceConnectStatus, saveConnectedDeviceAddress, deviceAddress}) => {
    const [woodType, setWoodType] = useState([]);
    const [selectedWoodDetails, setSelectedWoodDetails] = useState({});
    const [invoiceDetailsList, setInvoiceDetailsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [invoiceId, setInvoiceId] = useState();
    const [invoiceIdentityNum, setInvoiceIdentityNum] = useState();
    const [role, setRole] = useState();
    const [discountAmount, setDiscountAmount] = useState('');
    const [payableAmount, setPayableAmount] = useState('');
    const [asApproved, setAsApproved] = useState(false);
    const [printerFindVisible, setPrinterFindVisible] = useState(false);
    const [printObject, setPrintObject] = useState({});
    const [isConnecting, setIsConnecting] = useState(false);
    const [boundAddress, setBoundAddress] = useState();
    const [printers, setPrinters] = useState([]);
    const [billPrintRequired, setBillPrintRequired] = useState(false)

    useEffect(async () => {
        console.log(':::::::::::::::::::::::::::::::::::::::::::::::::::' + pairedDevices)
        setLoading(true);
        setRole(await AsyncStorage.getItem(StorageStrings.ROLE));
        setInvoiceId(route.params.invoiceId);
        setInvoiceIdentityNum(route.params.invoiceNo.toString());
        setAsApproved(route.params.asApproved)
        await getInvoiceById(route.params.invoiceId)

    }, [])

    async function getInvoiceById(invoiceId) {
        await InvoiceServices.getInvoiceById(invoiceId)
            .then(response => {
                if (response.success) {
                    setCustomerName(response.customerName);
                    setTotalAmount(response.totalAmount.toFixed(2));
                    setDiscountAmount(response.discount.toFixed(2));
                    setPayableAmount(response.toPaidAmount.toFixed(2));
                    groupBy(response.invoiceDetails);
                } else {
                    commonFunc.notifyMessage(response.message, response.status);
                }

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
            onPress={() => navigation.navigate('PayList', {invoiceId: invoiceId,asApproved:asApproved})}
            containerStyle={styles.addNewButtonContainerStyle}
            buttonStyle={styles.addNewButtonStyle}
            titleStyle={styles.addNewButtonTitleStyle}
        />
    );

    const printInvoice = async () => {
        setLoading(true);
        await InvoiceServices.printBill(route.params.invoiceId)
            .then(res => {
                if (res.success) {
                    if (res.billPrintRequired) {
                        setPrintObject(res.content);
                        if (asDeviceConnect) {
                            printBill(res.content)
                        } else {
                            setPrinterFindVisible(true)
                        }
                    }
                    setBillPrintRequired(res.billPrintRequired);
                } else {
                    commonFunc.notifyMessage(res.message, res.status);
                }
            })
            .catch(err => {
                commonFunc.notifyMessage('You connection was interrupted', 0);
            })
        setLoading(false);
    }

    const printBill = (printObject) => {

        BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
        // await BluetoothEscposPrinter.setBlob(0);
        BluetoothEscposPrinter.printText(`${printObject.factoryName}\n\r\n\r`, {
            encoding: "GBK",
            codepage: 0,
            widthtimes: 1,
            heigthtimes: 1,
            fonttype: 1,
        });
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
        // setTimeout(async () => {
        {
            printObject.invoiceBillRecordGroups.map((items, i) => {

                BluetoothEscposPrinter.printText(`Wood Type : ${items.woodType}\n\r`, {});
                BluetoothEscposPrinter.printText(`Unit Cost : Rs.${(items.unitCost).toFixed(2)}\n\r`, {});
                BluetoothEscposPrinter.printText(`Item Count: ${items.itemCount}\n\r\n\r`, {});

                BluetoothEscposPrinter.printColumn(columnWidths,
                    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT], ["Length", "Circumference", "Cubic Feet", "Amount"], {}
                )
                // setTimeout(async () => {
                {
                    items.records.map((item, j) => {

                        BluetoothEscposPrinter.printColumn(columnWidths,
                            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT], [`${item.length}`, `${item.circumference}`, `${item.cubicFeet}`, `Rs.${item.amount.toFixed(2)}`], {}
                        )

                    })
                }
                // }, 500)

                BluetoothEscposPrinter.printText(
                    "------------------------------------------------\n\r",
                    {}
                );

            })
        }
        // }, 1000)

        setTimeout(() => {

            BluetoothEscposPrinter.printText("\n\r", {});

            let bottomColumnWidth = [20, 20]
            BluetoothEscposPrinter.printColumn(bottomColumnWidth,
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT], ["Total Amount  :", `Rs.${printObject.totalAmount.toFixed(2)}`], {}
            )
            BluetoothEscposPrinter.printColumn(bottomColumnWidth,
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT], ["Discount      :", `Rs.${printObject.discount.toFixed(2)}`], {}
            )
            BluetoothEscposPrinter.printColumn(bottomColumnWidth,
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT], ["Amount:", `Rs.${printObject.amount.toFixed(2)}`], {}
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
        }, 5000)
    }

    const _connectPrinter = (printer) => {
        setIsConnecting(true);
        BluetoothManager.connect(printer.address)
            .then(
                (s) => {
                    console.log('Connect status:::::::::::::::::::::::::' + JSON.stringify(s))
                    setBoundAddress(printer.address)
                    setPrinterFindVisible(false);
                    setIsConnecting(false);
                    setDeviceConnectStatus(true);
                    saveConnectedDeviceAddress(printer.address)
                    commonFunc.notifyMessage('Printer Connect Successfully!', 1);
                    printBill(printObject);
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
                        {customerName.length > 10 ? (
                            <View style={{backgroundColor: Constants.COLORS.WHITE, width: '45%', borderRadius: 10}}>
                                <ScrollView horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{alignItems: 'center', paddingHorizontal: 5}}
                                >
                                    <Text style={{fontSize: 17, color: 'gray'}}>{customerName}</Text>
                                </ScrollView>
                            </View>
                        ) : (
                            <Input
                                containerStyle={styles.inputContainerStyle}
                                inputContainerStyle={{borderBottomWidth: 0}}
                                textAlign={'right'}
                                value={customerName}
                                disabled={true}
                            />
                        )}


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

                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Discount</Text>
                            <Text style={{fontFamily: 'Amalee'}}>වට්ටම</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            textAlign={'right'}
                            value={`Rs. ${discountAmount}`}
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
                            value={`Rs. ${payableAmount}`}
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
                                <ScrollView horizontal={true}>
                                    <View style={{flexDirection: 'column'}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text
                                                style={[styles.listItemHeaderItemTitle, {width: 75}]}>දිග</Text>
                                            <Text
                                                style={[styles.listItemHeaderItemTitle, {width: 75}]}>වට</Text>
                                            <Text style={[styles.listItemHeaderItemTitle, {width: 130}]}>Cubic
                                                ප්‍රමාණය</Text>
                                            <Text style={[styles.listItemHeaderItemTitle, {width: 150}]}>ඒකක
                                                මිල (Rs.)</Text>
                                            <Text
                                                style={[styles.listItemHeaderItemTitle, {width: 150}]}>වටිනාකම
                                                (Rs.)</Text>
                                        </View>
                                        {items.subList.map((item, j) => (
                                            <View style={{flexDirection: 'row'}} key={j}>
                                                <Text
                                                    style={[styles.listItemBodyItemText, {width: 75}]}>{item.length}</Text>
                                                <Text
                                                    style={[styles.listItemBodyItemText, {width: 75}]}>{item.circumference}</Text>
                                                <Text
                                                    style={[styles.listItemBodyItemText, {width: 130}]}>{item.cubicFeet}</Text>
                                                <Text
                                                    style={[styles.listItemBodyItemText, {width: 150}]}>{item.unitPrice.toFixed(2)}</Text>
                                                <Text
                                                    style={[styles.listItemBodyItemText, {width: 150}]}>{(item.amount).toFixed(2)}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>

                        </Card>
                    ))}


                </Card>

                {role === 'ROLE_ADMIN' && asApproved && (
                    <View style={{width: '100%', height: 100}}>
                        <View style={{width: 100, justifyContent: 'center', right: 15, position: 'absolute', top: 20}}>
                            <Button
                                title="Print"
                                onPress={() => printInvoice()}
                                containerStyle={styles.addNewButtonContainerStyle}
                                buttonStyle={{
                                    ...styles.addNewButtonStyle,
                                    backgroundColor: Constants.COLORS.PRIMARY_COLOR
                                }}
                                titleStyle={styles.addNewButtonTitleStyle}
                            />
                        </View>
                    </View>
                )}


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

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceDetailsBase);
