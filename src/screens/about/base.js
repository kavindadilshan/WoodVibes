import React from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons';
import ProfileImg from '../../resources/images/logo2.png';
import Img1 from '../../resources/images/location.png';
import Img2 from '../../resources/images/policy.png';
import Img3 from '../../resources/images/smartphone.png';

import * as Constants from '../../utils/constants';
import Header from '../../components/header';
import {Avatar} from "react-native-elements";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

const AboutBase = ({navigation}) => {

    return (
        <View style={styles.container}>
            <ScrollView style={{width: '100%'}} showsVerticalScrollIndicator={false}>
                <Header navigation={navigation} title='About Us'/>
                <View style={{alignItems: 'center'}}>
                    <View style={styles.profilePicHolder}>
                        <View style={styles.profilePicOuter}>
                            <Avatar
                                source={ProfileImg}
                                style={styles.mainImage} resizeMode={'stretch'} rounded={true}/>
                        </View>
                    </View>
                    <Text style={styles.mainTitle}>{Constants.APP_NAME}</Text>
                    <View style={styles.bodyContainer}>
                        <Text style={{...styles.title,paddingHorizontal:'5%',paddingTop:'10%'}}>Woodvibes is a secure billing system mobile application specially build for the wood mills in sri lanka {'\n\n'}Powered by CodeLogic IT Solutions</Text>
                        <View style={styles.icon}>
                            <Avatar
                                source={Img1}
                                style={styles.image} resizeMode={'stretch'} rounded={true}/>
                        </View>
                        <Text style={styles.title}>329/C, Ginigala {'\n'} Habaraduwa.</Text>
                        <View style={styles.icon}>
                            <Avatar
                                source={Img3}
                                style={styles.image} resizeMode={'stretch'}/>
                        </View>
                        <Text style={styles.title}>+94 705711303 / +94 741253110</Text>
                        {/*<View style={styles.icon}>*/}
                        {/*    <Avatar*/}
                        {/*        source={Img2}*/}
                        {/*        style={styles.image} resizeMode={'stretch'}/>*/}
                        {/*</View>*/}
                        {/*<Text style={{...styles.title,paddingHorizontal:'10%'}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has*/}
                        {/*    been the industry's standard .</Text>*/}
                    </View>
                </View>
            </ScrollView>


        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.COLORS.BACKGROUND_ASH,
    },
    profilePicOuter: {
        width: '100%',
        height: '100%',
        borderRadius: 10000,
        borderColor: Constants.COLORS.PRIMARY_COLOR,
        borderWidth: 5,
    },
    profilePicHolder: {
        width: screenWidth / 100 * 35,
        height: screenWidth / 100 * 35,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10%'
    },
    mainImage: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        zIndex: 1,
        overflow: "hidden",
    },
    image: {
        width: '100%',
        height: '100%',
    },
    bodyContainer: {
        width: screenWidth,
        height: screenHeight / 100 * 60,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: Constants.COLORS.WHITE,
        marginTop: '10%',
        alignItems: 'center',
    },
    icon: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10%',
        marginBottom: '5%'
    },
    title: {
        color: Constants.COLORS.ICON_ASH,
        textAlign: 'center'
    },
    mainTitle: {
        marginTop: 20,
        color: Constants.COLORS.BLACK,
        fontSize: 28,
        fontWeight: 'bold',
    }
});

export default AboutBase;
