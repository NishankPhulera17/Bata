import React from 'react';
import { StyleSheet, View,TouchableOpacity } from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextLeftMedium';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const SalesBoosterTriggerButton = (props) => {
    const data =props.data
    const navigation = useNavigation()
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : '#FFB533';
    return (
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <PoppinsTextMedium style={{color:'black',fontWeight:'bold'}} content="New Rewards Available"></PoppinsTextMedium>
            <TouchableOpacity onPress={()=>{
                navigation.navigate("SalesBooster",{data:data})
            }} style={{height:50,width:120,alignItems:'center',justifyContent:'center',backgroundColor:ternaryThemeColor,borderRadius:20,marginLeft:20}}>
            <PoppinsTextMedium style={{color:'white',fontWeight:'bold'}} content="Claim"></PoppinsTextMedium>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({})

export default SalesBoosterTriggerButton;
