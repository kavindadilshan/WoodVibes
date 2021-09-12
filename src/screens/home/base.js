import React, {useState, useEffect, Fragment} from 'react';
import {ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity} from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import {Button, Card, Divider, Input, Overlay} from 'react-native-elements';

import * as Constants from '../../utils/constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StorageStrings} from "../../utils/constants";
import * as WoodServices from '../../services/wood';
import * as CustomerServices from '../../services/customer';
import * as InvoiceServices from '../../services/invoice';
import * as commonFunc from "../../utils/commonFunc";
import {add} from "react-native-reanimated";
import Loading from "../../components/loading";
import AlertMessage from "../../components/AlertMessage";
import SearchableDropdown from 'react-native-searchable-dropdown';
import DropDown from "../../components/dropDown";

const screenHeight = Dimensions.get("screen").height;
let prev = 0;

let items = [
    {
        id: 1,
        name: 'JavaScript',
    },
    {
        id: 2,
        name: 'Java',
    },
    {
        id: 3,
        name: 'Ruby',
    },
    {
        id: 4,
        name: 'React Native',
    },
    {
        id: 5,
        name: 'PHP',
    },
    {
        id: 6,
        name: 'Python',
    },
    {
        id: 7,
        name: 'Go',
    },
    {
        id: 8,
        name: 'Swift',
    },
];

