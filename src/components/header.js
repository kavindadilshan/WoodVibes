import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons';

import * as Constants from '../utils/constants';

const Header = ({navigation, title}) => {

    const backOnPress = () => {
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <IconI
                    name='chevron-back'
                    size={37}
                    onPress={backOnPress}
                    style={styles.headerIcon}
                    color={Constants.COLORS.BLACK}
                />
                <Text style={styles.headerText}>{title}</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.COLORS.BACKGROUND_ASH
  },
  headerContainer: {
      marginVertical: 10,
      flexDirection: 'row'
  },
  headerIcon: {
      marginLeft: 10
  },
  headerText: {
      fontSize: 20,
      color: Constants.COLORS.BLACK,
      marginLeft: 10,
      marginTop: 5,
  }
});

export default Header;
