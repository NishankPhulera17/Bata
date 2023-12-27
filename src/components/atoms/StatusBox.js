import React from 'react';
import {View, StyleSheet} from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
const StatusBox = (props) => {
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
        const status = props.status
    return (
        <View style={{padding:14,borderWidth:1,borderStyle:"dashed",backgroundColor:ternaryThemeColor,alignItems:"center",justifyContent:"center",borderRadius:4,opacity:0.7,marginTop:30}}>
            <PoppinsTextMedium style={{color:'black',fontSize:16,fontWeight:'700'}} content={`Status : ${status}`}></PoppinsTextMedium>
        </View>
    );
}

const styles = StyleSheet.create({})

export default StatusBox;
