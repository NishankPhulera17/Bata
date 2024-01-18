import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import RewardSquare from '../atoms/RewardSquare';
import { useSelector } from 'react-redux';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import * as Keychain from 'react-native-keychain';
import FastImage from 'react-native-fast-image';
import { useFetchUserCashbackByAppUserIdMutation } from '../../apiServices/workflow/rewards/GetCashbackApi';
import { useGetReturnPointListMutation } from '../../apiServices/returnPointList/ReturnPointListApi';

const RewardBox = () => {
    const workflow = useSelector(state => state.appWorkflow.program)
    const id = useSelector(state => state.appusersdata.id);

    const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader.gif')).uri;
    const userData = useSelector(state => state.appusersdata.userData)
    const isDistributor = userData?.user_type_id == 3

    const[totalAmount, setTotalCashbackEarned] = useState(0);


    const [userPointFunc, {
        data: userPointData,
        error: userPointError,
        isLoading: userPointIsLoading,
        isError: userPointIsError
    }] = useFetchUserPointsMutation();

    const [getPointSharingCashbackFunc, {
        data: getPointSharingCashbackData,
        error: getPointSharingCashbackError,
        isLoading: getPointSharingCashbackisLoading,
        isError: getPointSharingCashbackisError
    }] = useFetchUserCashbackByAppUserIdMutation()

    const [fetctReturnListFunc, {
        data: fetctReturnListData,
        error: fetctReturnListError,
        isLoading: fetctReturnListIsloading,
        isError: fetctReturnListIsError
    }] = useGetReturnPointListMutation()

    useEffect(() => {
        fetchPoints()
    }, []);


    useEffect(() => {
        const getData = async () => {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                console.log(
                    "Credentials successfully loaded for user " + credentials.username
                );
                const token = credentials.username;
                // const params = { token: token, appUserId: userData.id };
                const params = { token: token };

                // getCashTransactionsFunc(params);
                if(isDistributor){
                    fetctReturnListFunc(params)

                }
            }
        };
        getData();
    }, []);

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
        (async () => {
            const credentials = await Keychain.getGenericPassword();
            const token = credentials.username;
            const params = {
                token: token,
                userId: String(userData.id),
                // cause: "registration_bonus"
            }
            getPointSharingCashbackFunc(params)

        })();
    }, []);


    useEffect(() => {
        if (userPointData) {
            console.log("userPointData", userPointData)
        }
        else if (userPointError) {
            console.log("userPointError", userPointError)
        }

    }, [userPointData, userPointError])

    useEffect(()=>{
        if(getPointSharingCashbackData){
            console.log("getPointSharingCashbackData",getPointSharingCashbackData)
        }
        else{
            console.log("getPointSharingCashbackError",getPointSharingCashbackError)
            
        }
    },[getPointSharingCashbackData,getPointSharingCashbackError ])


    
    useEffect(() => {
        if (fetctReturnListData) {
            let cashback = 0
            console.log(
                "fetctReturnListData",
                JSON.stringify(fetctReturnListData)
            );
            if (fetctReturnListData.body) {
                for (var i = 0; i < fetctReturnListData.body?.length; i++) {

                    if (fetctReturnListData?.body) {
                        cashback = cashback + Number(fetctReturnListData.body[i].points_on_product)
                        console.log("fetctReturnListData calculation", fetctReturnListData.body[i].points_on_product)
                    }
                }   
                setTotalCashbackEarned(cashback)
            }

        } else if (fetctReturnListError) {
            console.log("fetctReturnListError", fetctReturnListError);
        }
    }, [fetctReturnListData, fetctReturnListError]);


    console.log(workflow)
    return (
        <View style={{ padding: 4, width: '100%', borderRadius: 14, elevation: 4, backgroundColor: 'white', height: 170 }}>
            {userPointIsLoading && workflow ?
                <FastImage
                    style={{ width: 100, height: 100, alignSelf: 'center', marginTop: 20 }}
                    source={{
                        uri: gifUri, // Update the path to your GIF
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
                :
                
            <ScrollView contentContainerStyle={{ }} style={{width:'100%'   }} showsHorizontalScrollIndicator={false} horizontal={true}>
            {
                workflow.includes("Static Coupon") && <RewardSquare color="#FFE2E6" image={require('../../../assets/images/voucher.png')} title="My Coupons"></RewardSquare>
            }
        

            {
                workflow.includes("Wheel") && <RewardSquare color="#FFE2E6" image={require('../../../assets/images/cashback.png')} title="Spin Wheel"></RewardSquare>

            }

            {
                workflow.includes("Points On Product") && userPointData && <RewardSquare amount={userPointData.body.point_earned} color="#DCFCE7" image={require('../../../assets/images/points.png')} title="Earned Points"></RewardSquare>
            }
            {
                workflow.includes("Points On Product") && userPointData && <RewardSquare amount={userPointData.body.point_redeemed} color="#DCFCE7" image={require('../../../assets/images/points.png')} title="Redeemed Points"></RewardSquare>
            }
            {
                workflow.includes("Points On Product") && userPointData && <RewardSquare amount={userPointData.body.point_balance} color="#DCFCE7" image={require('../../../assets/images/points.png')} title="Balance Points"></RewardSquare>
            }
                {
               getPointSharingCashbackData && workflow && workflow.includes("Cashback") && <RewardSquare cashback_balance={ getPointSharingCashbackData?.body?.cashback_balance} color="#FFF4DE" image={require('../../../assets/images/cashback.png')} title="Cashback"></RewardSquare>
            }
            {
                isDistributor && fetctReturnListData &&  <RewardSquare amount={totalAmount.toPrecision(5)} color="#DCFCE7" image={require('../../../assets/images/points.png')} title="Returned Points"></RewardSquare>
                // workflow.includes("Points On Product") && userPointData && <RewardSquare amount={userPointData.body.point_reserved} color="#DCFCE7" image={require('../../../assets/images/points.png')} title="Reserved Points"></RewardSquare>
            }
            {
                // workflow.includes("Points On Product") && userPointData && <RewardSquare amount={String(Number(us erPointData.body.point_reserved) + Number(userPointData.body.point_balance)).substring(0,6) == "NaN" ? "" :  String(Number(userPointData.body.point_reserved) + Number(userPointData.body.point_balance)).substring(0,6) } color="#DCFCE7" image={require('../../../assets/images/points.png')} title="Total Points"></RewardSquare>
            }
        </ScrollView>
            }


        </View>
    )
}

const styles = StyleSheet.create({})

export default RewardBox;