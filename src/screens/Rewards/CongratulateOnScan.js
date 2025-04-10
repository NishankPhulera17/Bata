import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Platform,
  ActivityIndicator
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import CongratulationActionBox from "../../components/atoms/CongratulationActionBox";
import Win from "../../components/molecules/Win";
import ButtonSquare from "../../components/atoms/buttons/ButtonSquare";
import { useGetCouponOnCategoryMutation } from "../../apiServices/workflow/rewards/GetCouponApi";
import {
  useCheckUserPointMutation,
  useUserPointsEntryMutation,
} from "../../apiServices/workflow/rewards/GetPointsApi";
import {
  useGetallWheelsByUserIdMutation,
  useCreateWheelHistoryMutation,
} from "../../apiServices/workflow/rewards/GetWheelApi";
import {
  useCheckQrCodeAlreadyRedeemedMutation,
  useAddCashbackEnteriesMutation,
} from "../../apiServices/workflow/rewards/GetCashbackApi";
import * as Keychain from "react-native-keychain";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import { slug } from "../../utils/Slug";
import { useExtraPointEnteriesMutation } from "../../apiServices/pointSharing/pointSharingApi";
import { useAddBulkPointOnProductMutation, useAddBulkPointOnProductReturnMutation } from "../../apiServices/bulkScan/BulkScanApi";
import { setQrIdList } from "../../../redux/slices/qrCodeDataSlice";
import Celebrate from "react-native-vector-icons/MaterialIcons";
import Error from "react-native-vector-icons/MaterialIcons"
import { useGetActiveMembershipMutation } from '../../apiServices/membership/AppMembershipApi';
import ErrorModal from "../../components/modals/ErrorModal";
import { useGetAppThemeDataMutation } from "../../apiServices/appTheme/AppThemeApi";
import { setShowCampaign } from "../../../redux/slices/campaignSlice";
// import { useGetAppUsersDataByIdMutation } from "../../apiServices/appUsers/AppUsersApi";


