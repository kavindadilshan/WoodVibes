import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons';

import * as Constants from '../utils/constants';

const TabHeader = ({title, rightComponent}) => {

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{title}</Text>
            {
                rightComponent
            }
        </View>
    )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.COLORS.BACKGROUND_ASH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 15,
    alignItems: 'center'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Constants.COLORS.BLACK,
  }
});

export default TabHeader;
