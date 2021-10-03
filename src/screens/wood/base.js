import React, {useEffect, useState} from "react";
import {View, StyleSheet, Text, ScrollView} from "react-native";
import TabHeader from "../../components/tabHeader";
import {Button, Card} from "react-native-elements";
import * as Constants from "../../utils/constants";
import * as Constance from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StorageStrings} from "../../utils/constants";
import * as WoodServices from "../../services/wood";
import * as commonFunc from "../../utils/commonFunc";
import Loading from "../../components/loading";

const WoodBase = ({navigation}) => {
    const [woodTypeList, setWoodTypeList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        navigation.addListener('focus', async () => {
            setLoading(true)
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
    )

    return (
        <View style={styles.container}>
            <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                <TabHeader title="Wood Cost" rightComponent={headerRightBtn}/>
                {woodTypeList.map((item, i) => (
                    <Card containerStyle={styles.listCard}>
                        <Card.Title style={styles.listCardTitle}>
                            {item.name}
                        </Card.Title>
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
                <Loading isVisible={loading}/>
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
