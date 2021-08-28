import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons';

import * as Constants from '../../utils/constants';
import Header from '../../components/header';

const AboutBase = ({navigation}) => {

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title='About Us'/>
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

export default AboutBase;
