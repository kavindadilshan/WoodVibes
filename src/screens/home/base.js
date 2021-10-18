import React, {useEffect, useState} from 'react';
import {
    DeviceEventEmitter,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons';
import {Button, Card, Divider, Input, Overlay} from 'react-native-elements';

import * as Constants from '../../utils/constants';
import {StorageStrings} from '../../utils/constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WoodServices from '../../services/wood';
import * as CustomerServices from '../../services/customer';
import * as InvoiceServices from '../../services/invoice';
import * as commonFunc from "../../utils/commonFunc";
import Loading from "../../components/loading";
import AlertMessage from "../../components/AlertMessage";
import DropDown from "../../components/dropDown";
import {CommonActions} from "@react-navigation/native";
import {
    USBPrinter,
    NetPrinter,
    BLEPrinter,
} from "react-native-thermal-receipt-printer";
import Connecting from '../../components/connecting';
import {BluetoothEscposPrinter, BluetoothManager, BluetoothTscPrinter} from "tp-react-native-bluetooth-printer";
import {connect} from "react-redux";
import * as actionTypes from '../../store/actions';
import ResetIMG from '../../resources/images/reset.png'

interface IBLEPrinter {
    device_name: string;
    inner_mac_address: string;
}

const screenHeight = Dimensions.get("screen").height;

let options = {
    width: 40,
    height: 30,
    gap: 20,
    direction: BluetoothTscPrinter.DIRECTION.FORWARD,
    reference: [0, 0],
    tear: BluetoothTscPrinter.TEAR.ON,
    sound: 0,
    text: [
        {
            text: "කාවින්ද දිල්ශාන්",
            x: 20,
            y: 0,
            fonttype: BluetoothTscPrinter.FONTTYPE.FONT_5,
            rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
            xscal: BluetoothTscPrinter.FONTMUL.MUL_1,
            yscal: BluetoothTscPrinter.FONTMUL.MUL_1,
        },
        // {
        //     text: "Second testing text",
        //     x: 20,
        //     y: 50,
        //     fonttype: BluetoothTscPrinter.FONTTYPE.SIMPLIFIED_CHINESE,
        //     rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
        //     xscal: BluetoothTscPrinter.FONTMUL.MUL_1,
        //     yscal: BluetoothTscPrinter.FONTMUL.MUL_1,
        // },
    ],
};

const HomeBase = ({navigation, devicePairHandler, pairedDevices, asDeviceConnect, setDeviceConnectStatus, saveConnectedDeviceAddress, deviceAddress}) => {
    const [woodTypeList, setWoodTypeList] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [selectedWoodTypeId, setSelectedWoodTypeId] = useState('');
    const [selectedWoodDetails, setSelectedWoodDetails] = useState({});
    const [length, setLength] = useState();
    const [circumference, setCircumference] = useState();
    const [totalAmount, setTotalAmount] = useState();
    const [discount, setDiscount] = useState('');
    const [netAmount, setNetAmount] = useState();
    const [payAmount, setPayAmount] = useState();
    const [editable, setEditable] = useState(false);
    const [addingList, setAddingList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [customerList, setCustomerList] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState();
    const [asChanged, setAsChanged] = useState(false);
    const [groupList, setGroupList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [visibleIndex, setVisibleIndex] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [showAlert2, setShowAlert2] = useState(false);
    const [editCostVisible, setEditCostVisible] = useState(false);
    const [newCost, setNewCost] = useState();
    const [selectedCustomerList, setSelectedCustomerList] = useState([]);
    const [selectedWoodTypeList, setSelectedWoodTypeList] = useState([]);
    const [selectedWoodCost, setSelectedWoodCost] = useState();
    const [role, setRole] = useState();
    const [printers, setPrinters] = useState([]);
    const [currentPrinter, setCurrentPrinter] = useState();
    const [printerFindVisible, setPrinterFindVisible] = useState(false);
    const [billPrintRequired, setBillPrintRequired] = useState(false);
    const [printSize, setPrintSize] = useState(false);
    const [printObject, setPrintObject] = useState({});
    const [isConnecting, setIsConnecting] = useState(false);
    const [boundAddress, setBoundAddress] = useState();
    const [reset, setReset] = useState(false);
    const [reset2, setReset2] = useState(false);
    const [customerText, setCustomerText] = useState('');
    const [woodText, setWoodText] = useState('');

    useEffect(async () => {
        navigation.addListener('focus', async () => {
            setRole(await AsyncStorage.getItem(StorageStrings.ROLE));
            await getAllCustomersList();
            await getWoodTypeLists();
        });

        //scan ble devices
        // BLEPrinter.init().then((res) => {
        //     BLEPrinter.getDeviceList()
        //         .then(res => {
        //             console.log(res)
        //             setPrinters(res)
        //         })
        //         .catch(err => {
        //             console.log(err)
        //         })
        // });
        bluetoothConfigurationHandler();

        const subscription = DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED);
        const subscription2 = DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND);

        return function cleanup() {
            subscription.remove();
            subscription2.remove();
        }


    }, [navigation])

    const bluetoothConfigurationHandler = () => {
        BluetoothManager.isBluetoothEnabled().then(
            (enabled) => {
                console.log('isBLE Enabled::::::::::::::::::::::::' + enabled); // enabled ==> true /false
                bluetoothEnableFunc()
            },
            (err) => {
                console.log(err);
            }
        );
    }

    const bluetoothEnableFunc = () => {
        BluetoothManager.enableBluetooth().then(
            (r) => {
                let paired = [];
                if (r && r.length > 0) {
                    for (let i = 0; i < r.length; i++) {
                        try {
                            paired.push(JSON.parse(r[i])); // NEED TO PARSE THE DEVICE INFORMATION
                        } catch (e) {
                            console.log(e)
                        }
                    }
                }
                console.log('Paired devices::::::::::::::::::::::::' + JSON.stringify(paired));
                setPrinters(paired)
                devicePairHandler(paired)
            },
            (err) => {
                alert(err);
            }
        );
    }

    async function getWoodTypeLists() {
        const factoryId = await AsyncStorage.getItem(StorageStrings.FACTORYID);
        await WoodServices.getAllWoodCost(factoryId)
            .then(response => {
                const list = [];
                response.woodMeasurementCosts.map((items) => {
                    list.push({
                        id: items.id,
                        cost: items.cost,
                        name: items.woodType
                    })
                })
                setWoodTypeList(list);
            })
            .catch(error => {
                commonFunc.notifyMessage('You connection was interrupted', 0);
            })
    }

    async function getAllCustomersList() {
        const factoryId = await AsyncStorage.getItem(StorageStrings.FACTORYID);
        await CustomerServices.getCustomerList(factoryId)
            .then(response => {
                setCustomerList(response.customers);
            })
            .catch(error => {
                commonFunc.notifyMessage('You connection was interrupted', 0);
            })
    }

    async function getWoodDetailsById(id) {
        await WoodServices.getAllWoodCostById(id)
            .then(response => {
                setSelectedWoodDetails(response);
                setSelectedWoodTypeId(id);
                setEditable(true);
                setLength('');
                setCircumference('');
                setTotalAmount('');
                setNetAmount('')
            })
            .catch(error => {
                commonFunc.notifyMessage('You connection was interrupted', 0);
            })
    }

    async function saveInvoiceHandler() {
        let list = [];
        addingList.map((item) => {
            list.push({
                woodMeasurementCostId: item.woodMeasurementCostId,
                cubicFeet: Number(item.cubicQuantity),
                amount: Number(item.totalAmount),
                length: Number(item.length),
                circumference: Number(item.circumference),
            })
        })

        const factoryId = await AsyncStorage.getItem(StorageStrings.FACTORYID);
        const data = {
            role: await AsyncStorage.getItem(StorageStrings.ROLE),
            userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
            customerId: selectedCustomerId,
            factoryId: Number(factoryId),
            totalAmount: Number(totalAmount),
            discount: Number(role === 'ROLE_ADMIN' ? discount : 0),
            payAmount: Number(role === 'ROLE_ADMIN' ? payAmount : 0),
            amount: Number(role === 'ROLE_ADMIN' ? netAmount : totalAmount),
            invoiceDetails: list
        }
        setLoading(true)

        await InvoiceServices.saveInvoice(data)
            .then(res => {
                if (res.success) {
                    if (res.billPrintRequired) {
                        setPrintSize(res.printerSize);
                        setPrintObject(res.content);
                        if (asDeviceConnect) {
                            printBill(res.content, res.printerSize)
                        } else {
                            setPrinterFindVisible(true)
                        }
                    }
                    setBillPrintRequired(res.billPrintRequired);
                    commonFunc.notifyMessage('Invoice saved successfully!', 1);
                    setGroupList([]);
                    setTotalAmount(null);
                    setDiscount('');
                    setNetAmount(null);
                    setPayAmount('');
                    setLength('');
                    setCircumference('');
                    setAddingList([]);
                    setSelectedCustomerList([]);
                    setSelectedWoodTypeList([]);
                } else {
                    commonFunc.notifyMessage(res.message, res.status);
                }

            })
            .catch(error => {
                commonFunc.notifyMessage('You connection was interrupted', 0);
            })
        setLoading(false)
    }

    const addOnPress = () => {
        if (selectedCustomerId === undefined || selectedCustomerId === '') {
            commonFunc.notifyMessage('Please Select Customer', 2);
        } else if (selectedWoodCost === undefined || selectedWoodCost === '') {
            commonFunc.notifyMessage('Please Select Wood Type', 2);
        } else if (length === undefined || length === '') {
            commonFunc.notifyMessage('Please Enter Length', 2);
        } else if (circumference === undefined || circumference === '') {
            commonFunc.notifyMessage('Please Enter Circumference', 2);
        } else {
            if (asChanged) {
                // const cubicQuantity = (length * (circumference / 12));
                const cubicQuantity = ((circumference * circumference) * length) / 2304
                const totalValue = (selectedWoodCost * cubicQuantity).toFixed();
                setTotalAmount(totalValue.toString());
                setNetAmount(totalValue.toString());
                setEditable(true);
                setDiscount('');
                setPayAmount('');
                if (role !== 'ROLE_ADMIN') {
                    setPayAmount(0)
                }

                addingList.push({
                    woodMeasurementCostId: selectedWoodTypeId,
                    woodType: selectedWoodDetails.name,
                    length: length,
                    circumference: circumference,
                    cubicQuantity: cubicQuantity.toFixed(2),
                    unitPrice: selectedWoodCost,
                    totalAmount: totalValue
                })

                let totalLastAmount = 0;
                for (let i = 0; i < addingList.length; i++) {
                    totalLastAmount += Number(addingList[i].totalAmount)
                }
                setTotalAmount(totalLastAmount.toString());
                setNetAmount((totalLastAmount - totalLastAmount * discount / 100).toString())
                // setAddingList(list);
                setAsChanged(false);
                // console.log(addingList);
                groupBy();
            }
        }
    }

    const groupBy = () => {

        // this gives an object with dates as keys
        const groups = addingList.reduce((groups, game) => {
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

        setGroupList(groupArrays);

        setLength('');
        setCircumference('');
    };

    const profileOnPress = async () => {
        await AsyncStorage.clear();
    }

    const aboutOnPress = () => {
        navigation.navigate('About')
    }

    const onChangeText = val => {
        setDiscount(val);
        // const netValue = (totalAmount - (totalAmount * val / 100)).toFixed(2);
        const netValue = totalAmount - val;
        setNetAmount(netValue.toString())
    }

    const removeSelectedObject = (outerIndex, innerIndex, list) => {

        list[outerIndex].subList.splice(innerIndex, 1);
        setTableLoading(true);

        const list2 = [];
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list[i].subList.length; j++) {
                list2.push({
                    woodMeasurementCostId: list[i].subList[j].woodMeasurementCostId,
                    woodType: list[i].subList[j].woodType,
                    cubicQuantity: list[i].subList[j].cubicQuantity,
                    unitPrice: list[i].subList[j].unitPrice,
                    totalAmount: list[i].subList[j].totalAmount
                })
            }
        }

        let totalLastAmount = 0;
        for (let i = 0; i < list2.length; i++) {
            totalLastAmount += Number(list2[i].totalAmount)
        }

        setTimeout(() => {
            setTableLoading(false);
            setGroupList(list);
            setAddingList(list2);
            setTotalAmount(totalLastAmount.toString());
            setNetAmount((totalLastAmount - totalLastAmount * discount / 100).toString())
        }, 100)
    }

    const tableTotalValues = array => {
        let totalCubic = 0;
        let totalUnits = 0;
        let totalAmounts = 0;
        let totalLength = 0;
        let totalCircumference = 0;
        for (let i = 0; i < array.length; i++) {
            totalLength += Number(array[i].length);
            totalCircumference += Number(array[i].circumference);
            totalCubic += Number(array[i].cubicQuantity);
            totalUnits = array[i].unitPrice;
            totalAmounts += Number(array[i].totalAmount)
        }
        return {
            totalCubic: totalCubic.toFixed(2),
            totalUnits: totalUnits,
            totalAmounts: totalAmounts.toFixed(2),
            totalLength: totalLength.toFixed(2),
            totalCircumference: totalCircumference.toFixed(2)
        }
    }

    const toggleOverlay = (i) => {
        setVisible(!visible);
        setVisibleIndex(i)
    };

    async function editWoodCostHandler(item) {
        switch (item) {
            case 'yes':
                setNewCost('');
                setShowAlert(false);
                setEditCostVisible(false);
                setLoading(true);
                const data = {
                    id: selectedWoodDetails.id,
                    cost: newCost
                }
                await WoodServices.editCostById(data)
                    .then(async response => {
                        if (response.success) {
                            setWoodTypeList([])
                            setSelectedWoodTypeList({})
                            setLoading(false);
                            commonFunc.notifyMessage('Wood Cost Edit successfully', 1);
                            setSelectedWoodCost(Number(newCost));
                            await getWoodTypeLists();
                        } else {
                            setLoading(false);
                            commonFunc.notifyMessage(response.message, response.status);
                        }

                    })
                    .catch(error => {
                        setLoading(false);
                        commonFunc.notifyMessage('You connection was interrupted', 0);
                    })
                break;
            case 'no':
                setShowAlert(false);
                setEditCostVisible(false);
                break;
            default:
                break;
        }
    }

    const _connectPrinter = (printer) => {
        //connect printer
        setIsConnecting(true);
        // BLEPrinter.connectPrinter(printer.inner_mac_address)
        //     .then(res => {
        //         console.log(res)
        //         setCurrentPrinter(res);
        //         setPrinterFindVisible(false);
        //         setIsConnecting(false);
        //         commonFunc.notifyMessage('Printer Connect Successfully!', 1);
        //
        //         setTimeout(() => {
        //             printBill();
        //         }, 1000)
        //
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         setIsConnecting(false);
        //         commonFunc.notifyMessage('Printer Connect Failed!', 0)
        //     })

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
                    printBill(printObject, printSize);
                },
                (e) => {
                    console.log(e);
                    setIsConnecting(false);
                    commonFunc.notifyMessage('Printer Connect Failed!', 0)
                }
            );
    }

    const printBill = (printObject, printSize) => {
        switch (printSize) {
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


        let bottomColumnWidth = [18, 22]
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

    const onClearStates = async () => {
        setReset(true);
        setReset2(true)
        setSelectedWoodTypeId('');
        setSelectedWoodDetails({});
        setLength('');
        setCircumference('');
        setTotalAmount('');
        setDiscount('');
        setNetAmount('');
        setPayAmount('');
        setEditable(false);
        setAddingList([]);
        setLoading(false);
        setTableLoading(false);
        setSelectedCustomerId('');
        setAsChanged(false);
        setGroupList([]);
        setVisible(false);
        setVisibleIndex('');
        setShowAlert(false);
        setShowAlert2(false);
        setEditCostVisible(false);
        setNewCost('');
        setSelectedCustomerList([]);
        setSelectedWoodTypeList([]);
        setSelectedWoodCost('');
        setCustomerText('');
        setWoodText('');
    }

    return (
        <View style={{flexGrow: 1}}>

            <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>{Constants.APP_NAME}</Text>
                        <View style={styles.headerRight}>
                            <IconI
                                name='person-circle-outline'
                                size={37}
                                onPress={aboutOnPress}
                                style={styles.headerIcon}
                                color={Constants.COLORS.PLACEHOLDER_ASH}
                            />
                            <IconI
                                name='log-out-outline'
                                size={35}
                                onPress={() => setShowAlert2(true)}
                                style={[styles.headerIcon, {marginLeft: 10}]}
                                color={Constants.COLORS.PLACEHOLDER_ASH}
                            />
                        </View>
                    </View>
                    <View style={{height: addingList.length !== 0 ? screenHeight / 100 * 60 : '100%'}}>
                        <ScrollView contentContainerStyle={{paddingBottom: 10}} nestedScrollEnabled={true}
                                    keyboardShouldPersistTaps="handled">
                            <Card containerStyle={styles.orderCard}>
                                <Card.Title style={{fontSize: 18, alignItems: 'center'}}>
                                    New order | නව ඇණවුම්

                                </Card.Title>
                                <TouchableOpacity
                                    style={{width: 30, height: 30, right: 10, position: 'absolute', top: -2}}
                                    onPress={() => onClearStates()}
                                >
                                    <Image source={ResetIMG} style={{width: '100%', height: '100%'}}/>
                                </TouchableOpacity>
                                <Card.Divider style={{backgroundColor: Constants.COLORS.BLACK}}/>
                                <View style={styles.cardItemConatiner}>
                                    <View>
                                        <Text>Customer</Text>
                                        <Text style={{fontFamily: 'Amalee'}}>ගණුදෙනුකරු</Text>
                                    </View>
                                    <View style={styles.pickerConatiner}>
                                        {/*<Picker*/}
                                        {/*    mode='dropdown'*/}
                                        {/*    dropdownIconColor={Constants.COLORS.BLACK}*/}
                                        {/*    selectedValue={selectedLanguage}*/}
                                        {/*    onValueChange={(itemValue, itemIndex) => {*/}
                                        {/*        setSelectedCustomerId(itemValue);*/}
                                        {/*        setEditable(true);*/}
                                        {/*        setLength('');*/}
                                        {/*        setCircumference('');*/}
                                        {/*    }}>*/}
                                        {/*    {customerList.map((items, i) => (*/}
                                        {/*        <Picker.Item label={items.name} value={items.id} key={i}/>*/}
                                        {/*    ))}*/}
                                        {/*</Picker>*/}
                                        <DropDown
                                            onItemSelect={(item) => {
                                                setReset(false);
                                                setSelectedCustomerId(item.id);
                                                setSelectedCustomerList(item)
                                                setEditable(true);
                                                setLength('');
                                                setCircumference('');
                                            }}
                                            selectedItems={selectedCustomerList}
                                            onRemoveItem={(item, index) => {
                                                const items = selectedCustomerList.filter((sitem) => sitem.id !== item.id);
                                                setSelectedCustomerList(items)
                                            }}
                                            items={customerList}
                                            placeholder={"Select Customer"}
                                            onChange={(text) => setCustomerText(text)}
                                            value={customerText}
                                            reset={reset}
                                        />
                                    </View>
                                </View>
                                <View style={[styles.cardItemConatiner, {marginTop: 10}]}>
                                    <View>
                                        <Text>Wood type</Text>
                                        <Text style={{fontFamily: 'Amalee'}}>දැව වර්ගය</Text>
                                    </View>

                                    <View style={styles.pickerConatiner}>
                                        {/*<Picker*/}
                                        {/*    mode='dropdown'*/}
                                        {/*    dropdownIconColor={Constants.COLORS.BLACK}*/}
                                        {/*    selectedValue={selectedLanguage}*/}
                                        {/*    onValueChange={(itemValue, itemIndex) => {*/}
                                        {/*        setSelectedWoodDetails(woodTypeList.length!==0?woodTypeList[itemIndex]:{});*/}
                                        {/*        setSelectedWoodTypeId(itemValue);*/}
                                        {/*        setEditable(true);*/}
                                        {/*        setLength('');*/}
                                        {/*        setCircumference('');*/}
                                        {/*    }}>*/}
                                        {/*    {woodTypeList.map((item, i) => (*/}
                                        {/*        <Picker.Item label={item.woodType} value={item.id} key={i}/>*/}
                                        {/*    ))}*/}
                                        {/*</Picker>*/}
                                        <DropDown
                                            onItemSelect={(item) => {
                                                setReset2(false);
                                                setSelectedWoodDetails(woodTypeList.length !== 0 ? item : {});
                                                setSelectedWoodTypeId(item.id);
                                                setEditable(true);
                                                setLength('');
                                                setCircumference('');
                                                setSelectedWoodTypeList(item);
                                                setSelectedWoodCost(item.cost)
                                            }}
                                            selectedItems={selectedWoodTypeList}
                                            onRemoveItem={(item, index) => {
                                                const items = selectedWoodTypeList.filter((sitem) => sitem.id !== item.id);
                                                setSelectedWoodTypeList(items)
                                            }}
                                            items={woodTypeList}
                                            placeholder={"Select Wood Type"}
                                            reset={reset2}
                                        />
                                    </View>
                                </View>
                                <View style={[styles.cardItemConatiner, {marginVertical: 15}]}>

                                    <View
                                        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                        <View style={{flexDirection: 'column'}}>
                                            <Text>Unit price</Text>
                                            <Text style={{fontFamily: 'Amalee'}}>ඒකක මිල</Text>
                                        </View>

                                        {selectedWoodTypeList.length !== 0 && (
                                            <TouchableOpacity style={styles.miniButton}
                                                              onPress={() => setEditCostVisible(!editCostVisible)}>
                                                <Text style={{color: 'white'}}>Edit</Text>
                                            </TouchableOpacity>
                                        )}

                                    </View>
                                    <Text
                                        style={{fontSize: 20}}>Rs. {selectedWoodCost ? (selectedWoodCost).toFixed(2) : 0}</Text>
                                </View>
                                <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                                    <View>
                                        <Text>Length (feet)</Text>
                                        <Text style={{fontFamily: 'Amalee'}}>දිග (අඩි)</Text>
                                    </View>
                                    <Input
                                        containerStyle={styles.inputContainerStyle}
                                        inputContainerStyle={{borderBottomWidth: 0}}
                                        textAlign={'right'}
                                        placeholder='Enter here...'
                                        keyboardType='decimal-pad'
                                        value={length}
                                        onChangeText={val => {
                                            setLength(val);
                                            setAsChanged(true)
                                        }}
                                    />
                                </View>
                                <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                                    <View>
                                        <Text>Circumference (inches)</Text>
                                        <Text style={{fontFamily: 'Amalee'}}>වට ප්‍රමාණය (අඟල්)</Text>
                                    </View>
                                    <Input
                                        containerStyle={styles.inputContainerStyle}
                                        inputContainerStyle={{borderBottomWidth: 0}}
                                        textAlign={'right'}
                                        placeholder='Enter here...'
                                        keyboardType='decimal-pad'
                                        value={circumference}
                                        onChangeText={val => {
                                            setCircumference(val);
                                            setAsChanged(true)
                                        }}
                                    />
                                </View>
                                <Button
                                    title="Add | එකතු කරන්න"
                                    onPress={addOnPress}
                                    containerStyle={styles.buttonContainerStyle}
                                    buttonStyle={styles.buttonStyle}
                                    titleStyle={styles.buttonTitleStyle}
                                />
                                {/*<View style={styles.cardTotalConatiner}>*/}
                                {/*    <View>*/}
                                {/*        <Text style={{color: Constants.COLORS.BLACK, fontWeight: 'bold'}}>Total amount</Text>*/}
                                {/*        <Text style={{fontFamily: 'Amalee', color: Constants.COLORS.BLACK, fontWeight: 'bold'}}>මුලු*/}
                                {/*            වටිනාකම</Text>*/}
                                {/*    </View>*/}
                                {/*    <Text*/}
                                {/*        style={{fontSize: 30, color: Constants.COLORS.BLACK, fontWeight: 'bold'}}>Rs.12456.99</Text>*/}
                                {/*</View>*/}
                                <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                                    <View>
                                        <Text>Total Amount</Text>
                                        <Text style={{fontFamily: 'Amalee'}}>මුලු වටිනාකම</Text>
                                    </View>
                                    <Input
                                        containerStyle={styles.inputContainerStyle}
                                        inputContainerStyle={{borderBottomWidth: 0}}
                                        textAlign={'right'}
                                        placeholder='Total Amount'
                                        value={`Rs. ${totalAmount ? totalAmount : 0}`}
                                        disabled={true}
                                    />
                                </View>
                                {role === 'ROLE_ADMIN' && (
                                    <View>
                                        <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                                            <View>
                                                <Text>Discount</Text>
                                                <Text style={{fontFamily: 'Amalee'}}>වට්ටම් </Text>
                                            </View>
                                            <Input
                                                containerStyle={styles.inputContainerStyle}
                                                inputContainerStyle={{borderBottomWidth: 0}}
                                                textAlign={'right'}
                                                placeholder='Discount'
                                                value={discount}
                                                keyboardType='decimal-pad'
                                                onChangeText={val => onChangeText(val)}
                                                disabled={!editable}
                                                // maxLength={2}
                                            />
                                        </View>
                                        <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                                            <View style={{width: '48%'}}>
                                                <Text>Net Amount</Text>
                                                <Text style={{fontFamily: 'Amalee', marginBottom: 8}}>ශුද්ධ මුදල</Text>
                                                <Input
                                                    containerStyle={{...styles.inputContainerStyle, width: '100%'}}
                                                    inputContainerStyle={{borderBottomWidth: 0}}
                                                    placeholder='Net Amount'
                                                    value={`Rs. ${netAmount ? netAmount : 0}`}
                                                    disabled={true}
                                                />
                                            </View>
                                            <View style={{width: '48%'}}>
                                                <Text>Pay Amount</Text>
                                                <Text style={{fontFamily: 'Amalee', marginBottom: 8}}>ගෙවන මුදල</Text>
                                                <Input
                                                    containerStyle={{...styles.inputContainerStyle, width: '100%'}}
                                                    inputContainerStyle={{borderBottomWidth: 0}}
                                                    placeholder='Pay Amount'
                                                    keyboardType='decimal-pad'
                                                    value={payAmount}
                                                    onChangeText={val => setPayAmount(val)}
                                                    disabled={!editable}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )}
                                <Button
                                    title="Save | සුරකින්න"
                                    containerStyle={styles.buttonContainerStyle}
                                    buttonStyle={styles.buttonStyle}
                                    titleStyle={styles.buttonTitleStyle}
                                    disabled={payAmount === undefined || payAmount === ''}
                                    onPress={() => saveInvoiceHandler()}
                                />
                            </Card>
                        </ScrollView>

                    </View>
                    {groupList.map((items, i) => (
                        <View key={i}>
                            {items.subList.length !== 0 && (
                                <Card containerStyle={styles.listCard}>
                                    <View>
                                        <View style={styles.listItemHeader}>
                                            <View style={styles.listItemHeaderItem}>
                                                <Text style={styles.listItemHeaderTitle}>{items.woodType}</Text>
                                                <Text style={styles.listItemHeaderWood}
                                                      onPress={() => toggleOverlay(i)}>Wood
                                                    List</Text>
                                            </View>
                                            <Divider style={{marginVertical: 5}}/>
                                            {/*<ScrollView horizontal={true}>*/}
                                            {/*    <View style={{flexDirection: 'column'}}>*/}
                                            {/*        <View style={{flexDirection: 'row'}}>*/}
                                            {/*            /!*<Text*!/*/}
                                            {/*            /!*    style={[styles.listItemHeaderItemTitle, {width: 100}]}>දිග</Text>*!/*/}
                                            {/*            /!*<Text*!/*/}
                                            {/*            /!*    style={[styles.listItemHeaderItemTitle, {width: 100}]}>වට</Text>*!/*/}
                                            {/*            <Text style={[styles.listItemHeaderItemTitle, {width: 150}]}>Cubic*/}
                                            {/*                ප්‍රමාණය</Text>*/}
                                            {/*            <Text style={[styles.listItemHeaderItemTitle, {width: 100}]}>ඒකක*/}
                                            {/*                මිල</Text>*/}
                                            {/*            <Text*/}
                                            {/*                style={[styles.listItemHeaderItemTitle, {width: 150}]}>වටිනාකම</Text>*/}
                                            {/*        </View>*/}

                                            {/*        /!*<View style={styles.listItemBody}>*!/*/}
                                            {/*        <View style={{flexDirection: 'row'}}>*/}
                                            {/*            /!*<Text*!/*/}
                                            {/*            /!*    style={[styles.listItemBodyItemText, {width: 100}]}>{tableTotalValues(items.subList).totalLength}</Text>*!/*/}
                                            {/*            /!*<Text*!/*/}
                                            {/*            /!*    style={[styles.listItemBodyItemText, {width: 100}]}>{tableTotalValues(items.subList).totalCircumference}</Text>*!/*/}
                                            {/*            <Text*/}
                                            {/*                style={[styles.listItemBodyItemText, {width: 150}]}>{tableTotalValues(items.subList).totalCubic}</Text>*/}
                                            {/*            <Text*/}
                                            {/*                style={[styles.listItemBodyItemText, {width: 100}]}>{tableTotalValues(items.subList).totalUnits}</Text>*/}
                                            {/*            <Text*/}
                                            {/*                style={[styles.listItemBodyItemText, {width: 150}]}>{tableTotalValues(items.subList).totalAmounts}</Text>*/}
                                            {/*        </View>*/}
                                            {/*    </View>*/}

                                            {/*    /!*</View>*!/*/}
                                            {/*</ScrollView>*/}

                                            <View style={styles.listItemHeaderItem}>
                                                <Text style={[styles.listItemHeaderItemTitle, {width: '35%'}]}>Cubic
                                                    ප්‍රමාණය</Text>
                                                <Text style={[styles.listItemHeaderItemTitle, {width: '30%'}]}>ඒකක
                                                    මිල</Text>
                                                <Text
                                                    style={[styles.listItemHeaderItemTitle, {width: '35%'}]}>වටිනාකම</Text>
                                            </View>
                                            <View style={styles.listItemBody}>
                                                <View style={styles.listItemBodyItem}>
                                                    <Text
                                                        style={[styles.listItemBodyItemText, {width: '35%'}]}>{tableTotalValues(items.subList).totalCubic}</Text>
                                                    <Text
                                                        style={[styles.listItemBodyItemText, {width: '30%'}]}>{tableTotalValues(items.subList).totalUnits}</Text>
                                                    <Text
                                                        style={[styles.listItemBodyItemText, {width: '35%'}]}>{tableTotalValues(items.subList).totalAmounts}</Text>
                                                </View>
                                            </View>

                                        </View>
                                    </View>

                                </Card>
                            )}

                            <Overlay
                                isVisible={visibleIndex === i ? visible : false}
                                overlayStyle={styles.overlay}
                                onBackdropPress={toggleOverlay}>

                                <Card containerStyle={styles.listCard}>
                                    <View style={styles.listItemHeader}>
                                        <View style={styles.listItemHeaderItem}>
                                            <Text style={styles.listItemHeaderTitle}>{items.woodType}</Text>
                                        </View>
                                        <Divider style={{marginVertical: 5}}/>
                                        <ScrollView horizontal={true}>
                                            <View style={{flexDirection: 'column'}}>
                                                <View style={{flexDirection: 'row'}}>
                                                    <Text
                                                        style={[styles.listItemHeaderItemTitle, {width: 100}]}>දිග</Text>
                                                    <Text
                                                        style={[styles.listItemHeaderItemTitle, {width: 100}]}>වට</Text>
                                                    <Text style={[styles.listItemHeaderItemTitle, {width: 150}]}>Cubic
                                                        ප්‍රමාණය</Text>
                                                    <Text style={[styles.listItemHeaderItemTitle, {width: 150}]}>ඒකක
                                                        මිල</Text>
                                                    <Text
                                                        style={[styles.listItemHeaderItemTitle, {width: 150}]}>වටිනාකම</Text>
                                                    <View style={{width: 50}}/>
                                                </View>
                                                <View style={styles.listItemBody}>
                                                    {items.subList.map((item, j) => (
                                                        <View style={styles.listItemBodyItem} key={j}>
                                                            <Text
                                                                style={[styles.listItemBodyItemText, {width: 100}]}>{item.length}</Text>
                                                            <Text
                                                                style={[styles.listItemBodyItemText, {width: 100}]}>{item.circumference}</Text>
                                                            <Text
                                                                style={[styles.listItemBodyItemText, {width: 150}]}>{item.cubicQuantity}</Text>
                                                            <Text
                                                                style={[styles.listItemBodyItemText, {width: 150}]}>{item.unitPrice}</Text>
                                                            <Text
                                                                style={[styles.listItemBodyItemText, {width: 150}]}>{item.totalAmount}</Text>
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
                                                                    onPress={() => removeSelectedObject(i, j, groupList)}
                                                                />
                                                            </View>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        </ScrollView>

                                    </View>


                                </Card>


                            </Overlay>
                        </View>

                    ))}

                </View>
            </ScrollView>
            <Loading isVisible={loading}/>
            <Connecting isVisible={isConnecting}/>
            <AlertMessage
                show={showAlert}
                title={"Do you want to edit wood cost?"}
                onCancelPressed={() => editWoodCostHandler('yes')}
                onConfirmPressed={() => editWoodCostHandler('no')}
                cancelText={'Yes'}
                confirmText={'Not Now'}
            />

            <Overlay
                isVisible={editCostVisible}
                overlayStyle={styles.overlay}
                onBackdropPress={() => setEditCostVisible(!editCostVisible)}>
                <Card containerStyle={styles.overlayCard}>
                    <Card.Title style={{fontSize: 17}}>
                        Wood Cost | දැව පිරිවැය
                    </Card.Title>
                    <Card.Divider style={{backgroundColor: Constants.COLORS.BLACK}}/>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>Old Wood Cost</Text>
                            <Text style={{fontFamily: 'Amalee'}}>පැරණි දැව පිරිවැය</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            value={`Rs. ${selectedWoodCost ? (selectedWoodCost).toFixed(2) : 0}`}
                            disabled={true}
                        />
                    </View>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <View>
                            <Text>New Wood Cost</Text>
                            <Text style={{fontFamily: 'Amalee'}}>නව දැව පිරිවැය</Text>
                        </View>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            placeholder="Enter here..."
                            value={newCost}
                            onChangeText={val => setNewCost(val)}
                            keyboardType='decimal-pad'
                        />
                    </View>
                    <Button
                        title="Edit | සංස්කරණය කරන්න"
                        onPress={() => setShowAlert(true)}
                        containerStyle={styles.buttonContainerStyle}
                        buttonStyle={styles.buttonStyle}
                        titleStyle={styles.buttonTitleStyle}
                    />
                </Card>
            </Overlay>

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
                        printers.map((printer, i) => (
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

            <AlertMessage
                show={showAlert2}
                title={"Do you want to logout?"}
                onCancelPressed={() => {
                    setShowAlert2(false)
                    AsyncStorage.removeItem(StorageStrings.USER_ID);
                    AsyncStorage.removeItem(StorageStrings.ROLE);
                    AsyncStorage.removeItem(StorageStrings.REFRESH_TOKEN);
                    AsyncStorage.removeItem(StorageStrings.ACCESS_TOKEN);
                    AsyncStorage.removeItem(StorageStrings.LOGGED);
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                {name: 'Login'},
                            ],
                        })
                    );
                }}
                onConfirmPressed={() => setShowAlert2(false)}
                cancelText={'Yes'}
                confirmText={'Not Now'}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.COLORS.BACKGROUND_ASH,
        paddingBottom: 100,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        marginTop: 20,
        marginHorizontal: 20,
        color: Constants.COLORS.BLACK,
        fontSize: 28,
        fontWeight: 'bold',
    },
    headerRight: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 20,
        paddingHorizontal: 5,
        borderRadius: 100,
        paddingTop: 2,
        backgroundColor: Constants.COLORS.WHITE,
    },
    headerIcon: {
        color: Constants.COLORS.PRIMARY_BLUE,
    },
    orderCard: {
        borderRadius: 10,
        backgroundColor: Constants.COLORS.BACKGROUND_GREEN,
        borderWidth: 0,
    },
    cardItemConatiner: {
        justifyContent: 'space-between',
        // alignItems: 'center',
        flexDirection: 'row',
        margin: 2
    },
    pickerConatiner: {
        width: '45%',
    },
    inputContainerStyle: {
        backgroundColor: Constants.COLORS.WHITE,
        width: '45%',
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
        alignSelf: 'stretch',
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
    miniButton: {
        width: 50,
        height: 25,
        backgroundColor: Constants.COLORS.PRIMARY_BLUE,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
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
    }
});

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

export default connect(mapStateToProps, mapDispatchToProps)(HomeBase);
