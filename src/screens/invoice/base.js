import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View, Appearance} from 'react-native';
import {Button, Card, Input, Overlay} from 'react-native-elements';

import * as Constants from '../../utils/constants';
import TabHeader from '../../components/tabHeader';
import * as InvoiceServices from '../../services/invoice';
import * as OperatorService from "../../services/operators";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StorageStrings} from "../../utils/constants";
import * as CustomerServices from "../../services/customer";
import * as commonFunc from "../../utils/commonFunc";
import AlertMessage from "../../components/AlertMessage";
import Loading from "../../components/loading";
import FilterButton from "../../components/filterButton";
import gif from "../../resources/gif/loading.gif";

import {Picker} from "@react-native-picker/picker";

let asDarkMode = Appearance.getColorScheme() === 'dark'

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 0;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

let userRole;
const InvoiceBase = ({navigation}) => {

    const [invoiceList, setInvoiceList] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState();
    const [page, setPage] = useState(0);
    const [searchKey, setSearchKey] = useState('');
    const [miniLoader, setMiniLoader] = useState(false);
    const [searchOverlay, setSearchOverlay] = useState(false);
    const [searchType, setSearchType] = useState('');
    const [finished, setFinished] = useState(true);
    const [role, setRole] = useState();

    useEffect(() => {
        navigation.addListener('focus', async () => {
            setInvoiceList([]);
            setPage(0);
            setFinished(true);
            setLoading(true);
            setMiniLoader(false);
            setRole(await AsyncStorage.getItem(StorageStrings.ROLE));
            userRole = await AsyncStorage.getItem(StorageStrings.ROLE);
            await getAllInvoiceList(0, [], true);
        });
    }, [navigation])

    async function getAllInvoiceList(pageNo, isEmpty, first) {
        console.log(pageNo)
        const data = {
            factoryId: await AsyncStorage.getItem(StorageStrings.FACTORYID),
            page: pageNo,
            userId: await AsyncStorage.getItem(StorageStrings.USER_ID)
        }

        let body;
        if (searchType === 'name') {
            body = {
                name: searchKey
            }
        } else if (searchType === 'nic') {
            body = {
                nic: searchKey
            }
        } else {
            body = {
                invoiceNo: searchKey
            }
        }

        if (userRole === 'ROLE_ADMIN') {
            await InvoiceServices.getAllInvoice(data, first === undefined ? body : null)
                .then(response => {
                    let list;
                    if (isEmpty) {
                        list = isEmpty
                    } else {
                        list = invoiceList;
                    }

                    response.invoiceList.map(item => {
                        list.push({
                            id: item.id,
                            customerId: item.customerId,
                            totalAmount: item.totalAmount,
                            invoiceDate: item.invoiceDate,
                            invoiceNo: item.invoiceNo
                        })
                    })
                    setInvoiceList(list);
                    if (pageNo + 1 >= response.pageCount) {
                        setFinished(true);
                    } else {
                        setFinished(false);
                    }

                })
                .catch(error => {
                    commonFunc.notifyMessage('You connection was interrupted', 0);
                })
        } else {
            await OperatorService.operatorInvoice(data, first === undefined ? body : null)
                .then(response => {
                    let list;
                    if (isEmpty) {
                        list = isEmpty
                    } else {
                        list = invoiceList;
                    }

                    response.invoiceList.map(item => {
                        list.push({
                            id: item.id,
                            customerId: item.customerId,
                            totalAmount: item.totalAmount,
                            invoiceDate: item.invoiceDate,
                            invoiceNo: item.invoiceNo
                        })
                    })
                    setInvoiceList(list);
                    if (pageNo + 1 >= response.pageCount) {
                        setFinished(true);
                    } else {
                        setFinished(false);
                    }
                })
                .catch(error => {
                    commonFunc.notifyMessage('You connection was interrupted', 0);
                })
        }
        setLoading(false);
        setMiniLoader(false);
    }

    async function deleteInvoice(item) {
        switch (item) {
            case 'yes':
                setShowAlert(false);
                setLoading(true);
                await InvoiceServices.deleteInvoice(selectedInvoice)
                    .then(async response => {
                        commonFunc.notifyMessage('Invoice delete successfully', 1);
                        setInvoiceList([]);
                        await getAllInvoiceList(0, []);
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

    const toggleOverlay = () => {
        setSearchOverlay(false);
        setSearchKey('');
        setSearchType('');
    };

    const searchItem = async () => {
        setSearchOverlay(false);
        setInvoiceList([])
        // setSearchKey('');
        // setSearchType('');
        setPage(0);
        setMiniLoader(true)
        await getAllInvoiceList(0, []);
    }

    return (
        <View style={styles.container}>
            <TabHeader title='Invoice'/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={({nativeEvent}) => {
                    if (isCloseToBottom(nativeEvent)) {
                        if (!finished) {
                            console.log('scroll')
                            setMiniLoader(!miniLoader)
                            setPage(page + 1);
                            getAllInvoiceList(page + 1);
                        }
                    }
                }}

            >
                <FilterButton onPress={() => setSearchOverlay(true)}/>
                {invoiceList && Object.keys(invoiceList).map((item, i) => (
                    invoiceList[item].id && (
                        <Card containerStyle={styles.listCard} key={i}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 5
                            }}>
                                <Card.Title style={styles.listCardTitle}>
                                    {invoiceList[item].invoiceNo}
                                </Card.Title>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Button
                                        title="Delete"
                                        onPress={() => {
                                            setShowAlert(true);
                                            setSelectedInvoice(invoiceList[item].id)
                                        }}
                                        containerStyle={styles.addNewButtonContainerStyle}
                                        buttonStyle={styles.addNewButtonStyle}
                                        titleStyle={styles.addNewButtonTitleStyle}
                                    />
                                    <Button
                                        title="View"
                                        onPress={() => navigation.navigate('InvoiceDetails', {
                                            invoiceId: invoiceList[item].id,
                                            invoiceNo: invoiceList[item].invoiceNo
                                        })}
                                        containerStyle={styles.addNewButtonContainerStyle}
                                        buttonStyle={{
                                            ...styles.addNewButtonStyle,
                                            backgroundColor: Constants.COLORS.DARK_GREEN,
                                            marginLeft: 5
                                        }}
                                        titleStyle={styles.addNewButtonTitleStyle}
                                    />
                                </View>

                            </View>
                            <Card.Divider/>
                            <View style={styles.listCardItem}>
                                <View style={{flexDirection: 'column'}}>
                                    <Text style={styles.listCardItemHeader}>Total Amount</Text>
                                    <Text style={{fontSize: 10}}> මුළු මුදල </Text>
                                </View>
                                <Text style={styles.listCardItemDesc}>Rs. {invoiceList[item].totalAmount}</Text>
                            </View>
                            <View style={styles.listCardItem}>
                                <View style={{flexDirection: 'column', marginTop: 10}}>
                                    <Text style={styles.listCardItemHeader}>Invoice Date</Text>
                                    <Text style={{fontSize: 10}}> අවසාන ඇණවුම </Text>
                                </View>
                                <Text style={styles.listCardItemDesc}>{invoiceList[item].invoiceDate}</Text>
                            </View>
                        </Card>
                    )

                ))}

                {
                    miniLoader ?
                        <View style={styles.gifHolder}>
                            <Image source={gif} style={styles.gif}/>
                        </View>
                        : null
                }

                {!miniLoader && invoiceList.length === 0 && (
                    <Text style={{textAlign: 'center', marginTop: '5%'}}>No Results found</Text>)}

            </ScrollView>
            <Loading isVisible={loading}/>
            <AlertMessage
                show={showAlert}
                title={"Do you want to delete this record?"}
                onCancelPressed={() => deleteInvoice('yes')}
                onConfirmPressed={() => deleteInvoice('no')}
                cancelText={'Yes'}
                confirmText={'Not Now'}
            />
            <Overlay
                isVisible={searchOverlay}
                overlayStyle={styles.overlay}
                onBackdropPress={toggleOverlay}>
                <Card containerStyle={styles.overlayCard}>
                    <Card.Title style={{fontSize: 17}}>
                        Filter | පෙරහන
                    </Card.Title>
                    <Card.Divider style={{backgroundColor: Constants.COLORS.BLACK}}/>
                    <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
                        <Picker
                            style={{width: '45%', color: Constants.COLORS.BLACK}}
                            color={'red'}
                            mode='dropdown'
                            selectedValue={searchType}
                            dropdownIconColor={Constants.COLORS.BLACK}
                            onValueChange={(itemValue, itemIndex) => {
                                setSearchType(itemValue);
                                if (itemValue === 'invoice') {
                                    setSearchKey('IN-')
                                } else {
                                    setSearchKey('')
                                }
                            }}>
                            <Picker.Item color={asDarkMode ? 'white' : 'black'} label={'Select Type'} value={''}/>
                            <Picker.Item color={asDarkMode ? 'white' : 'black'} label={'NIC'} value={'nic'}/>
                            <Picker.Item color={asDarkMode ? 'white' : 'black'} label={'Name'} value={'name'}/>
                            <Picker.Item color={asDarkMode ? 'white' : 'black'} label={'Invoice No'} value={'invoice'}/>
                        </Picker>
                        <Input
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            placeholder="Enter here..."
                            value={searchKey}
                            onChangeText={val => {
                                if (searchType !== 'invoice') {
                                    setSearchKey(val)
                                } else {
                                    if (/^\d+$/.test(val.toString().slice(3))) {
                                        if (val.length <= 2) {
                                            val = searchKey.replace(/^IN-+/, 'IN-');
                                        }
                                        setSearchKey(val)
                                    }
                                }
                            }}
                            keyboardType={searchType === 'invoice' ? 'number-pad' : 'default'}
                        />
                    </View>
                    <Button
                        title="Search | සොයන්න"
                        onPress={searchItem}
                        containerStyle={styles.buttonContainerStyle}
                        buttonStyle={styles.buttonStyle}
                        titleStyle={styles.buttonTitleStyle}
                        disabled={searchType === ''}
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
        marginBottom: 5
    },
    addNewButtonContainerStyle: {
        height: 40,
    },
    addNewButtonStyle: {
        height: 40,
        paddingHorizontal: 20,
        backgroundColor: Constants.COLORS.PRIMARY_COLOR,
        borderRadius: 10,
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
        textAlign: 'center',
        color: Constants.COLORS.PRIMARY_COLOR,
    },
    listCardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        alignItems: 'center'
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
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
        borderWidth: 0,
        width: '100%'
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
    gifHolder: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gif: {
        width: 75,
        height: 75,
    },
});

export default InvoiceBase;
