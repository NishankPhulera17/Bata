import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { BaseUrl } from '../../utils/BaseUrl';
import LinearGradient from 'react-native-linear-gradient';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import ButtonNavigateArrow from '../../components/atoms/buttons/ButtonNavigateArrow';
import { useGetLoginOtpMutation } from '../../apiServices/login/otpBased/SendOtpApi';
import { setPrimaryThemeColor, setSecondaryThemeColor, setIcon, setIconDrawer, setTernaryThemeColor, setOptLogin, setPasswordLogin, setButtonThemeColor, setColorShades, setKycOptions, setIsOnlineVeriification, setSocials, setWebsite, setCustomerSupportMail, setCustomerSupportMobile, setExtraFeatures } from '../../../redux/slices/appThemeSlice';
import { useGetAppLoginMutation } from '../../apiServices/login/otpBased/OtpLoginApi';
import { useVerifyOtpMutation } from '../../apiServices/login/otpBased/VerifyOtpApi';
import { setAppUserId, setAppUserName, setAppUserType, setUserData, setId } from '../../../redux/slices/appUserDataSlice';
import OtpInput from '../../components/organisms/OtpInput';
import * as Keychain from 'react-native-keychain';
import { useGetNameMutation } from '../../apiServices/login/GetNameByMobile';
import ErrorModal from '../../components/modals/ErrorModal';
import MessageModal from '../../components/modals/MessageModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalWithBorder from '../../components/modals/ModalWithBorder';
import Icon from 'react-native-vector-icons/Feather';
import Close from 'react-native-vector-icons/Ionicons';
import ButtonOval from '../../components/atoms/buttons/ButtonOval';
import { useCheckSalesBoosterMutation } from '../../apiServices/salesBooster/salesBoosterApi';
import { useGetAppDashboardDataMutation } from '../../apiServices/dashboard/AppUserDashboardApi';
import { setBannerData, setDashboardData } from '../../../redux/slices/dashboardDataSlice';
import { useGetAppUserBannerDataMutation } from '../../apiServices/dashboard/AppUserBannerApi';
import { useGetWorkflowMutation } from '../../apiServices/workflow/GetWorkflowByTenant';
import { useGetFormMutation } from '../../apiServices/workflow/GetForms';
import { setProgram, setWorkflow, setIsGenuinityOnly } from '../../../redux/slices/appWorkflowSlice';
import { setWarrantyForm, setWarrantyFormId } from '../../../redux/slices/formSlice';
import { useGetAppMenuDataMutation } from '../../apiServices/dashboard/AppUserDashboardMenuAPi.js';
import { setDrawerData } from '../../../redux/slices/drawerDataSlice';


