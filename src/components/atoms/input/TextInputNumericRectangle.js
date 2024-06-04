import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TextInput,Keyboard} from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';
const TextInputNumericRectangle = props => {
  const [value, setValue] = useState(props.value);
  const [keyboardShow, setKeyboardShow] = useState(false);
  const placeHolder = props.placeHolder;
  const maxLength = props.maxLength;
  const label = props.label
  const required = props.required
  const isEditable = props.isEditable
  console.log("label",isEditable)
  Keyboard.addListener('keyboardDidShow',()=>{
    setKeyboardShow(true)
})
Keyboard.addListener('keyboardDidHide',()=>{
    setKeyboardShow(false)
})
  useEffect(()=>{
    if(props.value!==undefined)
    {
      let tempJsonData = {...props.jsonData, value: props.value};
      console.log(tempJsonData);
      const reg = '^([0|+[0-9]{1,5})?([6-9][0-9]{9})$';
      const mobReg = new RegExp(reg)
      if (value?.length === 10) {
        if (mobReg.test(value)) {
      props.handleData(tempJsonData);
          
        }
        else {
          setError(true)
          setMessage("Please enter a valid mobile number")
        }
      }
    } 

  },[props.value])
  useEffect(()=>{
    if (value?.length === 10) {
      if (mobReg.test(value)) {
        props.handleData({...props.jsonData,value:value})

        
      }
      else {
        setError(true)
        setMessage("Please enter a valid mobile number")
      }
    }
  },[keyboardShow])

  const handleInput = text => {
    if(!text.includes(".") && !text.includes("-") && !text.includes(",") && !text.includes(" ")){
      setValue(text)
      if (value?.length === 10) {
        if (mobReg.test(value)) {
          props.handleData(text, props.title)

  
          
        }
        else {
          setError(true)
          setMessage("Please enter a valid mobile number")
        }
      }
    
  }

  };
  const handleInputEnd = () => {
    let tempJsonData = {...props.jsonData, value: value};
    console.log(tempJsonData);
    if (data?.value?.length === 10) {
      if (mobReg.test(data?.value)) {
        props.handleData(tempJsonData);



        
      }
      else {
        setError(true)
        setMessage("Please enter a valid mobile number")
      }
    }
  };


  

  return (
    <View
      style={{
        height: 50,
        width: '86%',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        margin: 10,
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          position: 'absolute',
          top: -15,
          left: 16,
        }}>
        <PoppinsTextMedium
          style={{color: '#919191', padding: 4,fontSize:18}}
          content={label}></PoppinsTextMedium>
      </View>
      <TextInput
        maxLength={maxLength}
        onEndEditing={text => {
          handleInputEnd();
        }}
        keyboardType="numeric"
        style={{
          height: 50,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'flex-start',
          fontWeight: '500',
          marginLeft: 20,
          color:'black',fontSize:16
        }}
        editable = {isEditable ===false ? isEditable : true }
        placeholderTextColor="grey"
        onChangeText={text => {
          handleInput(text);
        }}
        value={value}
        placeholder={required ? `${placeHolder} *` : `${placeHolder}`}></TextInput>
    </View>
  );
};

const styles = StyleSheet.create({});

export default TextInputNumericRectangle;