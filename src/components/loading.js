import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import { View } from "react-native";

const Loading = (props) => {

    return (
        <View>
            <AwesomeAlert
                show={props.isVisible}
                showProgress={true}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                message="Loading"
                progressColor={'gray'}
            />
        </View>
    );

};

export default Loading;
