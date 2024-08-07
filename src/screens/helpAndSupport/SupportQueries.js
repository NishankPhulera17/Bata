import React, { useEffect, useId, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
  Text,
  Linking,
} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import * as Keychain from 'react-native-keychain';
import { useSelector } from 'react-redux';
import RectangularUnderlinedDropDown from '../../components/atoms/dropdown/RectangularUnderlinedDropDown';
import ErrorModal from '../../components/modals/ErrorModal';
import MessageModal from '../../components/modals/MessageModal';
import { useGetQueriesTypeMutation, useSubmitQueriesMutation } from '../../apiServices/supportQueries/supportQueriesApi';
import PrefilledTextInput from '../../components/atoms/input/PrefilledTextInput';
import FeedbackTextArea from '../../components/feedback/FeedbackTextArea';
import ImageInput from '../../components/atoms/input/ImageInput';
import ImageInputWithUpload from '../../components/atoms/input/ImageInputWithUpload';
import { useUploadSingleFileMutation } from '../../apiServices/imageApi/imageApi';

const SupportQueries = ({ navigation }) => {
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [option, setOption] = useState([])
  const [longDesc, setLongDesc] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [remark, setRemark] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [tokenNumer, setTokenNumber] = useState(null);
  const [shortDescText, setShortDescText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null)



  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : '#FFB533';

  const userData = useSelector(state => state.appusersdata.userData);


  const [getQueriesTypeFunc, {
    data: getQueriesTypeData,
    error: getQueriesTypeError,
    isLoading: getQueriesTypeIsLoading,
    isError: getQueriesTypeIsError
  }] = useGetQueriesTypeMutation()


  const [submitQueriesTypeFunc, {
    data: submitQueriesTypeData,
    error: submitQueriesTypeError,
    isLoading: submitQueriesTypeIsLoading,
    isError: submitQueriesTypeIsError
  }] = useSubmitQueriesMutation()

  const [
    uploadImageFunc,
    {
      data: uploadImageData,
      error: uploadImageError,
      isLoading: uploadImageIsLoading,
      isError: uploadImageIsError,
    },
  ] = useUploadSingleFileMutation();






  useEffect(() => {
    const getTypes = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          'Credentials successfully loaded for user ' + credentials.username
        );
        const token = credentials.username
        setTokenNumber(token)
        const params = { token: token }
        getQueriesTypeFunc(params)
      }
    }
    getTypes()
  }, [])


  useEffect(() => {
    if (uploadImageData?.success) {
      console.log("uploadImageData", uploadImageData);
      const uploadArray = []
      uploadArray.push(uploadImageData?.body?.fileLink)
      setSelectedImage(uploadImageData?.body?.fileLink)
    } else {
      console.log(uploadImageError);
    }
  }, [uploadImageData, uploadImageError]);




  const handleChildComponentData = (uri) => {
    console.log("the uri====>", uri);
    const imageData = {
      uri:uri?.uri,
      name:uri?.uri.slice(0, 10),
      type: 'image/png',
    };
    const uploadFile = new FormData();
    uploadFile.append('image', imageData);
    // console.log("invoice data",item.value)
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;

      uploadImageFunc({ body: uploadFile,token:token });
  }

  getToken()


  }

  useEffect(() => {
    if (getQueriesTypeData) {
      console.log("getQueriesTypeData", getQueriesTypeData)
      const options = getQueriesTypeData?.body.map((itm) => {
        return itm.name
      })
      setOption(options);
    }
    else if (getQueriesTypeError) {
      console.log("getQueriesTypeError", getQueriesTypeError)
    }
  }, [getQueriesTypeData, getQueriesTypeError])

  useEffect(() => {
    if (submitQueriesTypeData) {
      console.log("submitQueriesTypeData", submitQueriesTypeData)
      if (submitQueriesTypeData?.success) {
        setSuccess(true)
        setMessage(submitQueriesTypeData?.message)
      }

    }
    else if (submitQueriesTypeError) {
      console.log("getQueriesTypeError", submitQueriesTypeError)
      if (submitQueriesTypeError.status === 400) {
        setError(true)
        setMessage("Kindly fill the complete details")
      }
    }
  }, [submitQueriesTypeData, submitQueriesTypeError])


  const modalClose = () => {
    setError(false);
    setSuccess(false)
    setMessage('')
  };

  const getReason = (val) => {
    console.log("sel", val)
    setSelectedOption(val)
  }

  const handleData = (dta) => {
    console.log("short desc", dta);
    setShortDescText(dta.value)

  };

  const handleFeedbackChange = (text) => {
    setLongDesc(text)
  }

  // const getTOken = async () => {
  //   const credentials = await Keychain.getGenericPassword();
  //   let token;
  //   if(credentials){
  //      token = credentials.username
  //   }
  //   return token
  // }

  const submitData = () => {
    if (shortDescText == "" || selectedOption == null) {
      setError(true)
      setMessage("Please fill all the fields")
      console.log("userData", userData)
    }
    else {

      const token = tokenNumer;
      let body = {
        name: userData.name,
        mobile: userData.mobile,
        userType: userData.user_type,
        userTypeId: userData.user_type_id,
        short_description: shortDescText,
        long_description: longDesc,
        type: selectedOption,
        image: selectedImage
      }

      const params = { body, token }
      console.log("query submission", JSON.stringify(body))
      submitQueriesTypeFunc(params)
    }
  }

  return (
    <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: "center", justifyContent: "center", height: '100%' }}>
      <View style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: ternaryThemeColor }}>

        {error && (
          <ErrorModal
            modalClose={modalClose}

            message={message}
            openModal={error}></ErrorModal>
        )}
        {success && (
          <MessageModal
            modalClose={modalClose}
            title={"Success"}
            message={message}
            openModal={success}
            navigateTo={"Dashboard"}
          ></MessageModal>
        )}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
          }}>
          <TouchableOpacity
            style={{
              height: 24, width: 24,
              position: 'absolute',
              top: 20,
              left: 10
            }}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              style={{
                height: 24,
                width: 24,
                resizeMode: 'contain',
                marginLeft: 10,
              }}
              source={require('../../../assets/images/blackBack.png')}></Image>
          </TouchableOpacity>
          <View style={{ alignItems: 'center', justifyContent: 'center', position: "absolute", left: 50 }}>
            <PoppinsTextMedium
              content="Report Issue"
              style={{
                marginLeft: 10,
                fontSize: 16,
                fontWeight: '700',
                color: 'white',
              }}></PoppinsTextMedium>
          </View>
        </View>
        <View style={{ backgroundColor: 'white', height: '90%', width: '100%', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 20 }}>

          <View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
            <RectangularUnderlinedDropDown header="Appointment Reason *" data={option} handleData={getReason}></RectangularUnderlinedDropDown>
          </View>

          <View style={{ marginTop: 30, width: '100%', alignItems: 'center' }}>
            <PrefilledTextInput
              jsonData={{
                label: "Short Description",
                maxLength: "100",
                name: "Short Description",
                options: [],
                required: true,
                type: "text",
              }}
              // onChangeText = {handleData}
              handleData={handleData}
              placeHolder={"Short Description"}
              label={"Short Description"}
            ></PrefilledTextInput>
          </View>

          <View style={{ marginTop: 20, width: '95%', marginBottom: 20 }}>
            <FeedbackTextArea onFeedbackChange={handleFeedbackChange} placeholder={"Long description"} />
          </View>

          <View style={{width:'85%'}}>
            <ImageInputWithUpload
              // jsonData={item}
              handleData={handleChildComponentData}
              // key={index}  
              data={"Add Image"}
              action="Select File"></ImageInputWithUpload>
          </View>

          <TouchableOpacity style={{ width: '92%', borderRadius: 15, marginTop: 30, }} onPress={() => {
            submitData()
          }}>
            <PoppinsTextMedium content={"Report Issue"} style={{ backgroundColor: ternaryThemeColor, height: 50, color: 'white', fontWeight: '800', borderRadius: 5, textAlignVertical: 'center' }}></PoppinsTextMedium>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({})

export default SupportQueries;