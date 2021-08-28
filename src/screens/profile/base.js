import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as Constants from '../../utils/constants';
import Header from '../../components/header';

const ProfileBase = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Header navigation={navigation} title='My Profile'/>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Constants.COLORS.BACKGROUND_ASH,
      paddingBottom: 100,
    },
});

export default ProfileBase;
