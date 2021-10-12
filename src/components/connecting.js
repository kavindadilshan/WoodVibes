import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import { View } from "react-native";

const Connecting = (props) => {

    return (
        <View>
            <AwesomeAlert
                show={props.isVisible}
                showProgress={true}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                message="Connecting..."
                progressColor={'gray'}
            />
        </View>
    );

};

export default Connecting;
