import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity, Image, Text, Alert, Linking } from 'react-native';
import MenuItems from '../../components/atoms/MenuItems';
import { BaseUrl } from '../../utils/BaseUrl';
import { useGetAppDashboardDataMutation } from '../../apiServices/dashboard/AppUserDashboardApi';
import * as Keychain from 'react-native-keychain';
import DashboardMenuBox from '../../components/organisms/DashboardMenuBox';
import Banner from '../../components/organisms/Banner';
import DrawerHeader from '../../components/headers/DrawerHeader';
import DashboardDataBox from '../../components/molecules/DashboardDataBox';
import KYCVerificationComponent from '../../components/organisms/KYCVerificationComponent';
import DashboardSupportBox from '../../components/molecules/DashboardSupportBox';
import { useSelector, useDispatch } from 'react-redux';
import { setLocation } from '../../../redux/slices/userLocationSlice';
import Geolocation from '@react-native-community/geolocation';
import { useGetkycStatusMutation } from '../../apiServices/kyc/KycStatusApi';
import { setKycData } from '../../../redux/slices/userKycStatusSlice';
import { useIsFocused } from '@react-navigation/native';
import { setPercentagePoints, setShouldSharePoints } from '../../../redux/slices/pointSharingSlice';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import { setQrIdList } from '../../../redux/slices/qrCodeDataSlice';
import CampaignVideoModal from '../../components/modals/CampaignVideoModal';
import { useGetActiveMembershipMutation } from '../../apiServices/membership/AppMembershipApi';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import PlatinumModal from '../../components/platinum/PlatinumModal';
import { useFetchAllQrScanedListMutation } from '../../apiServices/qrScan/AddQrApi';
import FastImage from 'react-native-fast-image';
import ScannedDetailsBox from '../../components/organisms/ScannedDetailsBox';
import moment from 'moment';
import AnimatedDots from '../../components/animations/AnimatedDots';
import messaging from '@react-native-firebase/messaging';
import CustomModal from '../../components/modals/CustomModal';
import ModalWithBorder from '../../components/modals/ModalWithBorder';
import Bell from 'react-native-vector-icons/FontAwesome';
import Close from 'react-native-vector-icons/Ionicons';
import { GoogleMapsKey } from "@env"
import InternetModal from '../../components/modals/InternetModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SalesBooster from '../salesBooster/SalesBooster';
import SalesBoosterTriggerButton from '../../components/organisms/SalesBoosterTriggerButton';


