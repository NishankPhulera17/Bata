import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Modal, Pressable, Text, Image } from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';
import { useVerifyGstMutation } from '../../../apiServices/verification/GstinVerificationApi';
import ZoomImageAnimation from '../../animations/ZoomImageAnimation';
import FastImage from 'react-native-fast-image';
import ErrorModal from '../../modals/ErrorModal';
import { useDispatch } from 'react-redux';
import { setGstCompleted } from '../../../../redux/slices/userKycStatusSlice';


const TextInputGST = (props) => {
  const [value, setValue] = useState(props.value)
  const [modalVisible, setModalVisible] = useState(false);
  const [gstVerified, setGSTVerified] = useState(false)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState("")
  const [errorModal, setErrorModal] = useState(false)
  const dispatch = useDispatch()
  const placeHolder = props.placeHolder
  const required = props.required
  const label = props.label
  const [verifyGstFunc, {
    data: verifyGstData,
    error: verifyGstError,
    isLoading: verifyGstIsLoading,
    isError: verifyGstIsError
  }] = useVerifyGstMutation()

  // console.log("Aadhar TextInput")
  const gifUri = Image.resolveAssetSource(require('../../../../assets/gif/loader.gif')).uri;


  useEffect(() => {

    console.log("gstin value", value);

    if (value?.length === 15) {
      const data = {
        "gstin": value,
        "business_name": "TEst"
      }
      verifyGstFunc(data)
      console.log(data)
    }
    if(value?.length<15)
    {
      dispatch(setGstCompleted(false))

    }
  }, [value])

  useEffect(() => {
    if (verifyGstData) {
      console.log("verifyGstData", verifyGstData)
      if (verifyGstData.success) {
        setGSTVerified(true)
        setModalVisible(true)
        dispatch(setGstCompleted(true))
      }
    }
    else if (verifyGstError) {
      console.log("verifyGstError", verifyGstError)
      setErrorModal(true)
      setMessage(verifyGstError?.data?.message)
      dispatch(setGstCompleted(false))

    }
  }, [verifyGstData, verifyGstError])

  const handleInput = (text) => {
    setValue(text)
    // props.handleData(value)

  }
  const modalClose = () =>{
    setErrorModal(false)
  }

  const handleInputEnd = () => {
     let tempJsonData = { ...props.jsonData, "value": value }

    console.log(tempJsonData)
    props.type != 'editprofile' && props.handleData(tempJsonData)
    props.type == 'editprofile' && props.handleData(value, placeHolder)

  }

  return (
    <>
<View style={{ height: 60, width: '86%', borderWidth: 1, borderColor: '#DDDDDD', alignItems: "center", justifyContent: "center", backgroundColor: 'white', margin: 10 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {

          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>GST Verified Succesfully</Text>
            <ZoomImageAnimation style={{ marginBottom: 20 }} zoom={100} duration={1000} image={require('../../../../assets/images/greenTick.png')}></ZoomImageAnimation>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={{ alignItems: "center", justifyContent: 'center', backgroundColor: 'white', position: "absolute", top: -15, left: 16 }}>
        <PoppinsTextMedium style={{ color: "#919191", padding: 4, fontSize: 18, }} content={label}></PoppinsTextMedium>
      </View>

      <TextInput editable={!gstVerified} maxLength={15} onSubmitEditing={(text) => { handleInputEnd() }} onEndEditing={(text) => { handleInputEnd() }} style={{ height: 50, width: '100%', alignItems: "center", justifyContent: "flex-start", fontWeight: '500', marginLeft: 24, color: 'black', fontSize: 16 }} placeholderTextColor="grey" onChangeText={(text) => { handleInput(text) }} value={value} placeholder={required ? `${placeHolder} *` : `${placeHolder}`}></TextInput>
      {gstVerified && <View style={{ alignItems: 'center', justifyContent: 'center', width: '20%', position: 'absolute', right: 0 }}>
        <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../../assets/images/greenTick.png')}></Image>
      </View>}
      

      {verifyGstIsLoading && <FastImage
        style={{ width: 30, height: 30, alignSelf: 'center', position: 'absolute', right: 10 }}
        source={{
          uri: gifUri, // Update the path to your GIF
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />}

      {errorModal && (
        <ErrorModal
          modalClose={modalClose}
          modalVisible={errorModal}
          message={message}
          openModal={error}></ErrorModal>
      )}

     
    </View>
    { verifyGstError && <Text style={{color:'red',zIndex:1,marginLeft:10}}>{verifyGstError.data.message}</Text>} 

    </>
    
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 4,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
    fontWeight: '600'
  },
});

export default TextInputGST;
