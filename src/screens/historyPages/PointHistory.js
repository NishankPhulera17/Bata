import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useFetchUserPointsMutation, useFetchUserPointsHistoryMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import * as Keychain from 'react-native-keychain';
import { useSelector } from 'react-redux';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import FilterModal from '../../components/modals/FilterModal';
import { useGetPointSharingDataMutation } from '../../apiServices/pointSharing/pointSharingApi';
import { dispatchCommand } from 'react-native-reanimated';
import InputDate from '../../components/atoms/input/InputDate';

const PointHistory = ({ navigation }) => {
    const [displayList, setDisplayList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const points = 100
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

    const addonfeatures = useSelector(state => state.apptheme.extraFeatures)
    const registrationRequired = useSelector(state => state.appusers.registrationRequired)
    const userData = useSelector(state => state.appusersdata.userData)

    const [getPointSharingFunc, {
        data: getPointSharingData,
        error: getPointSharingError,
        isLoading: getPointSharingIsLoading,
        isError: getPointSharingIsError
    }] = useGetPointSharingDataMutation()

    const [userPointFunc, {
        data: userPointData,
        error: userPointError,
        isLoading: userPointIsLoading,
        isError: userPointIsError
    }] = useFetchUserPointsMutation()

    const [fetchUserPointsHistoryFunc, {
        data: fetchUserPointsHistoryData,
        error: fetchUserPointsHistoryError,
        isLoading: fetchUserPointsHistoryLoading,
        isError: fetchUserPointsHistoryIsError
    }] = useFetchUserPointsHistoryMutation()



    const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader.gif')).uri;
    const noData = Image.resolveAssetSource(require('../../../assets/gif/noData.gif')).uri;
    let startDate, endDate


    useEffect(() => {
        fetchPoints()
    }, [])
    const userId = useSelector(state => state.appusersdata.id);

    const fetchPoints = async () => {
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.username;
        console.log("userId", userId)
        const params = {
            userId: String(userId),
            token: token
        }
        userPointFunc(params)
        fetchUserPointsHistoryFunc(params)

    }
    useEffect(() => {
        console.log("DisplayList", displayList)
    }, [displayList])

    useEffect(() => {
        if (userPointData) {
            console.log("userPointData", userPointData)
        }
        else if (userPointError) {
            console.log("userPointError", userPointError)
        }

    }, [userPointData, userPointError])

    useEffect(() => {
        if (getPointSharingData) {

            console.log("getPointSharingData", JSON.stringify(getPointSharingData))
            if (getPointSharingData.success) {
                setIsLoading(false)

                setDisplayList(getPointSharingData.body.data)
            }
        }
        else if (getPointSharingError) {
            console.log("getPointSharingError", getPointSharingError)
        }
    }, [getPointSharingData, getPointSharingError])

    useEffect(() => {
        if (fetchUserPointsHistoryData) {
            console.log("fetchUserPointsHistoryData", JSON.stringify(fetchUserPointsHistoryData))
            if (fetchUserPointsHistoryData.success) {
                setIsLoading(false)
                setDisplayList(fetchUserPointsHistoryData.body.data)
            }
        }
        else if (fetchUserPointsHistoryError) {
            console.log("fetchUserPointsHistoryError", fetchUserPointsHistoryError)
        }

    }, [fetchUserPointsHistoryData, fetchUserPointsHistoryError])

    useEffect(() => {
        if (getPointSharingIsLoading || fetchUserPointsHistoryLoading) {
            setIsLoading(true)
        }
        else {
            setIsLoading(false)
        }
    }, [getPointSharingIsLoading, fetchUserPointsHistoryLoading])
    const fetchPointHistoryData=(start,end)=>{

        (async () => {
          const credentials = await Keychain.getGenericPassword();
          const token = credentials.username;
          const startDate = moment(start).format(
            "YYYY-MM-DD"
          )
          const endDate = moment(end).format("YYYY-MM-DD")
          console.log("Start End",startDate,endDate)
    
          fetchUserPointsHistoryFunc({
            startDate:startDate,
            endDate:endDate,
            token: token,
            userId:userId
          });
        })();
      }
    
    const fetchDataAccToFilter = () => {

        console.log("fetchDataAccToFilter", startDate, endDate)
        if (startDate && endDate) {
            if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
                alert("Kindly enter proper end date")
                startDate = undefined
                endDate = undefined
            }
            else {
                fetchPointHistoryData(startDate,endDate)

            }

        }
        else {
            alert("Kindly enter a valid date")
            startDate = undefined
            endDate = undefined
        }
    }

    // const fetchPointHistoryData = (start, end) => {

    //     (async () => {
    //         const credentials = await Keychain.getGenericPassword();
    //         const token = credentials.username;

    //         console.log("Start End", start, end)

    //         let queryParams = `?user_type_id=${userData.user_type_id}&app_user_id=${userData.id}&limit=${limit}`;

    //         if (start && end) {
    //             queryParams += `&from_date=${moment(start).format(
    //                 "YYYY-MM-DD"
    //             )}&to_date=${moment(end).format("YYYY-MM-DD")}`;
    //         } else if (start) {
    //             queryParams += `&from_date=${moment(start).format(
    //                 "YYYY-MM-DD"
    //             )}`;
    //         }

    //         console.log("queryParams", queryParams);

    //         fetchAllQrScanedList({
    //             token: token,

    //             query_params: queryParams,
    //         });
    //     })();
    // }

    const getRegistrationPoints = async (cause) => {
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.username;
        const params = {
            token: token,
            id: String(userData.id),
            cause: cause
        }
        getPointSharingFunc(params)

    }

    const fetchUserPointsHistoryDataFunc = (start, end) => {

        (async () => {
            const credentials = await Keychain.getGenericPassword();
            const token = credentials.username;
            console.log("Start End", start, end)
            let queryParams = ``
            // let queryParams = `?user_type_id=${userData.user_type_id}&app_user_id=${userData.id}&limit=${limit}`;
            if (start && end) {
                queryParams += `&startDate=${moment(start).format(
                    "YYYY-MM-DD"
                )}&endDate=${moment(end).format("YYYY-MM-DD")}`;
            } else if (start) {
                queryParams += `&startDate=${moment(start).format(
                    "YYYY-MM-DD"
                )}`;
            }

            console.log("queryParams", queryParams);
            const params = {
                userId: String(userId),
                token: token,
                queryParams:queryParams
            }

            // fetchAllQrScanedList({
            //     token: token,
            //     query_params: queryParams,
            // });

            fetchUserPointsHistoryFunc({
                params:params,
            })

        })();
    }

    //Point category tab
    const PointCategoryTab = () => {
        const [type, setType] = useState("")
        return (
            <View style={{ width: '100%', backgroundColor: 'white', height: 60, elevation: 1, flexDirection: 'row', opacity: 0.8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: "grey" }}>
                {registrationRequired.includes(userData.user_type) &&
                    <TouchableOpacity onPress={() => {
                        fetchPoints()
                        setType("regular")
                    }} style={{ height: 60, width: '33%', alignItems: "center", justifyContent: 'center', backgroundColor: type === "regular" ? "#DDDDDD" : "white" }}>
                        <PoppinsTextMedium content="Regular Points" style={{ color: 'black', fontWeight: '700', fontSize: 14 }}></PoppinsTextMedium>
                    </TouchableOpacity>

                }
                {registrationRequired.includes(userData.user_type) &&
                    <TouchableOpacity onPress={() => {
                        getRegistrationPoints("monthly_scheme")
                        setType("extra")
                    }} style={{ height: 60, width: '33%', alignItems: "center", justifyContent: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#DDDDDD', backgroundColor: type === "extra" ? "#DDDDDD" : "white" }}>
                        <PoppinsTextMedium content="Extra Points" style={{ color: 'black', fontWeight: '700', fontSize: 14 }}></PoppinsTextMedium>
                    </TouchableOpacity>

                }
                {registrationRequired.includes(userData.user_type) &&
                    <TouchableOpacity onPress={() => {
                        getRegistrationPoints("registration_bonus")
                        setType("registration")
                    }} style={{ height: 60, width: '33%', alignItems: "center", justifyContent: 'center', backgroundColor: type === "registration" ? "#DDDDDD" : "white" }}>
                        <PoppinsTextMedium content="Registration Bonus" style={{ color: 'black', fontWeight: '700', fontSize: 14 }}></PoppinsTextMedium>
                    </TouchableOpacity>

                }
            </View>
        )
    }
    //header
    const Header = () => {
        const [openBottomModal, setOpenBottomModal] = useState(false)
        const [message, setMessage] = useState()
        const modalClose = () => {
            setOpenBottomModal(false);
        };

        const onFilter = (data, type) => {
            console.log("submitted", data, type)

            if (type === "start") {
                startDate = data
            }
            if (type === "end") {
                endDate = data
            }
        }

        const ModalContent = (props) => {
            const [startDate, setStartDate] = useState("")
            const [openBottomModal, setOpenBottomModal] = useState(false)
            const [endDate, setEndDate] = useState("")





            const handleStartDate = (startdate) => {
                // console.log("start date", startdate)
                setStartDate(startdate?.value)
                props.handleFilter(startdate?.value, "start")
            }

            const handleEndDate = (enddate) => {
                // console.log("end date", enddate?.value)
                setEndDate(enddate?.value)
                props.handleFilter(enddate?.value, "end")
            }
            return (
                <View style={{ height: 320, backgroundColor: 'white', width: '100%', borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>

                    {openBottomModal && <FilterModal
                        modalClose={modalClose}
                        message={message}
                        openModal={openBottomModal}
                        handleFilter={onFilter}
                        comp={ModalContent}></FilterModal>}

                    <PoppinsTextLeftMedium content="Date Filter" style={{ color: 'black', marginTop: 20, fontWeight: 'bold', alignSelf: 'center' }}></PoppinsTextLeftMedium>
                    <View>
                        <InputDate data="Start Date" handleData={handleStartDate} />

                    </View>
                    <View>
                        <InputDate data="End Date" handleData={handleEndDate} />
                    </View>
                    <TouchableOpacity onPress={() => {
                        fetchDataAccToFilter(startDate, endDate)
                    }} style={{ backgroundColor: ternaryThemeColor, marginHorizontal: 50, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10, borderRadius: 10 }}>
                        <PoppinsTextMedium content="SUBMIT" style={{ color: 'white', fontSize: 20, borderRadius: 10, }}></PoppinsTextMedium>
                    </TouchableOpacity>

                </View>
            )
        }

        return (
            <View style={{ height: 40, width: '100%', backgroundColor: '#DDDDDD', alignItems: "center", flexDirection: "row", marginTop: 20 }}>

                <PoppinsTextMedium style={{ marginLeft: 20, fontSize: 16, position: "absolute", left: 10, color: 'black' }} content="Date Filter"></PoppinsTextMedium>

                <TouchableOpacity onPress={() => { setOpenBottomModal(!openBottomModal), setMessage("BOTTOM MODAL") }} style={{ position: "absolute", right: 20 }}>
                    <Image style={{ height: 22, width: 22, resizeMode: "contain" }} source={require('../../../assets/images/settings.png')}></Image>
                </TouchableOpacity>

                {openBottomModal && <FilterModal
                    modalClose={modalClose}
                    message={message}
                    openModal={openBottomModal}
                    handleFilter={onFilter}
                    comp={ModalContent}></FilterModal>}

            </View>
        )
    }

    const DisplayEarnings = () => {
        return (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: '100%' }}>
                <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                    {userPointData && <PoppinsText style={{ color: "black" }} content={userPointData.body.point_earned}></PoppinsText>}
                    <PoppinsTextMedium style={{ color: "black", fontSize: 14, color: 'black' }} content="Lifetime Earnings"></PoppinsTextMedium>
                </View>
                <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                    {userPointData && <PoppinsText style={{ color: "black" }} content={userPointData.body.point_redeemed}></PoppinsText>}
                    <PoppinsTextMedium style={{ color: "black", fontSize: 14, color: 'black' }} content="Lifetime Burns"></PoppinsTextMedium>
                </View>
                {/* <TouchableOpacity style={{ borderRadius: 2, height: 40, width: 100, backgroundColor: "#FFD11E", alignItems: "center", justifyContent: "center", marginLeft: 20, color: 'black' }}>
                    <PoppinsTextMedium style={{ color: 'black' }} content="Redeem"></PoppinsTextMedium>
                </TouchableOpacity> */}
            </View>
        )
    }



    const ListItem = (props) => {
        const description = props.description
        const productCode = props.productCode
        const data = props.data
        const time = props.time
        const amount = props.amount
        const status = props.status
        const image = props.image
        const date = props.date
        const type = props.type
        const points = props?.points
        const is_reverted = props.is_reverted
        const mrp = props.mrp

        console.log("point props", props, type, image)
        return (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 8, borderBottomWidth: 1, borderColor: '#DDDDDD', paddingBottom: 10, width: '100%', height: 100, backgroundColor: 'white' }}>
                <View style={{ height: 60, width: '14%', alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 1, borderColor: '#DDDDDD', position: 'absolute', left: 10, }}>
                    {image ? <Image style={{ height: 40, width: 40, resizeMode: "contain" }} source={{ uri: image }}></Image> : <Image style={{ height: 40, width: 40, resizeMode: "contain" }} source={require('../../../assets/images/batalogo.png')}></Image>}
                </View>
                
                <View style={{ alignItems: "flex-start", justifyContent: "center", position: 'absolute', left: 80, width: '60%' }}>
                    {type == "monthly_scheme"  && <PoppinsTextMedium style={{ fontWeight: '700', fontSize: 14, color: 'black' }} content={data.name ? data.name : "Bata scheme"}></PoppinsTextMedium>}
                    {type !== "monthly_scheme" && type !== "registration_bonus"  && <PoppinsTextMedium style={{ fontWeight: '700', fontSize: 14, color: 'black' }} content={description}></PoppinsTextMedium>}
                    {type === "registration_bonus" && <PoppinsTextMedium style={{ fontWeight: '400', fontSize: 14, color: 'black', fontWeight: '700' }} content={`Registration Bonus`}></PoppinsTextMedium>}

                    {type !== "monthly_scheme"  && type !== "registration_bonus" && <PoppinsTextMedium style={{ fontWeight: '400', fontSize: 12, color: 'black' }} content={`Article No : ${productCode}`}></PoppinsTextMedium>}
                    {type !== "registration_bonus" && type!=="monthly_scheme" &&  <PoppinsTextMedium style={{ fontWeight: '400', fontSize: 12, color: 'black' }} content={`MRP : ${mrp}`}></PoppinsTextMedium>}

                    {/* {visibleCode && type !== "registration_bonus" && <PoppinsTextMedium style={{ fontWeight: '400', fontSize: 12, color: 'black' }} content={`Visible Code : ${visibleCode}`}></PoppinsTextMedium>} */}
                    <PoppinsTextMedium style={{ fontWeight: '200', fontSize: 12, color: 'black' }} content={date}></PoppinsTextMedium>

                    <PoppinsTextMedium style={{ fontWeight: '200', fontSize: 12, color: 'black' }} content={time}></PoppinsTextMedium>
                </View>
                <View style={{alignItems:'center',justifyContent:'center', position: 'absolute', right: 10, width: '26%'}}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Image style={{ height: 20, width: 20, resizeMode: "contain" }} source={(status == 0 && (points < 0) && is_reverted == true) ? require('../../../assets/images/minus_wallet.png') : require('../../../assets/images/wallet.png')}></Image>
                    <PoppinsTextMedium style={{ color: "#91B406", fontSize: 14, color: (status == 0 && (points < 0) && is_reverted == true) ? "red" : 'black' }} content={`${status == "1" ? " +" : status == "2" ? ' -' : ""} ${amount}`}></PoppinsTextMedium>
                </View>
                {data.platform_id == "3" && <PoppinsTextMedium style={{fontSize:10,fontWeight:'700', color:"black",marginTop:4}} content="Scheme Reward" ></PoppinsTextMedium>}
                </View>
            </View>
        )
    }
    return (
        <View style={{ alignItems: 'center', justifyContent: "center", backgroundColor: 'white', width: '100%' }}>
            <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row", width: '100%', marginTop: 10, height: 40, marginLeft: 20, backgroundColor: 'white' }}>
                <TouchableOpacity onPress={() => {
                    navigation.goBack()
                }}>
                    <Image style={{ height: 24, width: 24, resizeMode: 'contain', marginLeft: 10 }} source={require('../../../assets/images/blackBack.png')}></Image>

                </TouchableOpacity>
                <PoppinsTextMedium content="Points History" style={{ marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#171717' }}></PoppinsTextMedium>
                {/* <TouchableOpacity style={{ marginLeft: 180 }}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/notificationOn.png')}></Image>
                </TouchableOpacity> */}
            </View>
            <View style={{ padding: 14, alignItems: "center", justifyContent: "flex-start", width: "100%", flexDirection: "row", backgroundColor: 'white' }}>
                <View style={{ width: 100 }}>
                    <PoppinsTextMedium style={{ marginLeft: 10, fontSize: 20, fontWeight: '600', color: '#6E6E6E', }} content="You Have"></PoppinsTextMedium>
                    {userPointData &&
                        <PoppinsText style={{ marginLeft: 14, fontSize: 24, fontWeight: '600', color: '#373737', width: 100, width: 150 }} content={userPointData.body.point_balance}></PoppinsText>

                    }
                    <PoppinsTextMedium style={{ marginLeft: 10, fontSize: 20, fontWeight: '600', color: '#6E6E6E' }} content="Points"></PoppinsTextMedium>
                </View>
                <Image style={{ height: 80, width: 80, resizeMode: 'contain', position: 'absolute', right: 20 }} source={require('../../../assets/images/points.png')}></Image>
            </View>

            <DisplayEarnings></DisplayEarnings>
            <Header></Header>
            <PointCategoryTab></PointCategoryTab>

            {
                displayList.length == 0 && !isLoading &&
                <View>
                    <FastImage
                        style={{ width: 180, height: 180, alignSelf: 'center', marginTop: '30%' }}
                        source={{
                            uri: noData, // Update the path to your GIF
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    <PoppinsTextMedium style={{ color: '#808080', marginTop: -20, fontWeight: 'bold' }} content="NO DATA"></PoppinsTextMedium>

                </View>
            }


            {
                isLoading && <View style={{ backgroundColor: 'white' }}>
                    <FastImage
                        style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '50%' }}
                        source={{
                            uri: gifUri, // Update the path to your GIF
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>
            }
            {displayList && !isLoading && <FlatList
                style={{ width: '100%', height: '60%' }}
                data={displayList}
                contentContainerStyle={{ backgroundColor: "white", paddingBottom: 200 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    console.log("item of displaylist", index + 1, item)
                    return (
                        <ListItem data = {item} type={item?.cause?.type} image={item?.images === undefined ? undefined : item?.images?.[0]} description={item?.product_name} productCode={item?.product_code} amount={item?.points} status={item?.status} points={item?.points} is_reverted={item?.is_reverted} mrp={item.mrp} date={moment(item?.created_at).format("DD-MMM-YYYY")} time={moment(item?.created_at).format("HH:mm a")} />
                    )
                }}
                keyExtractor={(item, index) => index}
            />}
        </View>
    );
}

const styles = StyleSheet.create({})

export default PointHistory;