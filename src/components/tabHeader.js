import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons';

import * as Constants from '../utils/constants';

const TabHeader = ({title, rightComponent,backButton,navigation}) => {

    return (
        <View style={styles.container}>
            {backButton&&(
                <IconI
                    name='chevron-back-outline'
                    size={25}
                    color={Constants.COLORS.BLACK}
                    style={{marginRight:10}}
                    onPress={() => navigation.goBack()}
                />
            )}

            <View style={styles.subContainer}>
                <Text style={styles.headerText}>{title}</Text>
                {
                    rightComponent
                }
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Constants.COLORS.BACKGROUND_ASH,
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 15,
        alignItems: 'center',
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width:'100%'
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Constants.COLORS.BLACK,
    }
});

export default TabHeader;