const HomeBase = ({navigation}) => {
    const [woodTypeList, setWoodTypeList] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [selectedWoodTypeId, setSelectedWoodTypeId] = useState('');
    const [selectedWoodDetails, setSelectedWoodDetails] = useState({});
    const [length, setLength] = useState();
    const [circumference, setCircumference] = useState();
    const [totalAmount, setTotalAmount] = useState();
    const [discount, setDiscount] = useState('0');
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
    const [editCostVisible, setEditCostVisible] = useState(false);
    const [newCost, setNewCost] = useState();
    const [selectedCustomerList, setSelectedCustomerList] = useState([]);
    const [selectedWoodTypeList, setSelectedWoodTypeList] = useState([]);
    const [selectedWoodCost, setSelectedWoodCost] = useState();

    useEffect(async () => {
        await getWoodTypeLists();
        await getAllCustomersList();
    }, [])

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
                commonFunc.notifyMessage(error.message, 0);
            })
    }

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
                commonFunc.notifyMessage(error.message, 0);
            })
    }

    async function saveInvoiceHandler() {
        let list = [];
        addingList.map((item) => {
            list.push({
                woodMeasurementCostId: item.woodMeasurementCostId,
                cubicFeet: Number(item.cubicQuantity),
                amount: Number(item.totalAmount)
            })
        })

        const factoryId = await AsyncStorage.getItem(StorageStrings.FACTORYID);
        const data = {
            customerId: selectedCustomerId,
            factoryId: Number(factoryId),
            totalAmount: Number(totalAmount),
            discount: Number(discount),
            payAmount: Number(payAmount),
            amount: Number(payAmount),
            invoiceDetails: list
        }
        await InvoiceServices.saveInvoice(data)
            .then(commonFunc.notifyMessage('Invoice saved successfully!', 1))
            .catch(error => {
                commonFunc.notifyMessage(error.message, 0);
            })
    }

    const addOnPress = () => {
        if (selectedCustomerId ===undefined){
            commonFunc.notifyMessage('Please Select Customer', 2);
        }else if (selectedWoodCost === undefined) {
            commonFunc.notifyMessage('Please Select Wood Type', 2);
        } else if (length === undefined || length === '') {
            commonFunc.notifyMessage('Please Enter Length', 2);
        } else if (circumference === undefined || circumference === '') {
            commonFunc.notifyMessage('Please Enter Circumference', 2);
        } else {
            if (asChanged) {
                const cubicQuantity = (length * (circumference / 12));
                const totalValue = (selectedWoodCost * cubicQuantity).toFixed();
                setTotalAmount(totalValue.toString());
                setNetAmount(totalValue.toString());
                setEditable(true);

                addingList.push({
                    woodMeasurementCostId: selectedWoodTypeId,
                    woodType: selectedWoodDetails.name,
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

        console.log(groupArrays);
    };

    const profileOnPress = async () => {
        await AsyncStorage.clear();
    }

    const aboutOnPress = () => {
        navigation.navigate('About')
    }

    const onChangeText = val => {
        setDiscount(val);
        const netValue = (totalAmount - (totalAmount * val / 100)).toFixed(2);
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
        for (let i = 0; i < array.length; i++) {
            totalCubic += Number(array[i].cubicQuantity);
            totalUnits = array[i].unitPrice;
            totalAmounts += Number(array[i].totalAmount)
        }
        return {totalCubic: totalCubic.toFixed(2), totalUnits: totalUnits, totalAmounts: totalAmounts.toFixed(2)}
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
                        setWoodTypeList([])
                        setSelectedWoodTypeList({})
                        setLoading(false);
                        commonFunc.notifyMessage('Wood Cost Edit successfully', 1);
                        setSelectedWoodCost(Number(newCost));
                        await getWoodTypeLists();
                    })
                    .catch(error => {
                        setLoading(false);
                        commonFunc.notifyMessage(error.message, 0);
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


    return (
        <View style={{flexGrow: 1}}>

            <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>{Constants.APP_NAME}</Text>
                        <View style={styles.headerRight}>
                            <IconI
                                name='person-circle-outline'
                                size={35}
                                onPress={profileOnPress}
                                style={styles.headerIcon}
                                color={Constants.COLORS.PLACEHOLDER_ASH}
                            />
                            <IconI
                                name='information-circle-outline'
                                size={37}
                                onPress={aboutOnPress}
                                style={[styles.headerIcon, {marginLeft: 10}]}
                                color={Constants.COLORS.PLACEHOLDER_ASH}
                            />
                        </View>
                    </View>
                    <View style={{height: addingList.length !== 0 ? screenHeight / 100 * 60 : '100%'}}>
                        <ScrollView contentContainerStyle={{paddingBottom: 10}} nestedScrollEnabled={true}
                                    keyboardShouldPersistTaps="handled">
                            <Card containerStyle={styles.orderCard}>
                                <Card.Title style={{fontSize: 18}}>New order | නව ඇණවුම්</Card.Title>
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
                                        value={`Rs. ${totalAmount}`}
                                        disabled={true}
                                    />
                                </View>
                                <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                                    <View>
                                        <Text>Discount (%)</Text>
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
                                            value={`Rs. ${netAmount}`}
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
                                            <View style={styles.listItemHeaderItem}>
                                                <Text style={[styles.listItemHeaderItemTitle, {width: '35%'}]}>Cubic
                                                    ප්‍රමාණය</Text>
                                                <Text style={[styles.listItemHeaderItemTitle, {width: '25%'}]}>ඒකක
                                                    මිල</Text>
                                                <Text
                                                    style={[styles.listItemHeaderItemTitle, {width: '40%'}]}>වටිනාකම</Text>
                                                <View style={{width: '10%'}}></View>
                                            </View>
                                        </View>
                                        <View style={styles.listItemBody}>
                                            <View style={styles.listItemBodyItem}>
                                                <Text
                                                    style={[styles.listItemBodyItemText, {width: '35%'}]}>{tableTotalValues(items.subList).totalCubic}</Text>
                                                <Text
                                                    style={[styles.listItemBodyItemText, {width: '25%'}]}>{tableTotalValues(items.subList).totalUnits}</Text>
                                                <Text
                                                    style={[styles.listItemBodyItemText, {width: '40%'}]}>{tableTotalValues(items.subList).totalAmounts}</Text>
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
                                        <View style={styles.listItemHeaderItem}>
                                            <Text style={[styles.listItemHeaderItemTitle, {width: '35%'}]}>Cubic
                                                ප්‍රමාණය</Text>
                                            <Text style={[styles.listItemHeaderItemTitle, {width: '25%'}]}>ඒකක
                                                මිල</Text>
                                            <Text
                                                style={[styles.listItemHeaderItemTitle, {width: '30%'}]}>වටිනාකම</Text>
                                            <View style={{width: '10%'}}></View>
                                        </View>
                                    </View>

                                    {/*{!tableLoading && (*/}
                                    <View style={styles.listItemBody}>
                                        {items.subList.map((item, j) => (
                                            <View style={styles.listItemBodyItem} key={j}>
                                                <Text
                                                    style={[styles.listItemBodyItemText, {width: '35%'}]}>{item.cubicQuantity}</Text>
                                                <Text
                                                    style={[styles.listItemBodyItemText, {width: '25%'}]}>{item.unitPrice}</Text>
                                                <Text
                                                    style={[styles.listItemBodyItemText, {width: '30%'}]}>{item.totalAmount}</Text>
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
                                    {/*)}*/}


                                </Card>


                            </Overlay>
                        </View>

                    ))}


                </View>
            </ScrollView>
            <Loading isVisible={loading}/>
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
        backgroundColor: Constants.COLORS.BACKGROUND_BLUE,
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
        backgroundColor: Constants.COLORS.BACKGROUND_BLUE,
        borderWidth: 0,
        marginBottom: 15,
    },
    overlay: {
        borderRadius: 10,
        backgroundColor:'transparent'
    },
});

export default HomeBase;
