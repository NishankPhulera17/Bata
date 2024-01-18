import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
} from "react-native";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector } from "react-redux";
import * as Keychain from "react-native-keychain";
import { useFetchCashbackEnteriesOfUserMutation, useFetchUserCashbackByAppUserIdMutation } from "../../apiServices/workflow/rewards/GetCashbackApi";
import DataNotFound from "../data not found/DataNotFound";
import AnimatedDots from "../../components/animations/AnimatedDots";
import { useGetCashTransactionsMutation } from "../../apiServices/cashback/CashbackRedeemApi";
import moment from "moment";
import { useGetReturnPointListMutation } from "../../apiServices/returnPointList/ReturnPointListApi";
import FastImage from "react-native-fast-image";

const ReturnPointHistory = ({ navigation }) => {
    const [showNoDataFound, setShowNoDataFound] = useState(false);
    const [totalCashbackEarned, setTotalCashbackEarned] = useState(0)

    const userId = useSelector((state) => state.appusersdata.userId);
    const userData = useSelector((state) => state.appusersdata.userData);
    // const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader.gif')).uri;


    const ternaryThemeColor = useSelector(
        (state) => state.apptheme.ternaryThemeColor
    )
        ? useSelector((state) => state.apptheme.ternaryThemeColor)
        : "#FFB533";

    console.log(userId);

    // const [fetchCashbackEnteriesFunc, {
    //     data: fetctReturnListData,
    //     error: fetctReturnListError,
    //     isLoading: fetchCashbackEnteriesIsLoading,
    //     isError: fetchCashbackEnteriesIsError
    // }] = useFetchCashbackEnteriesOfUserMutation()

    const [
        getCashTransactionsFunc,
        {
            data: getCashTransactionsData,
            error: getCashTransactionsError,
            isLoading: getCashTransactionsIsLoading,
            isError: getCashTransactionsIsError,
        },
    ] = useFetchCashbackEnteriesOfUserMutation();

    const [fetctReturnListFunc, {
        data: fetctReturnListData,
        error: fetctReturnListError,
        isLoading: fetctReturnListIsloading,
        isError: fetctReturnListIsError
    }] = useGetReturnPointListMutation()

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
                fetctReturnListFunc(params)
            }
        };
        getData();
    }, []);

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

    const Header = () => {
        return (
            <View
                style={{
                    height: 40,
                    width: "100%",
                    backgroundColor: "#DDDDDD",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    marginTop: 20,
                }}
            >
                <PoppinsTextMedium
                    style={{
                        marginLeft: 20,
                        fontSize: 16,
                        position: "absolute",
                        left: 10,
                        color: "black",
                    }}
                    content="Return Ledger"
                ></PoppinsTextMedium>
                {/* <View style={{ position: "absolute", right: 20 }}>
          <Image style={{ height: 22, width: 22, resizeMode: "contain" }} source={require('../../../assets/images/settings.png')}></Image>
          <Image
            style={{ height: 22, width: 22, resizeMode: "contain" }}
            source={require("../../../assets/images/list.png")}
          ></Image>
        </View> */}
            </View>
        );
    };
    const CashbackListItem = (props) => {
        const amount = props.items.cash;
        console.log("amount details", props);
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("CashbackDetails", { "data": props.items });
                }}
                style={{
                    alignItems: "flex-start",
                    justifyContent: "center",
                    width: "100%",
                    borderBottomWidth: 1,
                    borderColor: "#DDDDDD",
                    padding: 4,
                    height: 130,
                    flexDirection: 'row'
                }}
            >
                <View
                    style={{
                        width: "80%",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        padding: 8
                    }}
                >
                    <PoppinsTextMedium
                        style={{ color: props.items.status === "1" ? "green" : "red", fontWeight: "600", fontSize: 18 }}
                        content={
                            props.items.status === "1"
                                ? "Credited to cash balance"
                                : "Declined from the panel"
                        }
                    ></PoppinsTextMedium>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            marginTop: 4,
                        }}
                    >
                        <Image
                            style={{ height: 30, width: 30, resizeMode: "contain" }}
                            source={require("../../../assets/images/greenRupee.png")}
                        ></Image>
                        <View
                            style={{
                                alignItems: "flex-start",
                                justifyContent: "center",
                                marginLeft: 10,
                            }}
                        >
                            <PoppinsTextMedium
                                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                                content={`To :  ${props.items?.bene_details?.bene_name} `}
                            ></PoppinsTextMedium>
                            <PoppinsTextMedium
                                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                                content={`Transfer mode : ${props.items?.transfer_mode} `}
                            ></PoppinsTextMedium>
                            <PoppinsTextMedium
                                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                                content={` ${props.items?.transfer_mode} :  ${props.items?.transfer_mode == "upi" ? props.items?.bene_details?.upi_id : props.items?.bene_details?.account_no}  `}
                            ></PoppinsTextMedium>

                            {
                                props.items?.bene_details?.ifsc &&
                                <PoppinsTextMedium
                                    style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                                    content={`IFSC :  ${props.items?.transfer_mode !== "upi" && props.items?.bene_details?.ifsc}  `}
                                ></PoppinsTextMedium>

                            }

                            <PoppinsTextMedium
                                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                                content={
                                    moment(props.items.transaction_on).format("DD-MMM-YYYY") +
                                    " " +
                                    moment(props.items.transaction_on).format("HH:mm a")
                                }
                            ></PoppinsTextMedium>
                        </View>
                    </View>
                </View>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <PoppinsTextMedium style={{ color: 'black' }} content={"₹ " + props.items.cash}></PoppinsTextMedium>
                </View>
            </TouchableOpacity>
        );
    };

    const ListItem = (props) => {
        console.log("List Piropss", props)
        const description = props?.items?.product_name
        const productCode = props?.items?.product_code
        const barcode =  props?.items?.barcode
        
        const time = props?.items?.time
        const amount = props?.items.points_on_product
        const status = props?.status
        const image = props?.image
        const date = props?.date
        const type = props?.type
        const points = props?.points
        const is_reverted = props?.is_reverted
        const mrp = props?.mrp

        console.log("point props", props, type, image)
        return (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 8, borderBottomWidth: 1, borderColor: '#DDDDDD', paddingBottom: 10, width: '100%', height: 100, backgroundColor: 'white' ,}}>
                <View style={{ height: 60, width: '14%', alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 1, borderColor: '#DDDDDD', position: 'absolute', left: 10, }}>
                    {image ? <Image style={{ height: 40, width: 40, resizeMode: "contain" }} source={{ uri: BaseUrlImages + image }}></Image> : <Image style={{ height: 40, width: 40, resizeMode: "contain" }} source={require('../../../assets/images/batalogo.png')}></Image>}
                </View>
                <View style={{ alignItems: "flex-start", justifyContent: "center", position: 'absolute', left: 80, width: '60%' }}>
                    {type !== "registration_bonus" && <PoppinsTextMedium style={{ fontWeight: '700', fontSize: 14, color: 'black' }} content={description}></PoppinsTextMedium>}
                    {type === "registration_bonus" && <PoppinsTextMedium style={{ fontWeight: '400', fontSize: 14, color: 'black', fontWeight: '700' }} content={`Registration Bonus`}></PoppinsTextMedium>}

                    {type !== "registration_bonus" && <PoppinsTextMedium style={{ fontWeight: '400', fontSize: 12, color: 'black' }} content={`Article No : ${productCode}`}></PoppinsTextMedium>}
                    {type !== "registration_bonus" && <PoppinsTextMedium style={{ fontWeight: '400', fontSize: 12, color: 'black' }} content={`Barcode : ${barcode}`}></PoppinsTextMedium>}

                    {/* {visibleCode && type !== "registration_bonus" && <PoppinsTextMedium style={{ fontWeight: '400', fontSize: 12, color: 'black' }} content={`Visible Code : ${visibleCode}`}></PoppinsTextMedium>} */}
                    <PoppinsTextMedium style={{ fontWeight: '200', fontSize: 12, color: 'black' }} content={date}></PoppinsTextMedium>

                    <PoppinsTextMedium style={{ fontWeight: '200', fontSize: 12, color: 'black' }} content={time}></PoppinsTextMedium>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", position: 'absolute', right: 10, width: '26%' }}>
                    <Image style={{ height: 20, width: 20, resizeMode: "contain" }} source={(status == 0 && (points < 0) && is_reverted == true) ? require('../../../assets/images/minus_wallet.png') : require('../../../assets/images/wallet.png')}></Image>
                    <PoppinsTextMedium style={{ color: "#91B406", fontSize: 14, color: (status == 0 && (points < 0) && is_reverted == true) ? "red" : 'black' }} content={`${status == "1" ? " +" : status == "2" ? ' -' : ""} ${amount}`}></PoppinsTextMedium>
                </View>
            </View>
        )
    }

    return (
        <View style={{ alignItems: "center", justifyContent: "flex-start" }}>
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    width: "100%",
                    marginTop: 10,
                    height: 40,
                    marginLeft: 20,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Image
                        style={{
                            height: 24,
                            width: 24,
                            resizeMode: "contain",
                            marginLeft: 10,
                        }}
                        source={require("../../../assets/images/blackBack.png")}
                    ></Image>
                </TouchableOpacity>
                <PoppinsTextMedium
                    content="Returned Point History"
                    style={{
                        marginLeft: 10,
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#171717",
                    }}
                ></PoppinsTextMedium>
                {/* <TouchableOpacity style={{ marginLeft: 160 }}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/notificationOn.png')}></Image>
                </TouchableOpacity> */}
            </View>
            <View
                style={{
                    padding: 14,
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    width: "100%",
                }}
            >
                <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        style={{
                            height: 30,
                            width: 30,
                            resizeMode: "contain",

                        }}
                        source={require("../../../assets/images/wallet.png")}
                    ></Image>
                    <PoppinsTextMedium
                        style={{
                            marginLeft: 10,
                            fontSize: 15,
                            fontWeight: "700",
                            color: "#6E6E6E",
                        }}
                        content={"Total return Amount ₹ " + totalCashbackEarned.toPrecision(5)}
                    ></PoppinsTextMedium>
                    {/* <PoppinsText style={{ marginLeft: 10, fontSize: 34, fontWeight: '600', color: 'black' }} content={fetctReturnListData?.body?.total != undefined ?  `${fetctReturnListData?.body?.total}` : <AnimatedDots color={'black'}/>}></PoppinsText> */}
                </View>

                {/* <PoppinsTextMedium style={{marginLeft:10,fontSize:20,fontWeight:'600',color:'#6E6E6E'}} content="Cashback"></PoppinsTextMedium> */}
                {/* <PoppinsTextMedium
          style={{
            marginLeft: 10,
            fontSize: 20,
            fontWeight: "600",
            color: "#6E6E6E",
          }}
          content="Cashbacks are now instantly credited"
        ></PoppinsTextMedium> */}

            </View>
            <Header></Header>

            {fetctReturnListData && <FlatList
                initialNumToRender={20}
                contentContainerStyle={{
                
                    
                }}
                style={{ width: "100%", marginBottom:20 }}
                data={fetctReturnListData?.body}
                renderItem={({ item, index }) => (
                    <ListItem items={item}></ListItem>
                )}
                keyExtractor={(item, index) => index}
            />}
            {
                fetctReturnListData?.body?.length === 0 && <View style={{ marginBottom: 300, width: '100%' }}>
                    <DataNotFound></DataNotFound>
                </View>
            }

{/* {
                fetctReturnListData.body.length == 0 && fetctReturnListIsloading &&
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
            } */}

        </View>
    );
};

const styles = StyleSheet.create({});

export default ReturnPointHistory;