import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, PermissionsAndroid, Platform ,Alert,Linking} from 'react-native';
import DotHorizontalList from '../../components/molecules/DotHorizontalList';
import { useGetAppThemeDataMutation } from '../../apiServices/appTheme/AppThemeApi';
import { useSelector, useDispatch } from 'react-redux'
import { setPrimaryThemeColor, setSecondaryThemeColor, setIcon, setIconDrawer, setTernaryThemeColor, setOptLogin, setPasswordLogin, setButtonThemeColor, setColorShades, setKycOptions, setIsOnlineVeriification, setSocials, setWebsite, setCustomerSupportMail, setCustomerSupportMobile, setExtraFeatures } from '../../../redux/slices/appThemeSlice';
import { setManualApproval, setAutoApproval, setRegistrationRequired } from '../../../redux/slices/appUserSlice';
import { setPointSharing } from '../../../redux/slices/pointSharingSlice';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAppUserType, setAppUserName, setAppUserId, setUserData, setId } from '../../../redux/slices/appUserDataSlice';
import messaging from '@react-native-firebase/messaging';
import { setFcmToken } from '../../../redux/slices/fcmTokenSlice';
import { setAppUsers, setAppUsersData } from '../../../redux/slices/appUserSlice';
import { useGetAppUsersDataMutation } from '../../apiServices/appUsers/AppUsersApi';
import Geolocation from '@react-native-community/geolocation';
import { user_type_option } from '../../utils/usertTypeOption';
import { request, PERMISSIONS } from 'react-native-permissions';
import InternetModal from '../../components/modals/InternetModal';
import {GoogleMapsKey} from "@env"
import { setLocation } from '../../../redux/slices/userLocationSlice';
import { useCheckVersionSupportMutation } from '../../apiServices/minVersion/minVersionApi';
import VersionCheck from 'react-native-version-check';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";




