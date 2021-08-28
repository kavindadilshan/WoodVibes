import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';

import * as Constants from '../../utils/constants';
import TabHeader from '../../components/tabHeader';

const WoodSetupBase = ({navigation}) => {
    
    const addOnPress = () => {
        // do logic
    }

    const headerRightBtn = <Button
                                title="Add New"
                                onPress={addOnPress}
                                containerStyle={styles.addNewButtonContainerStyle}
                                buttonStyle={styles.addNewButtonStyle}
                                titleStyle={styles.addNewButtonTitleStyle}
                            />

    return (
        <View style={styles.container}>
            <TabHeader title='Wood Setup' rightComponent={headerRightBtn}/>
        </View>
    )
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
      backgroundColor: Constants.COLORS.PRIMARY_COLOR
    },
    addNewButtonTitleStyle: {
      fontSize: 16,
    },
});

export default WoodSetupBase;
