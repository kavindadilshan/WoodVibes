import {Input} from "react-native-elements";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Constants from "../utils/constants";
import React from "react";
import {StyleSheet, View} from "react-native";

const TextInput = (props) => {
    return (
        <View style={props.width!==undefined? {...styles.inputContainerStyle,width:props.width}:styles.inputContainerStyle}>
            <Input
                containerStyle={{width: '100%'}}
                inputContainerStyle={{borderBottomWidth: 0}}
                placeholder={props.placeholder}
                onChangeText={props.onChangeText}
                value={props.value}
                placeholderTextColor={Constants.COLORS.PLACEHOLDER_ASH}
                autoCapitalize='none'
                keyboardType={props.keyboardType}
                returnKeyType={props.returnKeyType === undefined ? 'done' : props.returnKeyType}
                onSubmitEditing={props.onSubmitEditing}
                errorMessage={props.errorMessage}
                onTouchStart={props.onKeyPress}
                secureTextEntry={props.secureTextEntry}
                editable={props.editable}
                style={styles.input}
                leftIcon={props.leftIcon}
                rightIcon={props.rightIcon}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainerStyle: {
        marginVertical: '3%',
        backgroundColor: Constants.COLORS.WHITE,
        width: '90%',
        height: 50,
        borderRadius: 10,
    },
})

export default TextInput;