const Splash = ({ navigation }) => {
  const dispatch = useDispatch()
  const focused = useIsFocused()
  const [connected, setConnected] = useState(true)
  const [isSlowInternet, setIsSlowInternet] = useState(false)
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [minVersionSupport, setMinVersionSupport] = useState(false)
  const [isAlreadyIntroduced, setIsAlreadyIntroduced] = useState(null);
  const [gotLoginData, setGotLoginData] = useState()
  const [listUsers, setListUsers] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null)
  const [hasPermission, setHasPermission] = useState(null);
  const [locationBoxEnabled, setLocationBoxEnabled] = useState(false)

  const isConnected = useSelector(state => state.internet.isConnected);



  const registrationRequired = useSelector(state => state.appusers.registrationRequired)
  const manualApproval = useSelector(state => state.appusers.manualApproval)
  const otpLogin = useSelector(state => state.apptheme.otpLogin)



  const gifUri = Image.resolveAssetSource(require('../../../assets/gif/splash.gif')).uri;
  // generating functions and constants for API use cases---------------------
  const [
    getAppTheme,
    {
      data: getAppThemeData,
      error: getAppThemeError,
      isLoading: getAppThemeIsLoading,
      isError: getAppThemeIsError,
    }
  ] = useGetAppThemeDataMutation();
  const [
    getUsers,
    {
      data: getUsersData,
      error: getUsersError,
      isLoading: getUsersDataIsLoading,
      isError: getUsersDataIsError,
    },
  ] = useGetAppUsersDataMutation();


  const [
    getMinVersionSupportFunc,
    {
      data : getMinVersionSupportData,
      error:getMinVersionSupportError,
      isLoading:getMinVersionSupportIsLoading,
      isError:getMinVersionSupportIsError
    }
  ] = useCheckVersionSupportMutation()

  useEffect(() => {
    const currentVersion = VersionCheck.getCurrentVersion();
    console.log("currentVersion",currentVersion)
    getMinVersionSupportFunc(currentVersion)
    checkCameraPermission();
  }, []);


  const checkCameraPermission = async () => {
    try {
      const status = await requestCameraPermission();
      console.log('Camera Permission Status:', status);
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Error checking camera permission:', error);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      return result;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return 'denied';
    }
  };


  useEffect(()=>{
    if(getMinVersionSupportData)
    {
      console.log("getMinVersionSupportData",getMinVersionSupportData)
      if(getMinVersionSupportData.success)
      {
      setMinVersionSupport(getMinVersionSupportData?.body?.data)
      if(!getMinVersionSupportData?.body?.data)
      {
        alert("Kindly update the app to the latest version")
      }

      }
    }
    else if(getMinVersionSupportError)
    {
      console.log("getMinVersionSupportError",getMinVersionSupportError)
    }
  },[getMinVersionSupportData,getMinVersionSupportError])

  useEffect(() => {

    let lat = ''
    let lon = ''

    const openSettings = () => {
      if (Platform.OS === 'android') {
        Linking.openSettings();
      } else {
        Linking.openURL('app-settings:');
      }
    };
    const getLocationPermission = async () => {

if(Platform.OS=='ios')
{
      console.log("getLocationPermissions")
      Alert.alert(
  'GPS Disabled',
  'Please enable GPS/Location to use this feature. You can open it from the top sliding setting menu of your phone or from the setting section of your phone.',
  [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    { text: 'Settings', onPress: () => Platform.OS == 'android' ?  Linking.openSettings() : Linking.openURL('app-settings:') },
  ],
  { cancelable: false }
);
}
if(Platform.OS=='android')
{
  LocationServicesDialogBox.checkLocationServicesIsEnabled({
    message: "<h2 style='color: #0af13e'>Use Location ?</h2>Ozostars wants to change your device settings:<br/><br/>Enable location to use the application.<br/><br/><a href='#'>Learn more</a>",
    ok: "YES",
    cancel: "NO",
    enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
    showDialog: true, // false => Opens the Location access page directly
    openLocationServices: true, // false => Directly catch method is called if location services are turned off
    preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
    preventBackClick: true, // true => To prevent the location services popup from closing when it is clicked back button
    providerListener: false, // true ==> Trigger locationProviderStatusChange listener when the location state changes
    style:{
    backgroundColor:"#DDDDDD",
    positiveButtonTextColor: 'white',
    positiveButtonBackgroundColor: "#298d7b",
    negativeButtonTextColor: 'white',
    negativeButtonBackgroundColor: '#ba5f5f',
    
  
}
  }).then(function(success) {
    console.log("location  prompt box success", success);
    setLocationEnabled(true) // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
  }).catch((error) => {
    console.log("location  prompt box error", error.message);
    getLocationPermission()
    // error.message => "disabled"
  });
}

  }

   
    if(!locationBoxEnabled)
    {
      try{
        Geolocation.getCurrentPosition((res) => {
          console.log("res", res)
          lat = res.coords.latitude
          lon = res.coords.longitude
          // getLocation(JSON.stringify(lat),JSON.stringify(lon))
          let locationJson = {
    
            lat: lat === undefined ? "N/A" : lat,
            lon: lon === undefined ? "N/A" : lon,
          }

          console.log("latlong", lat, lon)
          var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${res?.coords?.latitude},${res?.coords?.longitude}
              &location_type=ROOFTOP&result_type=street_address&key=${GoogleMapsKey}`
    
          fetch(url).then(response => response.json()).then(json => {
            console.log("location address=>", JSON.stringify(json));
            if(json.status=="OK")
            {
              const formattedAddress = json?.results[0]?.formatted_address
    
            locationJson["address"] = formattedAddress === undefined ? "N/A" : formattedAddress
            const addressComponent = json?.results[0]?.address_components
            console.log("addressComponent", addressComponent)
            for (let i = 0; i <= addressComponent?.length; i++) {
              if (i === addressComponent?.length) {
                
                dispatch(setLocation(locationJson))
                setLocationEnabled(true)

              }
              else {
                if (addressComponent[i].types.includes("postal_code")) {
                  console.log("inside if")
    
                  console.log(addressComponent[i]?.long_name)
                  locationJson["postcode"] = addressComponent[i]?.long_name
                }
                else if (addressComponent[i]?.types.includes("country")) {
                  console.log(addressComponent[i]?.long_name)
    
                  locationJson["country"] = addressComponent[i]?.long_name
                }
                else if (addressComponent[i]?.types.includes("administrative_area_level_1")) {
                  console.log(addressComponent[i]?.long_name)
    
                  locationJson["state"] = addressComponent[i]?.long_name
                }
                else if (addressComponent[i]?.types.includes("administrative_area_level_3")) {
                  console.log(addressComponent[i]?.long_name)
    
                  locationJson["district"] = addressComponent[i]?.long_name
                }
                else if (addressComponent[i]?.types.includes("locality")) {
                  console.log(addressComponent[i]?.long_name)
    
                  locationJson["city"] = addressComponent[i]?.long_name
                }
              }
    
            }
            }
            
    
            console.log("formattedAddressArray", locationJson)
    
          })
        },(error) => {
          setLocationEnabled(false)
          console.log("error", error)
          if (error.code === 1) {
            // Permission Denied
            Geolocation.requestAuthorization()
  
          } else if (error.code === 2) {
            // Position Unavailable
            console.log("locationBoxEnabled",locationBoxEnabled)
            if(!locationBoxEnabled)
            getLocationPermission()
  
          } else {
            // Other errors
            Alert.alert(
              "Error",
              "An error occurred while fetching your location.",
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );
          }
        })
    
      }
      catch(e){
        console.log("error in fetching location",e)
      }
    }
     
    
      
    
   
   
  }, [navigation])

  useEffect(()=>{
    if(isConnected)
    {
      console.log("internet status",isConnected)
    
        setConnected(isConnected.isConnected)
        setIsSlowInternet(isConnected.isInternetReachable ? false : true)
        console.log("is connected",isConnected)
      
      }
  },[isConnected])

  useEffect(() => {
    getUsers();
    getAppTheme("Bata")
    const checkToken = async () => {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log("fcmToken", fcmToken);
        dispatch(setFcmToken(fcmToken))
      }
    }
    checkToken()
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === "android") {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Geolocation Permission',
              message: 'Can we access your location?',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          console.log('granted', granted);
          if (granted === 'granted') {
            console.log('You can use Geolocation');
            return true;
          } else {
            console.log('You cannot use Geolocation');
            return false;
          }
        }
        else {
          Geolocation.requestAuthorization()
        }

      } catch (err) {
        return false;
      }
    };
    requestLocationPermission()
  }, [isConnected])

  // fetching data and checking for errors from the API-----------------------

  


  useEffect(() => {
    if (getUsersData) {
      console.log("type of users", getUsersData.body);
      const appUsers = getUsersData.body.map((item, index) => {
        return item.name
      })
      const appUsersData = getUsersData.body.map((item, index) => {
        return {
          "name": item.name,
          "id": item.user_type_id
        }
      })
      console.log("appUsers", appUsersData)

      dispatch(setAppUsers(appUsers))
      dispatch(setAppUsersData(appUsersData))
      setTimeout(() => {
        setListUsers(getUsersData.body);
      }, 2000)

    } else if (getUsersError) {
      console.log("getUsersError", getUsersError);
    }
  }, [getUsersData, getUsersError]);

  useEffect(() => {
    if (getAppThemeData) {
      console.log("getAppThemeData", JSON.stringify(getAppThemeData.body))
      dispatch(setPrimaryThemeColor(getAppThemeData.body.theme.color_shades["600"]))
      dispatch(setSecondaryThemeColor(getAppThemeData.body.theme.color_shades["400"]))
      dispatch(setTernaryThemeColor(getAppThemeData.body.theme.color_shades["700"]))
      dispatch(setIcon(getAppThemeData.body.logo[0]))
      dispatch(setIconDrawer(getAppThemeData.body.logo[0]))
      dispatch(setOptLogin(getAppThemeData.body.login_options.Otp.users))
      dispatch(setPasswordLogin(getAppThemeData.body.login_options.Password.users))
      dispatch(setButtonThemeColor(getAppThemeData.body.theme.color_shades["700"]))
      dispatch(setManualApproval(getAppThemeData.body.approval_flow_options.Manual.users))
      dispatch(setAutoApproval(getAppThemeData.body.approval_flow_options.AutoApproval.users))
      dispatch(setRegistrationRequired(getAppThemeData.body.registration_options.Registration.users))
      dispatch(setColorShades(getAppThemeData.body.theme.color_shades))
      dispatch(setKycOptions(getAppThemeData.body.kyc_options))
      dispatch(setPointSharing(getAppThemeData.body.points_sharing))
      dispatch(setSocials(getAppThemeData.body.socials))
      dispatch(setWebsite(getAppThemeData.body.website))
      dispatch(setCustomerSupportMail(getAppThemeData.body.customer_support_email))
      dispatch(setCustomerSupportMobile(getAppThemeData.body.customer_support_mobile))
      dispatch(setExtraFeatures(getAppThemeData.body.addon_features))
      if (getAppThemeData.body.addon_features.kyc_online_verification !== undefined) {
        if (getAppThemeData.body.addon_features.kyc_online_verification) {
          dispatch(setIsOnlineVeriification())
        }
      }
      console.log("isAlreadyIntro", isAlreadyIntroduced)

      getData()
    }
    else if (getAppThemeError) {


      console.log("getAppThemeIsError", getAppThemeIsError)
      console.log("getAppThemeError", getAppThemeError)
    }

  }, [getAppThemeData, getAppThemeError,locationEnabled,isConnected])


  useEffect(() => {
    console.log("list user ki ==========>", isUserLoggedIn)
    if (user_type_option == "single") {
      isUserLoggedIn !== null && !isUserLoggedIn && checkRegistrationRequired(listUsers)
    }

  }, [listUsers?.[0]?.user_type, isUserLoggedIn])




  const checkRegistrationRequired = (listUsers) => {
    console.log("yaha pe list user---------------->", listUsers[0])

    if (registrationRequired.includes(listUsers?.[0]?.user_type)) {
      checkApprovalFlow(true)
      console.log("registration required")
    }
    else {
      checkApprovalFlow(false)
      console.log("registration not required")

    }


  }

  const checkApprovalFlow = (registrationRequired) => {
    if (manualApproval.includes(getUsersData?.body?.[0].user_type)) {
      handleNavigationBaseddOnUser(true, registrationRequired)
    }
    else {
      handleNavigationBaseddOnUser(false, registrationRequired)
    }
  }

  const handleNavigationBaseddOnUser = (needsApproval, registrationRequired) => {
    console.log("Needs Approval", needsApproval)
    if (otpLogin.includes(getUsersData?.body?.[0].user_type)
    ) {
      setTimeout(() => {
        listUsers && locationEnabled &&  navigation.navigate('OtpLogin', { needsApproval: needsApproval, userType: listUsers[0]?.user_type, userId: listUsers[0]?.user_type_id, registrationRequired: registrationRequired })

      }, 3000);
    }
    else {
      setTimeout(() => {
        listUsers && locationEnabled && navigation.navigate('OtpLogin', { needsApproval: needsApproval, userType: listUsers[0]?.user_type, userId: listUsers[0]?.user_type_id, registrationRequired: registrationRequired })

      }, 3000)
      // console.log("Password Login", props.content, props.id, registrationRequired, needsApproval)
    }
  }


  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('loginData');
      console.log("loginData", JSON.parse(jsonValue))
      const parsedJsonValue = JSON.parse(jsonValue)
      const value = await AsyncStorage.getItem('isAlreadyIntroduced');
      if (value !== null && jsonValue !== null) {
        // value previously stored
        console.log("asynch value", value, jsonValue)
        try {
          console.log("Trying to dispatch", parsedJsonValue.user_type_id)
          dispatch(setAppUserId(parsedJsonValue.user_type_id))
          dispatch(setAppUserName(parsedJsonValue.name))
          dispatch(setAppUserType(parsedJsonValue.user_type))
          dispatch(setUserData(parsedJsonValue))
          dispatch(setId(parsedJsonValue.id))

          setIsUserLoggedIn(true)
          setTimeout(() => {
            // navigation.navigate('Dashboard');
          locationEnabled && connected && navigation.reset({ index: '0', routes: [{ name: 'Dashboard' }] })


          }, 3000);


        }
        catch (e) {
          console.log("Error in dispatch", e)
          setIsUserLoggedIn(false)
        }

        // console.log("isAlreadyIntroduced",isAlreadyIntroduced)
      }
      else {
        setIsUserLoggedIn(false)
        if (value === "Yes") {
          if (user_type_option == "single") {
            checkRegistrationRequired()
          }
          else {
            setTimeout(()=>{
              // navigation.navigate('SelectUser');
           connected && locationEnabled && navigation.reset({ index: '0', routes: [{ name: 'SelectUser' }] })


            },1000)
          }

        }
        else {
          setTimeout(()=>{
           connected && locationEnabled && navigation.navigate('Introduction')

          },1000)
        }
        // console.log("isAlreadyIntroduced",isAlreadyIntroduced,gotLoginData)



      }

    }




    catch (e) {
      console.log("Error is reading loginData", e)
    }
  };


  const NoInternetComp = ()=>{
    return (
      <View style={{alignItems:'center',justifyContent:'center',width:'90%'}}>
        <Text style={{color:'black'}}>No Internet Connection</Text>
          <Text style={{color:'black'}}>Please check your internet connection and try again.</Text>
      </View>
    )
  }

  const SlowInternetComp  = ()=>{
    return (
      <View style={{alignItems:'center',justifyContent:'center',width:'90%'}}>
        <Text style={{color:'black'}}>Slow Internet Connection Detected</Text>
          <Text style={{color:'black'}}>Please check your internet connection. </Text>
      </View>
    )
  }



  // calling API to fetch themes for the app








  return (
    <View style={{ flex: 1, alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center', backgroundColor: 'white' }}>
      {/* <ImageBackground resizeMode='stretch' style={{ flex: 1, height: '100%', width: '100%', }} source={require('../../../assets/images/batalogo.png')}> */}
      {!connected &&  <InternetModal comp = {NoInternetComp} />}
      {isSlowInternet && <InternetModal comp = {SlowInternetComp} /> }
      {/* <Image style={{ width: 300, height: 100, }} source={require('../../../assets/images/batalogo.png')} /> */}
      <FastImage
        style={{ width: 250, height:'100%', marginTop: 'auto', alignSelf: 'center', }}
        source={{
          uri: gifUri, // Update the path to your GIF
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />

      {/* </ImageBackground> */}

    </View>


  );
}

const styles = StyleSheet.create({})

export default Splash;