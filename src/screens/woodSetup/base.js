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
import AlertMessage from "../../components/AlertMessage";
import Loading from "../../components/loading";

const WoodSetupBase = ({navigation}) => {

    const [invoiceList, setInvoiceList] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [loading,setLoading]=useState(false);

    useEffect(async () => {
        setLoading(true);
        await getAllInvoiceList();
    }, [])

    async function getAllInvoiceList() {
        const factoryId = await AsyncStorage.getItem(StorageStrings.FACTORYID);
        await InvoiceServices.getAllInvoice(factoryId)
            .then(response => {
                setInvoiceList(response);
            })
            .catch(error => {
                commonFunc.notifyMessage(error.message, 0);
            })
        setLoading(false);
    }

    async function deleteInvoice(item) {
        switch (item) {
            case 'yes':
                setShowAlert(true);
                break;
            case 'no':
                setShowAlert(false);
                break;
            default:
                break;
        }
    }

    return (
        <View style={styles.container}>
            <TabHeader title='Invoice Details'/>
            <ScrollView contentContainerStyle={{paddingBottom: 10}}>
                {Object.keys(invoiceList).map((item, i) => (
                    <Card containerStyle={styles.listCard} key={i}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 5
                        }}>
                            <Card.Title style={styles.listCardTitle}>
                                Sample Invoice
                            </Card.Title>
                            <Button
                                title="Delete"
                                onPress={()=>setShowAlert(true)}
                                containerStyle={styles.addNewButtonContainerStyle}
                                buttonStyle={styles.addNewButtonStyle}
                                titleStyle={styles.addNewButtonTitleStyle}
                            />
                        </View>
                        <Card.Divider/>
                        <View style={styles.listCardItem}>
                            <Text style={styles.listCardItemHeader}>Total Amount</Text>
                            <Text style={styles.listCardItemDesc}>Rs. {invoiceList[item].totalAmount}</Text>
                        </View>
                        <View style={styles.listCardItem}>
                            <Text style={styles.listCardItemHeader}>Invoice Date</Text>
                            <Text style={styles.listCardItemDesc}>{invoiceList[item].invoiceDate}</Text>
                        </View>
                    </Card>
                ))}

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
        textAlign: 'center',
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
