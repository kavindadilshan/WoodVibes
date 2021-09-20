import React from "react";
import {Image, ScrollView, TouchableOpacity, View} from "react-native";
import Filter from "../resources/images/filter.png";

const FilterButton=(props)=>{
    return(
        <View style={{alignItems:'flex-end'}}>
            <TouchableOpacity style={{padding:10,alignItems:'center',marginRight:20,backgroundColor:'red',borderRadius:10}} onPress={props.onPress}>
                <View style={{width:30,height:30}}>
                    <Image source={Filter} style={{width:'100%',height:'100%'}} resizeMode={'contain'}/>
                </View>

            </TouchableOpacity>
        </View>
    )
}

export default FilterButton;
