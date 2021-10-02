import React from "react";
import {Image, ScrollView, TouchableOpacity, View, StyleSheet, Text} from "react-native";
import Filter from "../resources/images/filter.png";
import * as Constants from "../utils/constants";
import IconI from 'react-native-vector-icons/Ionicons';

const FilterButton=(props)=>{
    return(
        <View style={{alignItems:'flex-end'}}>
        <View style={{alignItems:'center',flexDirection:'row'}}>
            {/*<View style={styles.label}>*/}
            {/*    <Text style={styles.text}>sample text search</Text>*/}
            {/*    <IconI name={'close-circle-outline'} size={15}/>*/}
            {/*</View>*/}
            <TouchableOpacity style={styles.filterButton} onPress={props.onPress}>
                <View style={{width:30,height:30}}>
                    <Image source={Filter} style={{width:'100%',height:'100%'}} resizeMode={'contain'}/>
                </View>

            </TouchableOpacity>
        </View>
        </View>
    )
}

const styles=StyleSheet.create({
    filterButton:{
        padding:10,
        alignItems:'center',
        marginRight:20,
        backgroundColor:Constants.COLORS.FILTER_COLOR,
        borderRadius:10
    },
    label:{
        borderRadius: 20,
        paddingHorizontal:15,
        paddingVertical:5,
        backgroundColor: Constants.COLORS.LABEL_BG,
        marginRight: 10,
        flexDirection:'row',
        alignContent: 'center',
    },
    text:{
        fontWeight:'bold',
        color:Constants.COLORS.BLACK,
        fontSize:12,
        marginRight:5
    }
})

export default FilterButton;