const CongratulateOnScan = ({ navigation, route }) => {
  const [showPoints, setShowPoints] = useState();
  const [showBulkScanPoints, setShowBulkScanPoints] = useState();
  const [membershipPercent, setMembershipPercent] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [PercentMultiplier, setPercentMultiplier] = useState(null)
  const buttonThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "#ef6110";

  //  data from scanning qr code
  const dispatch = useDispatch();
  const qrData = useSelector((state) => state.qrData.qrData);
  console.log("Qr data", qrData)
  // product data recieved from scanned product
  const productData = useSelector((state) => state.productData.productData);
  const pointSharingData = useSelector(
    (state) => state.pointSharing.pointSharing
  );
  const qrIdList = useSelector((state) => state.qrData.qrIdList);
  const userData = useSelector((state) => state.appusersdata.userData);

  console.log("The QR List ", qrIdList)
  console.log("userData", `${userData.user_type}_points`, pointSharingData);
  const pointPercentage = useSelector(
    (state) => state.pointSharing.percentagePoints
  );
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const shouldSharePoints = useSelector(
    (state) => state.pointSharing.shouldSharePoints
  );
  // getting location from redux state
  const location = useSelector((state) => state?.userLocation?.location);
  console.log("shouldSharePoints", shouldSharePoints, productData);
  console.log("location", location);
  console.log('Location', location, userData, productData, qrData);
  const height = Dimensions.get("window").height;
  // workflow for the given user
  const workflowProgram = route.params.workflowProgram;
  const rewardType = route.params.rewardType;
  console.log("rewardType", rewardType );
  const platform = Platform.OS === "ios" ? "1" : "2";

  const isDistributor = userData?.user_type_id == 3

  const [
    getCouponOnCategoryFunc,
    {
      data: getCouponOnCategoryData,
      error: getCouponOnCategoryError,
      isLoading: getCouponOnCategoryIsLoading,
      isError: getCouponOnCategoryIsError,
    },
  ] = useGetCouponOnCategoryMutation();


  const [
    addBulkPointOnProductFunc,
    {
      data: addBulkPointOnProductData,
      error: addBulkPointOnProductError,
      isLoading: addBulkPointOnProductIsLoading,
      isError: addBulkPointOnProductIsError,
    },
  ] = useAddBulkPointOnProductMutation();

  const [
    addBulkPointOnProductReturnFunc,
    {
      data: addBulkPointOnProductReturnData,
      error: addBulkPointOnProductReturnError,
      isLoading: addBulkPointOnProductReturnIsLoading,
      isError: addBulkPointOnProductReturnIsError,
    },
  ] = useAddBulkPointOnProductReturnMutation();




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
    checkUserPointFunc,
    {
      data: checkUserPointData,
      error: checkUserPointError,
      isLoading: checkUserPointIsLoading,
      isError: checkUserPointIsError,
    },
  ] = useCheckUserPointMutation();

  const [
    userPointEntryFunc,
    {
      data: userPointEntryData,
      error: userPointEntryError,
      isLoading: userPointEntryIsLoading,
      isError: userPointEntryIsError,
    },
  ] = useUserPointsEntryMutation();
  const [
    extraPointEntryFunc,
    {
      data: extraPointEntryData,
      error: extraPointEntryError,
      isLoading: extraPointEntryIsLoading,
      isError: extraPointEntryIsError,
    },
  ] = useExtraPointEnteriesMutation();

  const [
    getAllWheelsByUserIdFunc,
    {
      data: getAllWheelsByUserIdData,
      error: getAllWheelsByUserIdError,
      isLoading: getAllWheelsByUserIdIsLoading,
      isError: getAllWheelsByUserIdIsError,
    },
  ] = useGetallWheelsByUserIdMutation();

  const [
    createWheelHistoryFunc,
    {
      data: createWheelHistoryData,
      error: createWheelHistoryError,
      isLoading: createWheelHistoryIsLoading,
      isError: createWheelHistoryIsError,
    },
  ] = useCreateWheelHistoryMutation();

  const [getActiveMembershipFunc, {
    data: getActiveMembershipData,
    error: getActiveMembershipError,
    isLoading: getActiveMembershipIsLoading,
    isError: getActiveMembershipIsError
  }] = useGetActiveMembershipMutation();
  const [
    checkQrCodeAlreadyRedeemedFunc,
    {
      data: checkQrCodeAlreadyRedeemedData,
      error: checkQrCodeAlreadyRedeemedError,
      isLoading: checkQrCodeAlreadyRedeemedIsLoading,
      isError: checkQrCodeAlreadyRedeemedIsError,
    },
  ] = useCheckQrCodeAlreadyRedeemedMutation();

  const [
    addCashbackEnteriesFunc,
    {
      data: addCashbackEnteriesData,
      error: addCashbackEnteriesError,
      isLoading: addCashbackEnteriesIsLoading,
      isError: addCashbackEnteriesIsError,
    },
  ] = useAddCashbackEnteriesMutation();

  // const [
  //   getUsersByIdFunc,
  //   {
  //     data: getUsersByIdData,
  //     error: getUsersByIdError,
  //     isLoading: getUsersByIdDataIsLoading,
  //     isError: getUsersDataByIdIsError,
  //   },
  // ] = useGetAppUsersDataByIdMutation();

  // useEffect(() => {
  //   const params = {
  //     user_type_id: userData?.user_type_id
  //   }
  //   getUsersByIdFunc(params);
  // }, [])


  // useEffect(() => {
  //   getMembership()
  // }, [])

  // useEffect(() => {
  //   getAppTheme("Bata")
  // }, [])




  // useEffect(() => {
  //   if (getUsersByIdData) {
  //     console.log("getUsersByIdData", getUsersByIdData)
  //   }
  //   else {
  //     console.log("getUsersByIdError", getUsersByIdError)
  //   }
  // }, [getUsersByIdData, getUsersByIdError])


  // useEffect(() => {
  //   if (getAppThemeData) {
  //     console.log("getAppThemeData", getAppThemeData)
  //     setPercentMultiplier(Number(getAppThemeData?.body?.points_sharing?.percentage_points_value))
  //   }
  //   else {
  //     console.log("getAppThemeError", getAppThemeError)
  //   }
  // }, [getAppThemeData, getAppThemeError])



  


  useEffect(() => {
    if (getActiveMembershipData) {
      console.log("getActiveMembershipData", JSON.stringify(getActiveMembershipData))
      if (getActiveMembershipData?.success) {

        console.log("getActiveMembershipData.body.points", getActiveMembershipData?.body?.points)
      }
    }
    else if (getActiveMembershipError) {
      console.log("getActiveMembershipError", getActiveMembershipError)
    }
  }, [getActiveMembershipData, getActiveMembershipError])


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
  const fetchRewardsAccToWorkflow = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        "Credentials successfully loaded for user " + credentials.username
      );

      const token = credentials.username;

      if (rewardType === "Static Coupon") {
        const params = {
          token: token,
          catId: productData.category_id,
          qr_code: qrData.unique_code,
        };
        getCouponOnCategoryFunc(params);
      }
      else if (rewardType === "Points On Product") {
        console.log("QRIDLIST==========>", qrIdList)
        // if (qrIdList.length ==1 ) {
        //   const params = {
        //     token: token,
        //     qr_code: qrIdList,
        //   };

        //   console.log("shouldSharePoints", shouldSharePoints);
        //   if (pointSharingData) {
        //     if (pointSharingData?.flat_points === true) {
        //       if (shouldSharePoints) {
        //         const points =
        //           Number(productData[`${userData.user_type}_points`]) *
        //           (Number(pointPercentage) / 100)


        //         console.log("extra flat points", points, pointPercentage);
        //         const body = {
        //           data: {
        //             // app_user_id: userData.id.toString(),
        //             // user_type_id: userData.user_type_id,
        //             // user_type: userData.user_type,
        //             product_id: productData.product_id,
        //             product_code: productData.product_code,
        //             platform_id: Number(platform),
        //             pincode:
        //               location.postcode === undefined ? "N/A" : location.postcode,
        //             platform: "mobile",
        //             state: location.state === undefined ? "N/A" : location.state,
        //             district:
        //               location.district === undefined ? "N/A" : location.district,
        //             city: location.city === undefined ? "N/A" : location.city,
        //             area:
        //               location.district === undefined ? "N/A" : location.district,
        //             known_name:
        //               location.city === undefined ? "N/A" : location.city,
        //             lat:
        //               location.lat === undefined ? "N/A" : String(location.lat),
        //             log:
        //               location.lon === undefined ? "N/A" : String(location.lon),
        //             method_id: 1,
        //             method: "point on product",
        //             points: points,
        //             type: "points_sharing",
        //             point_earned_through_type: "points_sharing",
        //           },
        //           qrId: Number(qrData.qr_id),
        //           tenant_id: slug,
        //           token: token,
        //         };
        //         extraPointEntryFunc(body);
        //       } else if (!shouldSharePoints) {
        //         // alert("Points can't be shared for this tenant");
        //       }
        //     } else if (pointSharingData?.percentage_points === true) {
        //       console.log("percentage_points_value", productData, pointSharingData)
        //       const point =
        //         productData["mrp"] *
        //         (pointSharingData["percentage_points_value"] / 100);
        //       const memberShipBonus = (points * Number(getActiveMembershipData?.body.points !== undefined ? getActiveMembershipData?.body.points : 0)) / 100

        //       const totalPoints = point + memberShipBonus
        //       const points =
        //         totalPoints *
        //         (Number(pointPercentage) / 100);

        //       console.log("mrp points", points);
        //       if (shouldSharePoints) {
        //         const body = {
        //           data: {
        //             // app_user_id: userData.id.toString(),
        //             // user_type_id: userData.user_type_id,
        //             // user_type: userData.user_type,
        //             product_id: productData.product_id,
        //             product_code: productData.product_code,
        //             platform_id: Number(platform),
        //             pincode:
        //               location.postcode === undefined ? "N/A" : location.postcode,
        //             platform: "mobile",
        //             state: location.state === undefined ? "N/A" : location.state,
        //             district:
        //               location.district === undefined ? "N/A" : location.district,
        //             city: location.city === undefined ? "N/A" : location.city,
        //             area:
        //               location.district === undefined ? "N/A" : location.district,
        //             known_name:
        //               location.city === undefined ? "N/A" : location.city,
        //             lat:
        //               location.lat === undefined ? "N/A" : String(location.lat),
        //             log:
        //               location.lon === undefined ? "N/A" : String(location.lon),
        //             method_id: 1,
        //             method: "point on product",
        //             points: points,
        //             type: "points_sharing",
        //             point_earned_through_type: "points_sharing",
        //           },
        //           qrId: Number(qrData.qr_id),
        //           tenant_id: slug,
        //           token: token,
        //         };
        //         extraPointEntryFunc(body);
        //       } else if (!shouldSharePoints) {
        //         // alert("Points can't be shared for this tenant");
        //       }
        //     }
        //   }

        //   if(qrIdList.length==1){
        //     checkUserPointFunc(params);
        //     console.log("checkuserpointfuncparams", params)
        //   }
          
       

        // }
        // else {
          const params = {
            data: {
              qrs: qrIdList,
              point_sharing: pointSharingData,
              platform_id: Number(platform),
              pincode:
                location.postcode === undefined ? "N/A" : location.postcode,
              platform: "mobile",
              state: location.state === undefined ? "N/A" : location.state,
              district:
                location.district === undefined ? "N/A" : location.district,
              city: location.city === undefined ? "N/A" : location.city,
              area: location.district === undefined ? "N/A" : location.district,
              known_name: location.city === undefined ? "N/A" : location.city,
              lat: location.lat === undefined ? "N/A" : String(location.lat),
              log: location.lon === undefined ? "N/A" : String(location.lon),
              method_id: 1,
              method: "Bulk Scan",
              token: token,
            },
            token: token,
          };
          console.log("addBulkPointOnProductFunc", JSON.stringify(params))


          addBulkPointOnProductFunc(params);

        // }
      }
      else if (isDistributor && rewardType == "barcode revert") {
        if (isDistributor) {
          const params = {
            data: {
              qrs: qrIdList,
              // point_sharing: pointSharingData,
              platform_id: Number(platform),
              pincode:
                location.postcode === undefined ? "N/A" : location.postcode,
           
              state: location.state === undefined ? "N/A" : location.state,
              district:
                location.district === undefined ? "N/A" : location.district,
              city: location.city === undefined ? "N/A" : location.city,
              // area: location.district === undefined ? "N/A" : location.district,
              // known_name: location.city === undefined ? "N/A" : location.city,
              lat: location.lat === undefined ? "N/A" : String(location.lat),
              log: location.lon === undefined ? "N/A" : String(location.lon),
              // method_id: 1,
              address:"test",
              // method: "Bulk Scan", 
              // token: token,
            },
            token: token,
          };
          console.log("bulk point Data distributor", params)
          if(isDistributor){
          addBulkPointOnProductReturnFunc(params)
            
          }
        }
      }
      else if (rewardType === "Wheel") {
        const params = {
          token: token,
          id: userData.id.toString(),
        };
        getAllWheelsByUserIdFunc(params);
      } else if (rewardType === "Cashback") {
        const params = {
          token: token,
          qrId: qrData.qr_id,
        };
        checkQrCodeAlreadyRedeemedFunc(params);
      }
    } else {
      console.log("No credentials stored");
    }
  };

  useEffect(() => {
    fetchRewardsAccToWorkflow();
  }, [rewardType]);

  useEffect(() => {
    if (addBulkPointOnProductData) {
      console.log(
        "addBulkPointOnProductData",
        JSON.stringify(addBulkPointOnProductData)
      );
      if (addBulkPointOnProductData.success) {
        let tp = 0
        dispatch(setQrIdList([]));
        const bulkPoints = addBulkPointOnProductData.body.body.map((item, index) => {
          return item["points_on_product"];

        });

        setTotalPoints(addBulkPointOnProductData.body.total_points)
        setShowBulkScanPoints(bulkPoints);
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 5000);
      }
    } else if (addBulkPointOnProductError) {
      console.log("addBulkPointOnProductError", addBulkPointOnProductError);
    }
  }, [addBulkPointOnProductData, addBulkPointOnProductError]);


  useEffect(() => {
    if (addBulkPointOnProductReturnData) {
      console.log(
        "addBulkPointOnProductReturnData",
        JSON.stringify(addBulkPointOnProductReturnData)
      );
      if (addBulkPointOnProductReturnData.success) {
        let tp = 0
        dispatch(setQrIdList([]));
        const bulkPoints = addBulkPointOnProductReturnData.body.body.map((item, index) => {
          return item["points_on_product"];

        });

        console.log("addBulkPointOnProductReturnData.body.total_points",addBulkPointOnProductReturnData.body.total_points )

        setTotalPoints(addBulkPointOnProductReturnData.body.total_points)
        setShowBulkScanPoints(bulkPoints);
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 5000);
      }
    } else if (addBulkPointOnProductReturnError) {
      console.log("addBulkPointOnProductReturnError", addBulkPointOnProductReturnError);
    }
  }, [addBulkPointOnProductReturnData, addBulkPointOnProductReturnError]);




  useEffect(() => {
    if (addCashbackEnteriesData) {
      console.log("addCashbackEnteriesData", addCashbackEnteriesData);
      if (addCashbackEnteriesData.success) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 1000);
      }
    } else if (addCashbackEnteriesError) {
      console.log("addCashbackEnteriesError", addCashbackEnteriesError);
    }
  }, [addCashbackEnteriesData, addCashbackEnteriesError]);

  useEffect(() => {
    if (getAllWheelsByUserIdData) {
      console.log(
        "getAllWheelsByUserIdData",
        getAllWheelsByUserIdData.body.data
      );
      createWheelHistory(getAllWheelsByUserIdData.body.data);
    } else if (getAllWheelsByUserIdError) {
      console.log("getAllWheelsByUserIdError", getAllWheelsByUserIdError);
    }
  }, [getAllWheelsByUserIdData, getAllWheelsByUserIdError]);

  useEffect(() => {
    if (extraPointEntryData) {
      console.log("extraPointEntryData", extraPointEntryData);
    } else if (extraPointEntryError) {
      console.log("extraPointEntryError", extraPointEntryError);
    }
  }, [extraPointEntryError, extraPointEntryData]);
  const createWheelHistory = async (data) => {
    console.log("wheel history data", data);
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      token: token,
      body: {
        wc_id: data[0].wc_id,
        w_id: data[0].id,
        qr_id: qrData.qr_id,
      },
    };
    createWheelHistoryFunc(params);
  };

  useEffect(() => {
    if (createWheelHistoryData) {
      console.log("createWheelHistoryData", createWheelHistoryData);
      // if(createWheelHistoryData.success)
      // {
      //   setTimeout(() => {
      //     handleWorkflowNavigation();
      //   }, 1000);
      // }
    } else if (createWheelHistoryError) {
      console.log("createWheelHistoryError", createWheelHistoryError);
      // if(createWheelHistoryError.status===409)
      // {
      //   setTimeout(() => {
      //     handleWorkflowNavigation();
      //   }, 1000);
      // }
    }
  }, [createWheelHistoryData, createWheelHistoryError]);

  useEffect(() => {
    if (checkQrCodeAlreadyRedeemedData) {
      console.log(
        "checkQrCodeAlreadyRedeemedData",
        checkQrCodeAlreadyRedeemedData
      );
      if (!checkQrCodeAlreadyRedeemedData.body) {
        addCashbackEnteries();
      } else if (checkQrCodeAlreadyRedeemedError) {
        console.log(checkQrCodeAlreadyRedeemedError);
      }
    }
  }, [checkQrCodeAlreadyRedeemedData, checkQrCodeAlreadyRedeemedError]);

  const addCashbackEnteries = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      body: {
        app_user_id: userData.id.toString(),
        user_type_id: userData.user_type_id,
        user_type: userData.user_type,
        product_id: productData.product_id,
        product_code: productData.product_code,
        platform_id: platform,
        pincode: location.postcode == undefined ? "N/A" : location.postcode,
        platform: "mobile",
        state: location.state == undefined ? "N/A" : location.state,
        district: location.district == undefined ? "N/A" : location.district,
        city: location.city == undefined ? "N/A" : location.city,
        area: location.state == undefined ? "N/A" : location.state,
        known_name: location.city == undefined ? "N/A" : location.city,
        lat: location.lat === undefined ? "N/A" : String(location.lat),
        log: location.lon === undefined ? "N/A" : String(location.lon),
        method_id: "1",
        method: "Cashback",
        cashback: "",
      },

      token: token,
      qrId: qrData.qr_id,
    };

    console.log("add cashback entries func============>", params)

    addCashbackEnteriesFunc(params);
  };

  useEffect(() => {
    if (getCouponOnCategoryData) {
      console.log("getCouponOnCategoryData", getCouponOnCategoryData);
      if (getCouponOnCategoryData.success) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 3000);
      }
    } else if (getCouponOnCategoryError) {
      console.log("getCouponOnCategoryError", getCouponOnCategoryError);
      if (getCouponOnCategoryError.status === 409) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 3000);
      } else if (
        getCouponOnCategoryError.data.message === "No Active Coupons Exist"
      ) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 3000);
      }
    }
  }, [getCouponOnCategoryData, getCouponOnCategoryError]);

  useEffect(() => {
    if (checkUserPointData) {
      console.log("checkUserPointData", checkUserPointData,qrIdList);
      if (!checkUserPointData.body) {
        if (pointSharingData?.flat_points) {
          const points = productData[`${userData.user_type}_points`]

          const memberShipBonus = (points * Number(getActiveMembershipData?.body?.points !== undefined ? getActiveMembershipData?.body?.points : 0)) / 100

          const totalPoints = points + memberShipBonus
          setShowPoints(totalPoints);
          const submitPoints = async () => {
            const credentials = await Keychain.getGenericPassword();
            const token = credentials.username;
            const body = {
              data: {
                app_user_id: userData.id.toString(),
                user_type_id: userData.user_type_id,
                user_type: userData.user_type,
                product_id: productData.product_id,
                product_code: productData.product_code,
                platform_id: Number(platform),
                pincode:
                  location.postcode === undefined ? "N/A" : location.postcode,
                platform: "mobile",
                state: location.state === undefined ? "N/A" : location.state,
                district:
                  location.district === undefined ? "N/A" : location.district,
                city: location.city === undefined ? "N/A" : location.city,
                area:
                  location.district === undefined ? "N/A" : location.district,
                known_name: location.city === undefined ? "N/A" : location.city,
                lat: location.lat === undefined ? "N/A" : String(location.lat),
                log: location.lon === undefined ? "N/A" : String(location.lon),
                method_id: 1,
                method: "point on product",
                points: totalPoints,
                type: "point on product",
              },
              qrId: qrIdList,
              tenant_id: slug,
              token: token,
            };
            console.log("userPointEntryFunc", body);
            userPointEntryFunc(body);
          };
          submitPoints();
        } else if (pointSharingData?.percentage_points) {
          console.log("percentage_points",qrData)
          const submitPoints = async () => {
            const credentials = await Keychain.getGenericPassword();
            const token = credentials.username;
            const points =
              productData["mrp"] *
              (pointSharingData["percentage_points_value"] / 100);
            const memberShipBonus = (points * Number(getActiveMembershipData?.body?.points !== undefined ? getActiveMembershipData?.body?.points : 0)) / 100

            const totalPoints = points + memberShipBonus
            setShowPoints(totalPoints);
            console.log("submitPointshsahdgsafdfasfd",totalPoints)

            const body = {
              data: {
                app_user_id: userData.id.toString(),
                user_type_id: userData.user_type_id,
                user_type: userData.user_type,
                product_id: productData.product_id,
                product_code: productData.product_code,
                platform_id: Number(platform),
                pincode:
                  location.postcode === undefined ? "N/A" : location.postcode,
                platform: "mobile",
                state: location.state === undefined ? "N/A" : location.state,
                district:
                  location.district === undefined ? "N/A" : location.district,
                city: location.city === undefined ? "N/A" : location.city,
                area:
                  location.district === undefined ? "N/A" : location.district,
                known_name: location.city === undefined ? "N/A" : location.city,
                lat: location.lat === undefined ? "N/A" : String(location.lat),
                log: location.lon === undefined ? "N/A" : String(location.lon),
                method_id: 1,
                method: "point on product",
                points: totalPoints,
                type: "point on product",
              },
              qrId: qrIdList,
              tenant_id: slug,
              token: token,
            };
            console.log("userPointEntryFunc", body);
            userPointEntryFunc(body);
          };
          submitPoints();
        }
      }
      else {
        setError(true)
        setMessage(checkUserPointData.message)
        setTimeout(() => {
          navigation.pop(2)
        }, 2000)
      }
    } else if (checkUserPointError) {
      console.log("checkUserPointError", checkUserPointError);
  
      setError(true)
      setMessage("Qr Code is not redemmed")
    }

  }, [checkUserPointData, checkUserPointError]);

  useEffect(() => {
    if (userPointEntryData) {
      console.log("userPointEntryData", userPointEntryData);
      if (userPointEntryData.success) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 5000);
      }
    } else if (userPointEntryError) {
      if (userPointEntryError.status === 409) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 5000);
      }
      else if (userPointEntryError.status === 400) {
        setError(true)
        setMessage(userPointEntryError.data.message)
      }
      else if(userPointEntryError.status === 500){
        setError(true)
        setMessage(userPointEntryError.data.message)
      }
      console.log("userPointEntryError", userPointEntryError);
    }
  }, [userPointEntryData, userPointEntryError]);

  console.log("workflowProgram", workflowProgram);
  const handleWorkflowNavigation = () => {
    console.log("WorkflowProgram Left", workflowProgram);
    console.log("scccess");

    if (workflowProgram[0] === "Static Coupon") {
      navigation.navigate("CongratulateOnScan", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Warranty") {
      navigation.navigate("ActivateWarranty", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Points On Product") {
      console.log(workflowProgram.slice(1));
      navigation.navigate("CongratulateOnScan", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Cashback") {
      console.log(workflowProgram.slice(1));
      navigation.navigate("CongratulateOnScan", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Wheel") {
      console.log(workflowProgram.slice(1));
      navigation.navigate("CongratulateOnScan", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Genuinity") {
      console.log(workflowProgram.slice(1));
      navigation.navigate("Genuinity", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Genuinity+") {
      console.log(workflowProgram.slice(1));
      navigation.navigate("GenuinityScratch", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram.length === 0) {
      setTimeout(() => {
        navigation.navigate("Dashboard");
      }, 3000);
    }
  };
  const navigateDashboard = () => {
    dispatch(setShowCampaign(false))
    navigation.reset({ index: '0', routes: [{ name: 'Dashboard' }] })
  };
  const navigateQrScanner = () => {
    // navigation.navigate('QrCodeScanner')
    handleWorkflowNavigation();
  };
  const modalClose = () => {
    setError(false);
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: buttonThemeColor,
      }}
    >
      <View
        style={{
          height: "8%",
          flexDirection: "row",
          position: "absolute",
          top: 0,
          width: "100%",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            width: "20%",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
              position: "absolute",
              left: 20,
            }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          style={{ color: "white", fontSize: 18, right: 10 }}
          content="Congratulations"
        ></PoppinsTextMedium>
      </View>

      {/* main view */}

      <View
        style={{
          height: "92%",
          width: "100%",
          backgroundColor: "white",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          position: "absolute",
          bottom: 0,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <ScrollView
          style={{
            width: "100%",
            height: "100%",
            marginTop: 10,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
        >
          <View
            style={{
              width: "100%",
              height: height - 100,
              alignItems: "center",
              justifyContent: "flex-start",
              marginTop: 10,
              backgroundColor: "white",
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
            }}
          >
            {/* actions pperformed container----------------------------------- */}
            <View
              style={{
                padding: 20,
                width: "90%",
                backgroundColor: "white",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#DDDDDD",
                marginTop: 50,
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
              }}
            >
              <Image
                style={{
                  height: 70,
                  width: 70,
                  resizeMode: "contain",
                  margin: 10,
                }}
                source={require("../../../assets/images/gold.png")}
              ></Image>
              <PoppinsTextMedium
                style={{ color: "#7BC143", fontSize: 24, fontWeight: "700" }}
                content="Congratulations"
              ></PoppinsTextMedium>
              <PoppinsTextMedium
                style={{
                  color: "#333333",
                  fontSize: 20,
                  fontWeight: "500",
                  width: "60%",
                  marginTop: 6,
                }}
                content={`${isDistributor ? "You have successfully Returned the points" : "You have successfully earned the points"}`}
              ></PoppinsTextMedium>
              {/* action box ---------------------------------------------- */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                {getCouponOnCategoryData && (
                  <CongratulationActionBox
                    title="Product Scanned"
                    data={[qrData].length}
                    primaryColor={buttonThemeColor}
                    secondaryColor={buttonThemeColor}
                  ></CongratulationActionBox>
                )}
                {/* {getCouponOnCategoryData &&<CongratulationActionBox title="Points Earned" data={productData.consumer_points} primaryColor={buttonThemeColor} secondaryColor={buttonThemeColor}></CongratulationActionBox>} */}
              </View>
              {/* -------------------------------------------------------- */}
            </View>
            {/* -------------------------------------------------------- */}
            {/* rewards container---------------------------------------------- */}
            {error && <ErrorModal
              modalClose={modalClose}

              message={message}
              openModal={error}></ErrorModal>}
            <View
              style={{
                padding: 10,
                width: "90%",
                backgroundColor: "#DDDDDD",
                borderRadius: 4,
                marginTop: 50,
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <View
                style={{
                  height: 48,
                  width: 160,
                  backgroundColor: buttonThemeColor,
                  borderWidth: 1,
                  borderStyle: "dotted",
                  borderColor: "white",
                  borderRadius: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  bottom: 30,
                }}
              >
                <PoppinsTextMedium
                  style={{ fontSize: 16, fontWeight: "800", color: "white" }}
                  content="You Have Won"
                ></PoppinsTextMedium>
              </View>
              {addBulkPointOnProductIsLoading && <ActivityIndicator size = "small" color={ternaryThemeColor}></ActivityIndicator>}

              {/* reward user according to the workflow ------------------------*/}
              {showBulkScanPoints && (
                <Win data="Number of items scanned" title={showBulkScanPoints.length}></Win>

              )}
              {showBulkScanPoints && (
                <Win data={`${isDistributor ? "Point Return":"Total Points Earned"}`} title={ totalPoints < 0 ? (Number(totalPoints).toPrecision(2)) :(Number(totalPoints)) }></Win>

                // <View
                //   style={{
                //     height: "90%",
                //     width: "90%",
                //     alignItems: "center",
                //     justifyContent: "center",
                //   }}
                // >
                //   <ScrollView
                //     style={{ height: "100%", width: "100%" }}
                //     horizontal={true}
                //   >
                //     {showBulkScanPoints.map((item, index) => {
                //       return (
                //         <View
                //           key={index}
                //           style={{
                //             height: 200,
                //             width: "30%",
                //             alignItems: "center",
                //             justifyContent: "center",
                //             borderWidth:1,
                //             borderRadius:8,
                //             marginRight:30,
                //             backgroundColor:"white",
                //             padding:10
                //           }}
                //         >
                //           {item !== null ? (
                //             <View
                //               style={{
                //                 alignItems: "center",
                //                 justifyContent: "flex-start",
                //                 height:'80%'

                //               }}
                //             >
                //               <Celebrate name="celebration" size={40} color={ternaryThemeColor}></Celebrate>
                //               <PoppinsTextMedium
                //                 content={`${String(item.points).substring(0,6)} Points have been added `}
                //                 style={{ color: "black", fontSize: 14,marginTop:20}}
                //               ></PoppinsTextMedium>
                //             </View>
                //           ) : (
                //             <View
                //               style={{
                //                 alignItems: "center",
                //                 justifyContent: "flex-start",
                //                 height:'80%'
                //               }}
                //             >
                //               <Error name="error" size={40} color={ternaryThemeColor}></Error>

                //             <PoppinsTextMedium
                //               content="There was some problem with this scanned QR"
                //               style={{ color: "black", fontSize: 16,marginTop:20 }}
                //             ></PoppinsTextMedium>
                //             </View>

                //           )}
                //         </View>
                //       );
                //     })}
                //   </ScrollView>
                // </View>
              )}


              {getCouponOnCategoryData && (
                <Win
                  data="Coupons Earned"
                  title={getCouponOnCategoryData.body.brand}
                ></Win>
              )}
              {userPointEntryData && (
                <Win data="Points Earned" title={String(showPoints).substring(0, 5)}></Win>
              )}
              {createWheelHistoryData && (
                <Win data="Wheel" title="You have got a spin wheel"></Win>
              )}
              {addCashbackEnteriesData && (
                <Win
                  data="Cashback"
                  title={addCashbackEnteriesData?.body?.cashback}
                ></Win>
              )}
              {/* {getCouponOnCategoryError && (
                <PoppinsText
                  content={`Coupons For This ${getCouponOnCategoryError.data.message}`}
                ></PoppinsText>
              )}
              {userPointEntryError && (
                <PoppinsText
                  content={`Points For This ${userPointEntryError.data.message}`}
                ></PoppinsText>
              )} */}
            </View>
          </View>
        </ScrollView>
        <View style={{ width: "100%", height: 80, backgroundColor: "white" }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          ></View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ButtonSquare
              style={{ color: "white" }}
              content="Cancel"
              handleOperation={navigateDashboard}
            ></ButtonSquare>
            <ButtonSquare
              style={{ color: "white" }}
              content="Okay"
              handleOperation={navigateQrScanner}
            ></ButtonSquare>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default CongratulateOnScan;