const VerifyOtp = ({ navigation, route }) => {
  const [mobile, setMobile] = useState(route.params.navigationParams.mobile);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false)
  const [parsedJsonValue, setParsedJsonValue] = useState()
  const [timer, setTimer] = useState(60)

  const timeOutCallback = useCallback(() => setTimer(currTimer => currTimer - 1), []);

  //modal
  const [openModalWithBorder, setModalWithBorder] = useState(false)

  const dispatch = useDispatch();
  // fetching theme for the screen-----------------------

  useEffect(() => {
    timer > 0 && setTimeout(timeOutCallback, 1000);
  }, [timer, timeOutCallback]);

  const primaryThemeColor = useSelector(
    state => state.apptheme.primaryThemeColor,
  )
    ? useSelector(state => state.apptheme.primaryThemeColor)
    : '#FF9B00';
  const secondaryThemeColor = useSelector(
    state => state.apptheme.secondaryThemeColor,
  )
    ? useSelector(state => state.apptheme.secondaryThemeColor)
    : '#FFB533';
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const buttonThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : '#ef6110';
  const fcmToken = useSelector(state => state.fcmToken.fcmToken)

  // console.log("fcmToken from login", fcmToken)
  const icon = useSelector(state => state.apptheme.icon)
    ? useSelector(state => state.apptheme.icon)
    : require('../../../assets/images/demoIcon.png');

  // ------------------------------------------------

  // initializing mutations --------------------------------

  const [getBannerFunc, {
    data: getBannerData,
    error: getBannerError,
    isLoading: getBannerIsLoading,
    isError: getBannerIsError
  }] = useGetAppUserBannerDataMutation()

  const [getAppMenuFunc, {
    data: getAppMenuData,
    error: getAppMenuError,
    isLoading: getAppMenuIsLoading,
    isError: getAppMenuIsError
  }] = useGetAppMenuDataMutation()

  const [getWorkflowFunc, {
    data: getWorkflowData,
    error: getWorkflowError,
    isLoading: getWorkflowIsLoading,
    isError: getWorkflowIsError
  }] = useGetWorkflowMutation()

  const [getFormFunc, {
    data: getFormData,
    error: getFormError,
    isLoading: getFormIsLoading,
    isError: getFormIsError
  }] = useGetFormMutation()

  const [
    sendOtpFunc,
    {
      data: sendOtpData,
      error: sendOtpError,
      isLoading: sendOtpIsLoading,
      isError: sendOtpIsError,
    },
  ] = useGetLoginOtpMutation();

  const [
    verifyLoginOtpFunc,
    {
      data: verifyLoginOtpData,
      error: verifyLoginOtpError,
      isLoading: verifyLoginOtpIsLoading,
      isError: verifyLoginOtpIsError,
    },
  ] = useGetAppLoginMutation();

  const [
    verifyOtpFunc,
    {
      data: verifyOtpData,
      error: verifyOtpError,
      isLoading: verifyOtpIsLoading,
      isError: verifyOtpIsError,
    },
  ] = useVerifyOtpMutation();

  const [getDashboardFunc, {
    data: getDashboardData,
    error: getDashboardError,
    isLoading: getDashboardIsLoading,
    isError: getDashboardIsError
  }] = useGetAppDashboardDataMutation()


  const [getSalesBoosterFunc,{
    data:getSalesBoosterData,
    error:getSalesBoosterError,
    isLoading:getSalesBoosterIsLoading,
    isError:getSalesBoosterIsError
  }] = useCheckSalesBoosterMutation()
  // -----------------------------------------

  // fetching navigation route params ------------------------

  // console.log("Navigation Params are", route.params.navigationParams)
  const navigationParams = route.params.navigationParams;
  //   const needsApproval = route.params.navigationParams.needsApproval;
  //   const userType = route.params.navigationParams.userType;
  //   const userId = route.params.navigationParams.userId;

  // -----------------------------------------


  const width = Dimensions.get('window').width;

  const removerTokenData =async()=>{
    await AsyncStorage.removeItem('loginData');
    navigation.navigate("SelectUser")
  } 
  // retrieving data from api calls--------------------------


  useEffect(() => {
    if (getBannerData) {
      console.log("getBannerData", getBannerData.body)
      const images = Object.values(getBannerData.body).map((item) => {
        return item.image[0]
      })
      console.log("images", images)
      dispatch(setBannerData(images))
      parsedJsonValue && getSalesBoosterFunc(parsedJsonValue?.token)

    }
    else {
      console.log(getBannerError)
    }
  }, [getBannerError, getBannerData])

  useEffect(() => {
    if (getWorkflowData) {
      if (getWorkflowData.length === 1 && getWorkflowData[0] === "Genuinity") {
        dispatch(setIsGenuinityOnly())
      }
      const removedWorkFlow = getWorkflowData.body[0]?.program.filter((item, index) => {
        return item !== "Warranty"
      })
      console.log("getWorkflowData", getWorkflowData.body[0])
      dispatch(setProgram(removedWorkFlow))
      dispatch(setWorkflow(getWorkflowData.body[0]?.workflow_id))
      const form_type = "2"
      parsedJsonValue && getFormFunc({ form_type:form_type, token:parsedJsonValue?.token })

    }
    else {
      console.log(getWorkflowError)
    }
  }, [getWorkflowData, getWorkflowError])

  useEffect(() => {
    if (getAppMenuData) {
      console.log("getAppMenuData", JSON.stringify(getAppMenuData))
      const tempDrawerData = getAppMenuData.body.filter((item) => {
        return item.user_type === parsedJsonValue?.user_type
      })
      console.log("tempDrawerData", JSON.stringify(tempDrawerData))
      dispatch(setDrawerData(tempDrawerData[0]))
      setModalWithBorder(true)

    }
    else if (getAppMenuError) {
      console.log("getAppMenuError", getAppMenuError)
    }
  }, [getAppMenuData, getAppMenuError])

  useEffect(() => {
    if (getFormData) {
      console.log("Form Fields", getFormData.body)
      dispatch(setWarrantyForm(getFormData.body.template))
      dispatch(setWarrantyFormId(getFormData.body.form_template_id))
      parsedJsonValue && getAppMenuFunc(parsedJsonValue?.token)
    }
    else {
      console.log("Form Field Error", getFormError)
    }
  }, [getFormData, getFormError])

  useEffect(() => {
    if (sendOtpData) {
      // console.log(sendOtpData)
    } else {
      // console.log(sendOtpError)
    }
  }, [sendOtpData, sendOtpError]);


  //modal close
  useEffect(() => {
    console.log("running")
    if (openModalWithBorder == true)
      setTimeout(() => {
        console.log("running2")
        modalWithBorderClose()
      }, 2000);
  }, [success, openModalWithBorder]);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('loginData', jsonValue);
    } catch (e) {
      console.log("Error while saving loginData", e)
    }
  };
  const saveUserDetails = (data) => {

    try {
      console.log("Saving user details", data)
      dispatch(setAppUserId(data.user_type_id))
      dispatch(setAppUserName(data.name))
      dispatch(setAppUserType(data.user_type))
      dispatch(setUserData(data))
      dispatch(setId(data.id))
    }
    catch (e) {
      console.log("error", e)
    }
  }

  useEffect(() => {
    if (verifyOtpData) {
      console.log("user Login Data", verifyOtpData)
      if (verifyOtpData.success) {
        console.log(verifyOtpData.body.user_type_id, verifyOtpData.body.name, verifyOtpData.body.user_type)

        console.log("successfullyLoggedIn")
        saveToken(verifyOtpData?.body?.token)
        setParsedJsonValue(verifyOtpData?.body)
        storeData(verifyOtpData.body)
        saveUserDetails(verifyOtpData?.body)
        getDashboardFunc(verifyOtpData?.body?.token)
        setMessage("Successfully Logged In")
        setSuccess(true)
        setModalWithBorder(true)
      }
    } else if (verifyOtpError) {
      console.log("verifyOtpError", verifyOtpError)
      setError(true)
      setMessage("Login Failed")
      console.log(verifyOtpError)
    }
  }, [verifyOtpData, verifyOtpError]);

  useEffect(() => {
    if (getDashboardData) {
      console.log("getDashboardData", getDashboardData)
      console.log("Trying to dispatch", parsedJsonValue?.user_type_id)
      dispatch(setAppUserId(parsedJsonValue?.user_type_id))
      dispatch(setAppUserName(parsedJsonValue?.name))
      dispatch(setAppUserType(parsedJsonValue?.user_type))
      dispatch(setUserData(parsedJsonValue))
      dispatch(setId(parsedJsonValue?.id))
      dispatch(setDashboardData(getDashboardData?.body?.app_dashboard))
      parsedJsonValue && getBannerFunc(parsedJsonValue?.token)
    }
    else if (getDashboardError) {

      console.log("getDashboardError", getDashboardError)
      if(getDashboardError?.data?.message =="Invalid JWT" && getDashboardError?.status == 401 )
      {
        removerTokenData()
      }
    }
  }, [getDashboardData, getDashboardError])

  useEffect(()=>{
    if(getSalesBoosterData)
    {
      console.log("getSalesBoosterData",getSalesBoosterData)
      parsedJsonValue && getWorkflowFunc({"userId": parsedJsonValue?.user_type_id,"token":parsedJsonValue?.token})
    }
    else if(getSalesBoosterError)
    {
      console.log("getSalesBoosterError",getSalesBoosterError)
      parsedJsonValue && getWorkflowFunc({"userId": parsedJsonValue?.user_type_id,"token":parsedJsonValue?.token})

      if(getSalesBoosterError?.data?.message =="Invalid JWT" && getSalesBoosterError?.status == 401 )
      {
        removerTokenData()
      }
    }
  },[getSalesBoosterData,getSalesBoosterError])

  useEffect(() => {
    if (verifyLoginOtpData) {
      console.log("verifyLoginOtpData", verifyLoginOtpData)
      const mobile = navigationParams.mobile;
      const name = navigationParams.name;
      const user_type_id = navigationParams.user_type_id;
      const user_type = navigationParams.user_type;
      const fcm_token = fcmToken
      if (verifyLoginOtpData.success) {
        verifyOtpFunc({ mobile, name, otp, user_type_id, user_type, fcm_token });
      }
    } else if (verifyLoginOtpError) {
      console.log("verifyLoginOtpError", verifyLoginOtpError)
      setError(true)
      setMessage("Please enter the correct OTP")
    }
  }, [verifyLoginOtpData, verifyLoginOtpError]);

  // -------------------------------------------------

  //function for modal

  //function to handle Modal
  const modalWithBorderClose = () => {
    setModalWithBorder(false);
    setMessage('')
    // navigation.navigate("")
    navigation.reset({ index: '0', routes: [{ name: 'Dashboard' }] })
  };

  const ModalContent = () => {
    return (
      <View style={{ width: '100%', alignItems: "center", justifyContent: "center" }}>
        <View style={{ marginTop: 30, alignItems: 'center', maxWidth: '80%' }}>
          <Icon name="check-circle" size={53} color={ternaryThemeColor} />
          <PoppinsTextMedium style={{ fontSize: 27, fontWeight: '600', color: ternaryThemeColor, marginLeft: 5, marginTop: 5 }} content={"Success ! !"}></PoppinsTextMedium>

          <View style={{ marginTop: 10, marginBottom: 30 }}>
            <PoppinsTextMedium style={{ fontSize: 16, fontWeight: '600', color: "#000000", marginLeft: 5, marginTop: 5, }} content={message}></PoppinsTextMedium>
          </View>

          {/* <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <ButtonOval handleOperation={modalWithBorderClose} backgroundColor="#000000" content="OK" style={{ color: 'white', paddingVertical: 4 }} />
          </View> */}

        </View>

        <TouchableOpacity style={[{
          backgroundColor: ternaryThemeColor, padding: 6, borderRadius: 5, position: 'absolute', top: -10, right: -10,
        }]} onPress={modalClose} >
          <Close name="close" size={17} color="#ffffff" />
        </TouchableOpacity>

      </View>
    )
  }


  const handleOtpResend = () => {
    console.log('Resend');
    const mobile = navigationParams.mobile;
    const name = navigationParams.name;
    const user_type_id = navigationParams.user_type_id;
    const user_type = navigationParams.user_type;

    console.log(mobile, name, user_type_id, user_type);

    sendOtpFunc({ mobile, name, user_type_id, user_type });
  };

  const getOtpFromComponent = value => {
    if (value.length === 6) {
      setOtp(value);
      console.log('From Verify Otp', value);
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      // setOtp(value);
      verifyOtp()
      // console.log('From Verify Otp', value);
    }
  }, [otp]);

  const modalClose = () => {
    setError(false);
    setSuccess(false)
    setMessage('')
    setModalWithBorder(false)
  };

  const handleTimer=()=>{
    if (!timer) {
      setTimer(60);
      handleOtpResend()
    }
  }
  
  const verifyOtp = () => {
    console.log("first")
    const mobile = navigationParams.mobile;
    const name = navigationParams.name;
    const user_type_id = navigationParams.user_type_id;
    const user_type = navigationParams.user_type;
    const is_approved_needed = navigationParams.needsApproval;
    const fcm_token = fcmToken
    console.log(mobile, name, user_type_id, user_type, otp, is_approved_needed);

    verifyLoginOtpFunc({
      mobile,
      name,
      user_type_id,
      user_type,
      otp,
      is_approved_needed,
      fcm_token
    });
  };

  const saveToken = async (data) => {
    const token = data
    const password = '17dec1998'

    await Keychain.setGenericPassword(token, password);
  }

  return (
    <LinearGradient
      colors={["white", "white"]}
      style={styles.container}>

      <View style={{
        width: '100%', alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "white",
      }}>
        <View
          style={{
            height: 120,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: "white",
            flexDirection: 'row',

          }}>

          <TouchableOpacity
            style={{ height: 50, alignItems: "center", justifyContent: 'center', position: "absolute", left: 10, top: 20 }}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              style={{ height: 20, width: 20, resizeMode: 'contain' }}
              source={require('../../../assets/images/blackBack.png')}></Image>
          </TouchableOpacity>
          <Image
            style={{
              height: 50,
              width: 130,
              resizeMode: 'contain',
              top: 20,
              position: "absolute",
              left: 50,
              


            }}
            source={require('../../../assets/images/batalogo.png')}></Image>
        </View>
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: 10,
            width: '90%'
          }}>
          <PoppinsText
            style={{ color: 'black', fontSize: 28 }}
            content="Enter the OTP sent to"></PoppinsText>
          <PoppinsText
            style={{ color: 'black', fontSize: 28 }}
            content={navigationParams.mobile}></PoppinsText>

        </View>

      </View>
      <View style={{ marginHorizontal: 100 }}>
        {error && (
          <ErrorModal
            modalClose={modalClose}
            message={message}
            openModal={error}

          ></ErrorModal>
        )}
      </View>


      <View style={{ marginHorizontal: 100 }}>
        {openModalWithBorder &&
          <ModalWithBorder
            modalClose={modalWithBorderClose}
            message={message}
            openModal={openModalWithBorder}
            comp={ModalContent}>
          </ModalWithBorder>}
      </View>

      <ScrollView contentContainerStyle={{ flex: 1 }} style={{ width: '100%' }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Image
            style={{ height: 160, width: 160, resizeMode: 'contain' }}
            source={require('../../../assets/images/otpScreenImage.png')}></Image>

        </View>
        <OtpInput
          getOtpFromComponent={getOtpFromComponent}
          color={'white'}></OtpInput>

<View style={{alignItems:'center',justifyContent:'center'}}>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:4}}>
              <Image
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    
                  }}
                  source={require('../../../assets/images/clock.png')}></Image>
                  <Text style={{color:ternaryThemeColor,marginLeft:4}}>{timer}</Text>
              </View>
              <View style={{alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:ternaryThemeColor,marginTop:10}}>Didn't recieve any Code?</Text>
                
                <Text onPress={handleTimer} style={{color:ternaryThemeColor,marginTop:6,fontWeight:'600',fontSize:16}}>Resend Code</Text>
                
              </View>
            </View>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            position: "absolute", bottom: 30, width: '100%'
          }}>
          {/* {otp && (
            <ButtonNavigateArrow
              handleOperation={verifyOtp}
              backgroundColor={buttonThemeColor}
              style={{ color: 'white', fontSize: 16 }}
              content="Verify"></ButtonNavigateArrow>
          )} */}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  semicircle: {
    backgroundColor: 'white',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  banner: {
    height: 184,
    width: '90%',
    borderRadius: 10,
  },
  userListContainer: {
    width: '100%',
    height: 600,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default VerifyOtp;