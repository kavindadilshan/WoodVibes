import React, {Component} from 'react';
import {ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View} from "react-native";
import {Button, Image, Input} from "react-native-elements";
import * as Constants from "../../utils/constants";
import Icon from "react-native-vector-icons/SimpleLineIcons";

class Base extends Component {
    render() {
        return (
            <View>
                <ScrollView contentContainerStyle={{flexGrow: 1,paddingBottom:10}}>
                    <View style={styles.container}>
                        <Image
                            source={require('../../resources/images/logo.png')}
                            style={styles.logo}
                            PlaceholderContent={<ActivityIndicator/>}/>
                        <Text style={styles.title}>Welcome to {Constants.APP_NAME}</Text>
                        <Input
                            placeholder="Full Name"
                            placeholderTextColor={Constants.COLORS.PLACEHOLDER_ASH}
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            // onChangeText={value => setEmail(value)}
                        />
                        <Input
                            placeholder="Username"
                            placeholderTextColor={Constants.COLORS.PLACEHOLDER_ASH}
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            // onChangeText={value => setEmail(value)}
                        />
                        <Input
                            placeholder="Email"
                            placeholderTextColor={Constants.COLORS.PLACEHOLDER_ASH}
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            // onChangeText={value => setEmail(value)}
                        />
                        <Input
                            placeholder="Mobile"
                            placeholderTextColor={Constants.COLORS.PLACEHOLDER_ASH}
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            // onChangeText={value => setEmail(value)}
                        />
                        <Input
                            placeholder="Identity Number"
                            placeholderTextColor={Constants.COLORS.PLACEHOLDER_ASH}
                            containerStyle={styles.inputContainerStyle}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            // onChangeText={value => setEmail(value)}
                        />
                        <Button
                            title="Register"
                            // onPress={loginOnPress}
                            containerStyle={styles.buttonContainerStyle}
                            buttonStyle={styles.buttonStyle}
                            titleStyle={styles.buttonTitleStyle}
                        />
                    </View>

                </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Constants.COLORS.BACKGROUND_ASH
    },
    logo: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width,
        alignSelf: 'center'
    },
    title: {
        marginTop: 20,
        marginHorizontal: 20,
        color: Constants.COLORS.BLACK,
        fontSize: 28,
        fontWeight: "bold",
        textAlign: 'left',
        alignSelf: 'stretch'
    },
    inputContainerStyle: {
        marginTop: 10,
        backgroundColor: Constants.COLORS.WHITE,
        width: '90%',
        height: 50,
        borderRadius: 10,
    },
    buttonContainerStyle: {
        marginTop: 50,
        borderRadius: 10,
        width: '90%',
        height: 50,
    },
    buttonStyle: {
        height: 50,
        backgroundColor: Constants.COLORS.PRIMARY_COLOR
    },
    buttonTitleStyle: {
        fontSize: 20,
    },
});

export default Base;
