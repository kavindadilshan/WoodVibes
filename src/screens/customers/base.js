import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Card, Divider, Input, Overlay} from 'react-native-elements';
import IconI from 'react-native-vector-icons/Ionicons';

import * as Constants from '../../utils/constants';
import TabHeader from '../../components/tabHeader';

const CustomerBase = ({navigation}) => {
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const addOnPress = () => {
    // do logic
  };

  const headerRightBtn = (
    <Button
      title="Add New"
      onPress={toggleOverlay}
      containerStyle={styles.addNewButtonContainerStyle}
      buttonStyle={styles.addNewButtonStyle}
      titleStyle={styles.addNewButtonTitleStyle}
    />
  );

  return (
    <View style={styles.container}>
      <TabHeader title="Customers" rightComponent={headerRightBtn} />
      <Card containerStyle={styles.listCard}>
        <Card.Title style={styles.listCardTitle}>
          J.J.Gamage
        </Card.Title>
        <Card.Divider />
        <View style={styles.listCardItem}>
          <Text style={styles.listCardItemHeader}>Total Orders</Text>
          <Text style={styles.listCardItemDesc}>4</Text>
        </View>
        <View style={styles.listCardItem}>
          <Text style={styles.listCardItemHeader}>Last Order</Text>
          <Text style={styles.listCardItemDesc}>2021-10-21</Text>
        </View>
      </Card>
      <Card containerStyle={styles.listCard}>
        <Card.Title style={styles.listCardTitle}>
          J.J.Gamage
        </Card.Title>
        <Card.Divider />
        <View style={styles.listCardItem}>
          <Text style={styles.listCardItemHeader}>Total Orders</Text>
          <Text style={styles.listCardItemDesc}>4</Text>
        </View>
        <View style={styles.listCardItem}>
          <Text style={styles.listCardItemHeader}>Last Order</Text>
          <Text style={styles.listCardItemDesc}>2021-10-21</Text>
        </View>
      </Card>

      <Overlay
        isVisible={visible}
        overlayStyle={styles.overlay}
        onBackdropPress={toggleOverlay}>
        <Card containerStyle={styles.overlayCard}>
          <Card.Title style={{fontSize: 17}}>
            New Customer | නව ගණුදෙනුකරුවන්
          </Card.Title>
          <Card.Divider style={{backgroundColor: Constants.COLORS.BLACK}} />
          <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
            <View>
              <Text>Name</Text>
              <Text style={{fontFamily: 'Amalee'}}>නම</Text>
            </View>
            <Input
              containerStyle={styles.inputContainerStyle}
              inputContainerStyle={{borderBottomWidth: 0}}
              placeholder="Enter here..."
            />
          </View>
          <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
            <View>
              <Text>Address</Text>
              <Text style={{fontFamily: 'Amalee'}}>ලිපිනය</Text>
            </View>
            <Input
              containerStyle={styles.inputContainerStyle}
              inputContainerStyle={{borderBottomWidth: 0}}
              placeholder="Enter here..."
            />
          </View>
          <View style={[styles.cardItemConatiner, {marginBottom: 10}]}>
            <View>
              <Text>Phone Number</Text>
              <Text style={{fontFamily: 'Amalee'}}>දුරකථන අංකය</Text>
            </View>
            <Input
              containerStyle={styles.inputContainerStyle}
              inputContainerStyle={{borderBottomWidth: 0}}
              placeholder="Enter here..."
              keyboardType="decimal-pad"
            />
          </View>
          <Button
            title="Add | එකතු කරන්න"
            onPress={addOnPress}
            containerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
          />
        </Card>
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.COLORS.BACKGROUND_ASH,
    paddingBottom: 100,
  },
  addNewButtonContainerStyle: {
    borderRadius: 10,
    height: 40,
  },
  addNewButtonStyle: {
    height: 40,
    paddingHorizontal: 20,
    backgroundColor: Constants.COLORS.PRIMARY_BLUE,
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
  },
  overlayCard: {
    borderRadius: 10,
    backgroundColor: Constants.COLORS.BACKGROUND_BLUE,
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
    backgroundColor: Constants.COLORS.PRIMARY_COLOR,
  },
  buttonTitleStyle: {
    fontSize: 20,
  },
});

export default CustomerBase;