const Dashboard = ({ navigation }) => {
  const [showKyc, setShowKyc] = useState(true)
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [CampainVideoVisible, setCmpainVideoVisible] = useState(true);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false)
  const [membership, setMembership] = useState()
  const [scanningDetails, seScanningDetails] = useState()
  const [notifModal, setNotifModal] = useState(false)
  const [notifData, setNotifData] = useState(null)
  const [connected, setConnected] = useState(true)
  const[error, setError] = useState(false);
  const[message, setMessage] = useState("")

  const focused = useIsFocused()
  const dispatch = useDispatch()
  const dashboardItems = useSelector(state=>state.dashboardData.dashboardData)
  const userId = useSelector((state) => state.appusersdata.userId)
  const userData = useSelector(state => state.appusersdata.userData);
  
  const isDistributor = userData?.user_type_id == 3
  const isConnected = useSelector(state => state.internet.isConnected);
  const pointSharingData = useSelector(state => state.pointSharing.pointSharing)
  const bannerArray = useSelector(state => state.dashboardData.banner)

  
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : '#FFB533';

  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loader.gif")
  ).uri;
  console.log("pointSharingData", JSON.stringify(pointSharingData), userData)
  console.log("user id is from dashboard", userId)
  console.log(focused)
  let startDate, endDate

  const [getActiveMembershipFunc, {
    data: getActiveMembershipData,
    error: getActiveMembershipError,
    isLoading: getActiveMembershipIsLoading,
    isError: getActiveMembershipIsError
  }] = useGetActiveMembershipMutation()
  
  const [
    fetchAllQrScanedList,
    {
      data: fetchAllQrScanedListData,
      isLoading: fetchAllQrScanedListIsLoading,
      error: fetchAllQrScanedListError,
      isError: fetchAllQrScanedListIsError,
    },
  ] = useFetchAllQrScanedListMutation();

  const [getKycStatusFunc, {
    data: getKycStatusData,
    error: getKycStatusError,
    isLoading: getKycStatusIsLoading,
    isError: getKycStatusIsError
  }] = useGetkycStatusMutation()

  const [userPointFunc, {
    data: userPointData,
    error: userPointError,
    isLoading: userPointIsLoading,
    isError: userPointIsError
  }] = useFetchUserPointsMutation()

  

  
  const id = useSelector(state => state.appusersdata.id);

  const fetchPoints = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      userId: id,
      token: token
    }
    userPointFunc(params)

  }


  useEffect(() => {
    if (isConnected) {
      console.log("internet status", isConnected)

      setConnected(isConnected.isConnected)
      console.log("is connected", isConnected)

    }
  }, [isConnected])

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("remote", remoteMessage)
      // Alert.alert(JSON.stringify(remoteMessage?.notification?.title ? remoteMessage?.notification?.title : "Notification"), JSON.stringify(remoteMessage?.notification?.body));
      setNotifModal(true)
      setNotifData(remoteMessage?.notification)

    });

    return unsubscribe;
  }, []);




  useEffect(() => {
    fetchPoints()
    dispatch(setQrIdList([]))
  }, [focused])

  // useEffect(() => {
  //   (async () => {
  //     const credentials = await Keychain.getGenericPassword();
  //     const token = credentials.username;
  //     let queryParams = `?user_type_id=${userData?.user_type_id}&app_user_id=${userData?.id}&limit=${1}`;
  //     if (startDate && endDate) {
  //       queryParams += `&from_date=${moment(startDate).format(
  //         "YYYY-MM-DD"
  //       )}&to_date=${moment(endDate).format("YYYY-MM-DD")}`;
  //     } else if (startDate) {
  //       queryParams += `&from_date=${moment(startDate).format(
  //         "YYYY-MM-DD"
  //       )}`;
  //     }

  //     console.log("queryParams", queryParams);

  //     fetchAllQrScanedList({
  //       token: token,

  //       query_params: queryParams,
  //     });
  //   })();
  // }, [focused]);
  

  useEffect(() => {
    if (fetchAllQrScanedListData) {
      // console.log("fetchAllQrScanedListData",JSON.stringify(fetchAllQrScanedListData))
      if (fetchAllQrScanedListData.success) {
        if (fetchAllQrScanedListData.body.total !== 0) {
          seScanningDetails(fetchAllQrScanedListData.body)

        }
      }
    }
    else if (fetchAllQrScanedListError) {
      console.log("fetchAllQrScanedListError", fetchAllQrScanedListError)
    }
  }, [fetchAllQrScanedListData], fetchAllQrScanedListError)

  useEffect(() => {
    if (getActiveMembershipData) {
      console.log("getActiveMembershipData", JSON.stringify(getActiveMembershipData))
      if (getActiveMembershipData.success) {
        setMembership(getActiveMembershipData.body?.tier.name)
      }
    }
    else if (getActiveMembershipError) {
      console.log("getActiveMembershipError", getActiveMembershipError)
      if (getActiveMembershipError.status == 401) {
        const handleLogout = async () => {
          try {

            await AsyncStorage.removeItem('loginData');
            navigation.navigate("Splash")
            navigation.reset({ index: 0, routes: [{ name: 'Splash' }] }); // Navigate to Splash screen
          } catch (e) {
            console.log("error deleting loginData", e);
          }
        };
        handleLogout();
      }
      else {
        setError(true)
        setMessage("Unable to fetch user point history.")
      }
    }
  }, [getActiveMembershipData, getActiveMembershipError])

  useEffect(() => {
    if (getKycStatusData) {
      console.log("getKycStatusData", getKycStatusData)
      if (getKycStatusData.success) {
        const tempStatus = Object.values(getKycStatusData.body)

        setShowKyc(tempStatus.includes(false))

        dispatch(
          setKycData(getKycStatusData.body)
        )


      }
    }
    else if (getKycStatusError) {
      console.log("getKycStatusError", getKycStatusError)
      if(getKycStatusError.status == 401)
        {
          const handleLogout = async () => {
            try {
              
              await AsyncStorage.removeItem('loginData');
              navigation.navigate("Splash")
              navigation.reset({ index: 0, routes: [{ name: 'Splash' }] }); // Navigate to Splash screen
            } catch (e) {
              console.log("error deleting loginData", e);
            }
          };
          handleLogout();
        }
        else{
        setError(true)
        setMessage("Unable to fetch user point history.")
        }
    }
  }, [getKycStatusData, getKycStatusError])

  


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
    const enableLocation = () => {
      Alert.alert(
        'Enable Location Services',
        'Location services are disabled. Do you want to enable them?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: openSettings },
        ],
      );
    };
    
      try {
        Geolocation.getCurrentPosition((res) => {
          setLocationEnabled(true)
          console.log("res", res)
          lat = res.coords.latitude
          lon = res.coords.longitude
          // getLocation(JSON.stringify(lat),JSON.stringify(lon))
          console.log("latlongasdasds", lat, lon)
          var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${res?.coords?.latitude},${res?.coords?.longitude}
            &location_type=ROOFTOP&result_type=street_address&key=${GoogleMapsKey}`

          fetch(url).then(response => response.json()).then(json => {
            // console.log("location address=>", JSON.stringify(json));
            const formattedAddress = json?.results[0]?.formatted_address
            const formattedAddressArray = formattedAddress?.split(',')

            let locationJson = {

              lat: json?.results[0]?.geometry?.location?.lat === undefined ? "N/A" : json?.results[0]?.geometry?.location?.lat,
              lon: json?.results[0]?.geometry?.location?.lng === undefined ? "N/A" : json?.results[0]?.geometry?.location?.lng,
              address: formattedAddress === undefined ? "N/A" : formattedAddress

            }

            const addressComponent = json?.results[0]?.address_components
            // console.log("addressComponent", addressComponent)
            for (let i = 0; i <= addressComponent?.length; i++) {
              if (i === addressComponent?.length) {
                dispatch(setLocation(locationJson))
                
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


            console.log("formattedAddressArray", locationJson)

          })
        }, (error) => {
          setLocationEnabled(false)
          console.log("error", error)
          if (error.code === 1) {
            // Permission Denied
            Geolocation.requestAuthorization()

          } else if (error.code === 2) {
            // Position Unavailable
            enableLocation()

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
      catch (e) {
        console.log("error in fetching location", e)
      }
   

  }, [navigation])
  
  useEffect(() => {
    if (pointSharingData) {
      const keys = Object.keys(pointSharingData.point_sharing_bw_user.user)
      const values = Object.values(pointSharingData.point_sharing_bw_user.user)
      const percentageKeys = Object.keys(pointSharingData.point_sharing_bw_user.percentage)
      const percentageValues = Object.values(pointSharingData.point_sharing_bw_user.percentage)

      let eligibleUser = ''
      let percentage;
      let index;
      for (var i = 0; i < values.length; i++) {
        if (values[i].includes(userData?.user_type)) {
          eligibleUser = keys[i]
          index = percentageKeys.includes(eligibleUser) ? percentageKeys.indexOf(eligibleUser) : undefined
          const pointSharingPercent = percentageValues[index]
          // console.log(pointSharingPercent)
          console.log("On", userData?.user_type, "scan", pointSharingPercent, "% Points would be shared with", eligibleUser)
          dispatch(setPercentagePoints(pointSharingPercent))
          dispatch(setShouldSharePoints())

        }
      }
    }



  }, [])
  useEffect(() => {
    const getDashboardData = async () => {
      try {
        // Retrieve the credentials
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(
            'Credentials successfully loaded for user ' + credentials.username
          );
          const token = credentials.username
          const form_type = "2"
          console.log("token from dashboard ", token)
          token && getKycStatusFunc(token)
          // token && getBannerFunc(token)
          // token && getWorkflowFunc({ userId, token })
          // token && getFormFunc({ form_type, token })
          // getMembership()
        } else {
          console.log('No credentials stored');
        }
      } catch (error) {
        console.log("Keychain couldn't be accessed!", error);
      }
    }
    getDashboardData()

  }, [])



  

  // ozone change

  
  

  const platformMarginScroll = Platform.OS === 'ios' ? 0 : 0

  const getMembership = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' + credentials.username
      );
      const token = credentials.username
      getActiveMembershipFunc(token)
    }
  }

  const hideSuccessModal = () => {
    setIsSuccessModalVisible(false);
  };

  const showSuccessModal = () => {
    setIsSuccessModalVisible(true);
    console.log("hello")
  };

  

  const NoInternetComp = () => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', width: '90%' }}>
        <Text style={{ color: 'black' }}>No Internet Connection</Text>
        <Text style={{ color: 'black' }}>Please check your internet connection and try again.</Text>
      </View>
    )
  }
  const notifModalFunc = () => {
    return (
      <View style={{ height: 130 }}>
        <View style={{ height: '100%', width: '100%', alignItems: 'center', }}>
          <View>
            {/* <Bell name="bell" size={18} style={{marginTop:5}} color={ternaryThemeColor}></Bell> */}

          </View>
          <PoppinsTextLeftMedium content={notifData?.title ? notifData?.title : ""} style={{ color: ternaryThemeColor, fontWeight: '800', fontSize: 20, marginTop: 8 }}></PoppinsTextLeftMedium>

          <PoppinsTextLeftMedium content={notifData?.title ? notifData?.title : ""} style={{ color: '#000000', marginTop: 10, padding: 10, fontSize: 15, fontWeight: '600' }}></PoppinsTextLeftMedium>
        </View>

        <TouchableOpacity style={[{
          backgroundColor: ternaryThemeColor, padding: 6, borderRadius: 5, position: 'absolute', top: -10, right: -130
        }]} onPress={() => setNotifModal(false)} >
          <Close name="close" size={17} color="#ffffff" />
        </TouchableOpacity>

      </View>
    )
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: "#F7F9FA", flex: 1, height: '100%' }}>


      <ScrollView style={{ width: '100%', marginBottom: platformMarginScroll, height: '100%' }}>
        {!connected && <InternetModal comp={NoInternetComp} />}
        <DrawerHeader></DrawerHeader>
        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', marginBottom: 10 }}>
          <PoppinsTextLeftMedium style={{ color: ternaryThemeColor, fontWeight: 'bold', fontSize: 19, marginLeft: 20 }} content={`Welcome ${userData?.name}`}></PoppinsTextLeftMedium>
          {/* {getActiveMembershipData?.body!==null && <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft:10
              }}>
                 <TouchableOpacity style={{alignItems:'center',justifyContent:'center',flexDirection:'row',backgroundColor:ternaryThemeColor,padding:4,borderRadius:4}} onPress={
                showSuccessModal
              }>
              <Image
                style={{ height: 16, width: 16, resizeMode: 'contain', }}
                source={require('../../../assets/images/reward.png')}></Image>
             
                <PoppinsTextMedium
                  style={{ color: 'white', fontSize: 14 }}
                  content={membership}></PoppinsTextMedium>
              </TouchableOpacity>

            </View>} */}
          {/* <PlatinumModal isVisible={isSuccessModalVisible} onClose={hideSuccessModal} getActiveMembershipData={getActiveMembershipData} /> */}

        </View>
        <View style={{ width: '100%', alignItems: "center", justifyContent: "center", height: "90%" }}>
          <View style={{ height: 200, width: '100%', marginBottom: 20 }}>
            {bannerArray &&
              <Banner images={bannerArray}></Banner>
            }

            {/* <CampaignVideoModal isVisible={CampainVideoVisible} onClose={()=>{
              setCmpainVideoVisible(false)
            }} /> */}
          </View>
          {/* Ozone specific change do not show for sales */}
          {
            userData?.user_type_id !== 13 && !isDistributor &&
            <View style={{ width: "90%", height: 50, backgroundColor: 'white', marginBottom: 20, flexDirection: 'row', alignItems: 'center', borderColor: '#808080', borderWidth: 0.3, borderRadius: 10 }}>

              <View style={{ backgroundColor: 'white', width: '42%', marginHorizontal: 20 }}>
                {
                  <PoppinsText content={`Balance Points ${userPointData?.body?.point_balance ? userPointData?.body?.point_balance : ": 0"}`}
                    style={{ color: 'black', fontWeight: 'bold' }}></PoppinsText>}
              </View>

              <View style={{ height: '100%', borderWidth: 0.4, color: "#808080", opacity: 0.3, width: 0.2 }}>
              </View>

              <View style={{ backgroundColor: 'white', paddingLeft: '8%' }}>
                <TouchableOpacity style={{ backgroundColor: ternaryThemeColor, padding: 10, borderRadius: 5, width: 120, alignItems: 'center' }} onPress={() => { navigation.navigate("RedeemedHistory") }}>
                  <PoppinsTextLeftMedium style={{ color: 'white', fontWeight: '800' }} content="Redeem"  ></PoppinsTextLeftMedium>
                </TouchableOpacity>
              </View>

            </View>
          }
         

          {/* temporary */}
          {/* {userData.user_type_id !== 13 && scanningDetails && scanningDetails?.data?.length &&  <ScannedDetailsBox lastScannedDate={moment(scanningDetails?.data[0]?.scanned_at).format("DD MMM YYYY")} scanCount={scanningDetails.total}></ScannedDetailsBox>} */}
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 4 }}>
            {/* <DashboardDataBox header="Total Points"  data="5000" image={require('../../../assets/images/coin.png')} ></DashboardDataBox>
          <DashboardDataBox header="Total Points"  data="5000" image={require('../../../assets/images/coin.png')} ></DashboardDataBox> */}

          </ScrollView>
          {dashboardItems && <DashboardMenuBox navigation={navigation} data={dashboardItems}></DashboardMenuBox>}
          <View style={{ width: '100%', alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            {showKyc && <KYCVerificationComponent buttonTitle="Complete Your KYC" title="Your KYC is not completed"></KYCVerificationComponent>}
          </View>
          {(userData?.user_type)?.toLowerCase() !== "dealer" && (userData?.user_type)?.toLowerCase() !== "sales" && <View style={{ flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center" }}>
            <DashboardSupportBox text="Rewards" backgroundColor="#D9C7B6" borderColor="#FEE8D4" image={require('../../../assets/images/reward_dashboard.png')} ></DashboardSupportBox>
            <DashboardSupportBox text="Customer Support" backgroundColor="#BCB5DC" borderColor="#E4E0FC" image={require('../../../assets/images/support.png')} ></DashboardSupportBox>
            <DashboardSupportBox text="Feedback" backgroundColor="#D8C8C8" borderColor="#FDDADA" image={require('../../../assets/images/feedback.png')} ></DashboardSupportBox>

          </View>}
        </View>





      </ScrollView>
      {/* {
        getActiveMembershipIsLoading && getFormIsLoading && getWorkflowIsLoading && getBannerIsLoading && getDashboardIsLoading && fetchAllQrScanedListIsLoading && getKycStatusIsLoading && userPointIsLoading && <FastImage
          style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '50%' }}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      } */}

      <ModalWithBorder
        modalClose={() => {
          setNotifModal(false)
        }}
        message={"message"}
        openModal={notifModal}
        comp={notifModalFunc}></ModalWithBorder>
    </View>
  );
}

const styles = StyleSheet.create({})

export default Dashboard;