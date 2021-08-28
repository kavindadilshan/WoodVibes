import React, { useState } from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { Button, Card, Divider, Input } from 'react-native-elements';

import * as Constants from '../../utils/constants';

const HomeBase = ({navigation}) => {

  const [selectedLanguage, setSelectedLanguage] = useState();

  const addOnPress = () => {
    // do logic
  }

  const profileOnPress = () => {
    navigation.navigate('Profile')
  }

  const aboutOnPress = () => {
    navigation.navigate('About')
  }

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{Constants.APP_NAME}</Text>
          <View style={styles.headerRight}>
            <IconI
              name='person-circle-outline'
              size={35}
              onPress={profileOnPress}
              style={styles.headerIcon}
              color={Constants.COLORS.PLACEHOLDER_ASH}
            />
            <IconI
              name='information-circle-outline'
              size={37}
              onPress={aboutOnPress}
              style={[styles.headerIcon, { marginLeft: 10 }]}
              color={Constants.COLORS.PLACEHOLDER_ASH}
            />
          </View>
        </View>
        <Card containerStyle={styles.orderCard}>
          <Card.Title style={{ fontSize: 18}}>New order | නව ඇණවුම්</Card.Title>
          <Card.Divider style={{ backgroundColor: Constants.COLORS.BLACK }}/>
          <View style={styles.cardItemConatiner}>
            <View>
              <Text>Customer</Text>
              <Text style={{ fontFamily: 'Amalee'}}>ගණුදෙනුකරු</Text>
            </View>
            <View style={styles.pickerConatiner}>
              <Picker
                mode='dropdown'
                dropdownIconColor={Constants.COLORS.BLACK}
                selectedValue={selectedLanguage}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedLanguage(itemValue)
                }>
                <Picker.Item label="S.W.Nuwan" value="java" />
                <Picker.Item label="J.J.Gamage" value="js" />
              </Picker>
            </View>
          </View>
          <View style={styles.cardItemConatiner}>
            <View>
              <Text>Wood type</Text>
              <Text style={{ fontFamily: 'Amalee'}}>දැව වර්ගය</Text>
            </View>
            <View style={styles.pickerConatiner}>
              <Picker
                mode='dropdown'
                dropdownIconColor={Constants.COLORS.BLACK}
                selectedValue={selectedLanguage}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedLanguage(itemValue)
                }>
                <Picker.Item label="Teak wood" value="java" />
                <Picker.Item label="Jack wood" value="js" />
              </Picker>
            </View>
          </View>
          <View style={[styles.cardItemConatiner, { marginBottom: 10}]}>
            <View>
              <Text>Unit price</Text>
              <Text style={{ fontFamily: 'Amalee'}}>ඒකක මිල</Text>
            </View>
            <Text style={{ fontSize: 20}}>Rs.100.99</Text>
          </View>
          <View style={[styles.cardItemConatiner, { marginBottom: 10}]}>
            <View>
              <Text>Length (feet)</Text>
              <Text style={{ fontFamily: 'Amalee'}}>දිග (අඩි)</Text>
            </View>
            <Input
              containerStyle={styles.inputContainerStyle}
              inputContainerStyle={{borderBottomWidth:0}}
              textAlign={'right'}
              placeholder='Enter here...'
              keyboardType='decimal-pad'
            />
          </View>
          <View style={[styles.cardItemConatiner, { marginBottom: 10}]}>
            <View>
              <Text>Circum ference (inches)</Text>
              <Text style={{ fontFamily: 'Amalee'}}>වට ප්‍රමාණය (අඟල්)</Text>
            </View>
            <Input
              containerStyle={styles.inputContainerStyle}
              inputContainerStyle={{borderBottomWidth:0}}
              textAlign={'right'}
              placeholder='Enter here...'
              keyboardType='decimal-pad'
            />
          </View>
          <View style={styles.cardTotalConatiner}>
            <View>
              <Text style={{ color: Constants.COLORS.BLACK, fontWeight: 'bold' }}>Total amount</Text>
              <Text style={{ fontFamily: 'Amalee', color: Constants.COLORS.BLACK, fontWeight: 'bold' }}>මුලු වටිනාකම</Text>
            </View>
            <Text style={{ fontSize: 30, color: Constants.COLORS.BLACK, fontWeight: 'bold' }}>Rs.12456.99</Text>
          </View>
          <Button
            title="Add | එකතු කරන්න"
            onPress={addOnPress}
            containerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
          />
        </Card>
        <Card containerStyle={styles.listCard}>
          <View style={styles.listItemHeader}>
            <View style={styles.listItemHeaderItem}>
              <Text style={styles.listItemHeaderTitle}>J.J.Gamage</Text>
              <Text style={styles.listItemHeaderWood}>Teak wood</Text>
            </View>
            <Divider style={{ marginVertical: 5 }} />
            <View style={styles.listItemHeaderItem}>
              <Text style={[styles.listItemHeaderItemTitle, { width: '15%'}]}>දිග</Text>
              <Text style={[styles.listItemHeaderItemTitle, { width: '20%'}]}>වට</Text>
              <Text style={[styles.listItemHeaderItemTitle, { width: '25%'}]}>ඒකක මිල</Text>
              <Text style={[styles.listItemHeaderItemTitle, { width: '30%'}]}>වටිනාකම</Text>
              <View style={{width: '10%'}}></View>
            </View>
          </View>
          <View style={styles.listItemBody}>
            <View style={styles.listItemBodyItem}>
              <Text style={[styles.listItemBodyItemText, { width: '15%'}]}>12.45</Text>
              <Text style={[styles.listItemBodyItemText, { width: '20%'}]}>234.45</Text>
              <Text style={[styles.listItemBodyItemText, { width: '25%'}]}>100.99</Text>
              <Text style={[styles.listItemBodyItemText, { width: '30%'}]}>54353.99</Text>
              <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center'}}>
                <IconI
                  name='close-circle-outline'
                  size={25}
                  style={styles.listItemCloseIcon}
                  color={Constants.COLORS.RED}
                />
              </View>
            </View>
            <View style={styles.listItemBodyItem}>
              <Text style={[styles.listItemBodyItemText, { width: '15%'}]}>12.45</Text>
              <Text style={[styles.listItemBodyItemText, { width: '20%'}]}>234.45</Text>
              <Text style={[styles.listItemBodyItemText, { width: '25%'}]}>100.99</Text>
              <Text style={[styles.listItemBodyItemText, { width: '30%'}]}>54353.99</Text>
              <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center'}}>
                <IconI
                  name='close-circle-outline'
                  size={25}
                  style={styles.listItemCloseIcon}
                  color={Constants.COLORS.RED}
                />
              </View>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.COLORS.BACKGROUND_ASH,
    paddingBottom: 100,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    marginTop: 20,
    marginHorizontal: 20,
    color: Constants.COLORS.BLACK,
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 5,
    borderRadius: 100,
    paddingTop: 2,
    backgroundColor: Constants.COLORS.WHITE,
  },
  headerIcon: {
    color: Constants.COLORS.PRIMARY_BLUE,
  },
  orderCard: {
    borderRadius: 10,
    backgroundColor: Constants.COLORS.BACKGROUND_BLUE,
    borderWidth: 0,
  },
  cardItemConatiner: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  pickerConatiner: {
    width: '50%',
    marginRight: -18,
  },
  inputContainerStyle: {
    backgroundColor: Constants.COLORS.WHITE,
    width: '40%',
    height: 35,
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
    borderRadius: 10,
    alignSelf: 'center',
    width: '80%',
    height: 50,
  },
  buttonStyle: {
    height: 50,
    backgroundColor: Constants.COLORS.PRIMARY_COLOR
  },
  buttonTitleStyle: {
    fontSize: 20,
  },
  listCard: {
    borderRadius: 10,
    borderWidth: 0,
  },
  listItemHeader: {
    
  },
  listItemHeaderItem: {
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listItemHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Constants.COLORS.PRIMARY_COLOR
  },
  listItemHeaderWood: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Constants.COLORS.WHITE,
    backgroundColor: Constants.COLORS.LIME_GREEN,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
  },
  listItemHeaderItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Constants.COLORS.BLACK,
    textAlign: 'center',
    alignSelf: 'stretch'
  },
  listItemBody: {
    
  },
  listItemBodyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  listItemBodyItemText: {
    fontSize: 14,
    color: Constants.COLORS.BLACK,
    textAlign: 'center',
    alignSelf: 'stretch',
    marginTop: 4,
  },
  listItemCloseIcon: {
    
  },
});

export default HomeBase;
