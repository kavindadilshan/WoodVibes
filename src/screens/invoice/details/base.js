import React, {Component} from 'react';
import {ScrollView, StyleSheet, View} from "react-native";
import TabHeader from "../../../components/tabHeader";
import * as Constants from "../../../utils/constants";
import {Card} from "react-native-elements";

const InvoiceDetailsBase = ({navigation}) => {
    return (
        <View style={styles.container}>
            <TabHeader title='Invoice Details' backButton={true} navigation={navigation}/>
            <ScrollView contentContainerStyle={{paddingBottom: 10}}>
                <Card containerStyle={styles.orderCard}>
                    <Card.Title style={{fontSize: 18}}>Invoice Details | ඉන්වොයිසි විස්තර</Card.Title>
                    <Card.Divider style={{backgroundColor: Constants.COLORS.BLACK}}/>
                </Card>
            </ScrollView>
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
})
export default InvoiceDetailsBase;
