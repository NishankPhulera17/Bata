import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import PoppinsText from '../electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
const RewardSquare = (props) => {
    const image =props.image
    const amount =props.amount
    const title = props.title
    const color =props.color
    const cashback_balance = props.cashback_balance
    const imageHeight = 40
    const imageWidth = 40

    console.log("the amount========>", amount)

    return (
        <View style={{height:130,width:130,borderRadius:20,alignItems:"center",justifyContent:"center",backgroundColor:color,margin:8}}>
            <Image style={{height:imageHeight,width:imageWidth,resizeMode:"contain",margin:10}} source={image}></Image>
            <PoppinsText content ={amount != undefined ? amount : cashback_balance} style={{fontSize:18,color:'black'}}></PoppinsText>
            <PoppinsTextMedium content={title} style={{fontSize:16,color:'black'}}></PoppinsTextMedium>
        </View>
    );
}

const styles = StyleSheet.create({})

export default RewardSquare;
