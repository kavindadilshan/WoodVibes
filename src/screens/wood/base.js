import React, {useEffect, useState} from "react";
import {View, StyleSheet, Text, ScrollView} from "react-native";
import TabHeader from "../../components/tabHeader";
import {Button, Card, Input, Overlay} from "react-native-elements";
import * as Constants from "../../utils/constants";
import * as Constance from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StorageStrings} from "../../utils/constants";
import * as WoodServices from "../../services/wood";
import * as commonFunc from "../../utils/commonFunc";
import Loading from "../../components/loading";
import AlertMessage from "../../components/AlertMessage";
import * as InvoiceServices from "../../services/invoice";

const WoodBase = ({navigation}) => {
    const [woodTypeList, setWoodTypeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible,setVisible]=useState(false);
    const [newCost,setNewCost]=useState('');
    const [oldCost,setOldCost]=useState('');
    const [showAlert,setShowAlert]=useState(false);
    const [selectedId,setSelectedId]=useState();

    useEffect(async () => {
        navigation.addListener('focus', async () => {
            setLoading(true)
            setWoodTypeList([]);
            await getWoodTypeLists();
        });
    }, [navigation])

    async function getWoodTypeLists() {
        const factoryId = await AsyncStorage.getItem(StorageStrings.FACTORYID);
        await WoodServices.getAllWoodCost(factoryId)
            .then(response => {
                const list = [];
                response.woodMeasurementCosts.map((items) => {
                    list.push({
                        id: items.id,
                        cost: items.cost,
                        name: items.woodType,
                        unit: items.unit
                    })
                })
                setWoodTypeList(list);
                setLoading(false)
            })
            .catch(error => {
                commonFunc.notifyMessage('You connection was interrupted', 0);
            })
    }

    const headerRightBtn = (
        <Button
            title="Add New"
            // onPress={() => {
            //     setVisible(true);
            //     setName('');
            //     setIdNumber('');
            //     setMobile('');
            // }}
            containerStyle={styles.addNewButtonContainerStyle}
            buttonStyle={styles.addNewButtonStyle}
            titleStyle={styles.addNewButtonTitleStyle}
        />
    );

    const toggleOverlay = () => {
        setVisible(!visible);
        setNewCost('');
    };

    async function editCost(item) {
        switch (item) {
            case 'yes':
                setShowAlert(false);
                setLoading(true);
                const data = {
                    id: selectedId,
                    cost: newCost
                }
                await WoodServices.editCostById(data)
                    .then(async response => {
                        setWoodTypeList([])
                        setLoading(false);
                        setVisible(false);
                        commonFunc.notifyMessage('Wood Cost Edit successfully', 1);
                        await getWoodTypeLists();
                    })
                    .catch(error => {
                        setLoading(false);
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

    return (
        <View style={styles.container}>
            <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                <TabHeader title="Wood Cost"/>
                {woodTypeList.map((item, i) => (
                    <Card containerStyle={styles.listCard} key={i}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 5
                        }}>
                            <Card.Title style={styles.listCardTitle}>
                                {item.name}
                            </Card.Title>
                            <Button
                                title="Edit"
                                onPress={() => {
                                    setSelectedId(item.id);
                                    setOldCost(item.cost);
                                    setVisible(!visible);
                                }}
                                containerStyle={styles.addNewButtonContainerStyle}
                                buttonStyle={styles.addNewButtonStyle}
                                titleStyle={styles.addNewButtonTitleStyle}
                            />
                        </View>
                        <Card.Divider/>
                        <View style={styles.listCardItem}>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={styles.listCardItemHeader}>cost </Text>
                                <Text style={{fontSize: 10}}> පිරිවැය </Text>
                            </View>
                            <Text style={styles.listCardItemDesc}>Rs.{item.cost}</Text>
                        </View>
                        <View style={styles.listCardItem}>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={styles.listCardItemHeader}>Unit </Text>
                                <Text style={{fontSize: 10}}> ඒකකය </Text>
                            </View>
                            <Text style={styles.listCardItemDesc}>{item.unit}</Text>
                        </View>
                    </Card>
                ))}
                <Overlay
                    isVisible={visible}
                    overlayStyle={styles.overlay}
                    onBackdropPress={toggleOverlay}>
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
                                value={`Rs. ${oldCost ? (oldCost).toFixed(2) : 0}`}
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
                <Loading isVisible={loading}/>
                <AlertMessage
                    show={showAlert}
                    title={"Do you want to delete this record?"}
                    onCancelPressed={() => editCost('yes')}
                    onConfirmPressed={() => editCost('no')}
                    cancelText={'Yes'}
                    confirmText={'Not Now'}
                />
                {woodTypeList.length === 0 && (
                    <Text style={{textAlign: 'center', marginTop: '5%'}}>No Results found</Text>)}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.COLORS.BACKGROUND_ASH,
        paddingBottom:10
    },
    addNewButtonContainerStyle: {
        height: 40,
    },
    addNewButtonStyle: {
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
    listCard: {
        borderRadius: 10,
        borderWidth: 0,
    },
    listCardTitle: {
        fontSize: 16,
        textAlign: 'left',
        color: Constants.COLORS.PRIMARY_COLOR,
    },
    listCardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
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
        backgroundColor: Constants.COLORS.BACKGROUND_GREEN,
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

export default WoodBase;
