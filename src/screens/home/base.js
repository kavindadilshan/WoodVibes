import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View, Dimensions} from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import {Button, Card, Divider, Input} from 'react-native-elements';

import * as Constants from '../../utils/constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StorageStrings} from "../../utils/constants";
import * as WoodServices from '../../services/wood';
import * as CustomerServices from '../../services/customer';
import * as commonFunc from "../../utils/commonFunc";
import {add} from "react-native-reanimated";

const screenHeight = Dimensions.get("screen").height;
let prev = 0;

const HomeBase = ({navigation}) => {
    const [woodTypeList, setWoodTypeList] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [selectedWoodTypeId, setSelectedWoodTypeId] = useState('');
    const [selectedWoodDetails, setSelectedWoodDetails] = useState({});
    const [length, setLength] = useState();
    const [circumference, setCircumference] = useState();
    const [totalAmount, setTotalAmount] = useState();
    const [discount, setDiscount] = useState();
    const [netAmount, setNetAmount] = useState();
    const [payAmount, setPayAmount] = useState();
    const [editable, setEditable] = useState(false);
    const [addingList, setAddingList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [customerList, setCustomerList] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState();
    const [asChanged,setAsChanged]=useState(false);

    useEffect(async () => {
        await getWoodTypeLists();
        await getAllCustomersList();
    }, [])

    async function getWoodTypeLists() {
        await WoodServices.getAllWoodType()
            .then(response => {
                setWoodTypeList(response.woodTypes);
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
                setSelectedWoodTypeId(id)
            })
            .catch(error => {
                commonFunc.notifyMessage(error.message, 0);
            })
    }

    const addOnPress = () => {
        if (selectedWoodDetails.cost === undefined) {
            commonFunc.notifyMessage('Please Select Wood Type', 2);
        } else if (length === undefined || length === '') {
            commonFunc.notifyMessage('Please Enter Length', 2);
        } else if (circumference === undefined || circumference === '') {
            commonFunc.notifyMessage('Please Enter Circumference', 2);
        } else {
            if (asChanged){
                const cubicQuantity = length * circumference;
                const totalValue = (selectedWoodDetails.cost * cubicQuantity).toFixed();
                setTotalAmount(totalValue.toString());
                setNetAmount(totalValue.toString());
                setEditable(true);
                setDiscount('')
                const list = addingList;
                list.push({
                    cubicQuantity: cubicQuantity,
                    unitPrice: selectedWoodDetails.cost,
                    totalAmount: totalValue
                })
                setAddingList(list);
                setAsChanged(false);
            }
        }
    }

    const profileOnPress = async () => {
        await AsyncStorage.clear();
    }

    const aboutOnPress = () => {
        navigation.navigate('About')
    }

    const onChangeText = val => {
        prev = new Date().getTime();
        setDiscount(val);
        setTimeout(() => {
            let now = new Date().getTime();
            if (now - prev >= 1000) {
                prev = now;
                const netValue = (totalAmount - (totalAmount * val / 100)).toFixed(2);
                setNetAmount(netValue.toString())
            }
        }, 1000)
    }

    const removeSelectedObject = (index, list) => {
        list.splice(index, 1)
        setTableLoading(true)
        setAddingList(list);
        setTimeout(() => {
            setTableLoading(false)
        }, 100)

    }


    return (
        <View style={{flexGrow: 1}}>
            <ScrollView nestedScrollEnabled={true}>
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
                    <View style={{height: screenHeight / 100 * 55}}>
                        <ScrollView contentContainerStyle={{paddingBottom: 10}} nestedScrollEnabled={true}>
                            <Card containerStyle={styles.orderCard}>
                                <Card.Title style={{fontSize: 18}}>New order | නව ඇණවුම්</Card.Title>
                                <Card.Divider style={{backgroundColor: Constants.COLORS.BLACK}}/>
                                <View style={styles.cardItemConatiner}>
                                    <View>
                                        <Text>Customer</Text>
                                        <Text style={{fontFamily: 'Amalee'}}>ගණුදෙනුකරු</Text>
                                    </View>
                                    <View style={styles.pickerConatiner}>
                                        <Picker
                                            mode='dropdown'
                                            dropdownIconColor={Constants.COLORS.BLACK}
                                            selectedValue={selectedLanguage}
                                            onValueChange={(itemValue, itemIndex) =>
                                                setSelectedCustomerId(itemValue)
                                            }>
                                            <Picker.Item label="S.W.Nuwan" value="java"/>
                                            {customerList.map((items, i) => (
                                                <Picker.Item label={items.name} value={items.id} key={i}/>
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                                <View style={styles.cardItemConatiner}>
                                    <View>
                                        <Text>Wood type</Text>
                                        <Text style={{fontFamily: 'Amalee'}}>දැව වර්ගය</Text>
                                    </View>
                                    <View style={styles.pickerConatiner}>
                                        <Picker
                                            mode='dropdown'
                                            dropdownIconColor={Constants.COLORS.BLACK}
                                            selectedValue={selectedLanguage}
                                            onValueChange={(itemValue, itemIndex) =>
                                                getWoodDetailsById(itemValue)
                                            }>
                                            {woodTypeList.map((item, i) => (
                                                <Picker.Item label={item.name} value={item.id} key={i}/>
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                                <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                                    <View>
                                        <Text>Unit price</Text>
                                        <Text style={{fontFamily: 'Amalee'}}>ඒකක මිල</Text>
                                    </View>
                                    <Text
                                        style={{fontSize: 20}}>Rs. {selectedWoodDetails.cost ? selectedWoodDetails.cost : 0}</Text>
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
                                        onChangeText={val => {setLength(val);setAsChanged(true)}}
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
                                        onChangeText={val => {setCircumference(val);setAsChanged(true)}}
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
                                        value={totalAmount}
                                        disabled={true}
                                    />
                                </View>
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
                                            value={netAmount}
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
                                />
                            </Card>
                        </ScrollView>

                    </View>
                    <Card containerStyle={styles.listCard}>
                        <View style={styles.listItemHeader}>
                            <View style={styles.listItemHeaderItem}>
                                <Text style={styles.listItemHeaderTitle}>{selectedWoodDetails.woodType}</Text>
                                <Text style={styles.listItemHeaderWood}>Wood List</Text>
                            </View>
                            <Divider style={{marginVertical: 5}}/>
                            <View style={styles.listItemHeaderItem}>
                                <Text style={[styles.listItemHeaderItemTitle, {width: '35%'}]}>Cubic ප්‍රමාණය</Text>
                                <Text style={[styles.listItemHeaderItemTitle, {width: '25%'}]}>ඒකක මිල</Text>
                                <Text style={[styles.listItemHeaderItemTitle, {width: '30%'}]}>වටිනාකම</Text>
                                <View style={{width: '10%'}}></View>
                            </View>
                        </View>
                        {!tableLoading ? (
                            <View style={styles.listItemBody}>
                                {addingList.map((items, i) => (
                                    <View style={styles.listItemBodyItem} key={i}>
                                        <Text
                                            style={[styles.listItemBodyItemText, {width: '35%'}]}>{items.cubicQuantity}</Text>
                                        <Text
                                            style={[styles.listItemBodyItemText, {width: '25%'}]}>{items.unitPrice}</Text>
                                        <Text
                                            style={[styles.listItemBodyItemText, {width: '30%'}]}>{items.totalAmount}</Text>
                                        <View style={{width: '10%', justifyContent: 'center', alignItems: 'center'}}>
                                            <IconI
                                                name='close-circle-outline'
                                                size={25}
                                                style={styles.listItemCloseIcon}
                                                color={Constants.COLORS.RED}
                                                onPress={() => removeSelectedObject(i, addingList)}
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : null}

                    </Card>

                </View>
            </ScrollView>

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
        alignItems: 'center',
        flexDirection: 'row',
    },
    pickerConatiner: {
        width: '50%',
        marginRight: -18,
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
        borderRadius: 10,
        alignSelf: 'center',
        width: '80%',
        height: 50,
    },
    buttonStyle: {
        height: 50,
        backgroundColor: Constants.COLORS.PRIMARY_COLOR
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
});

export default HomeBase;
