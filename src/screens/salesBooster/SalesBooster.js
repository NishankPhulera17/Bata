import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import {
  useCheckSalesBoosterMutation,
  useCheckSalesBoosterOnEachScanMutation,
  useClaimSalesBoosterMutation,
} from "../../apiServices/salesBooster/salesBoosterApi";
import * as Keychain from "react-native-keychain";
import ConfettiCannon from "react-native-confetti-cannon";
import RedeemRewardHistory from "../historyPages/RedeemRewardHistory";
import ErrorModal from "../../components/modals/ErrorModal";
const SalesBooster = ({ navigation, route }) => {
  const [celebrate, setCelebrate] = useState(false);
  const [pointAdded, setPointAdded] = useState();
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "#FFB533";

  const location = useSelector((state) => state.userLocation.location);
  const data = route.params.data;
  console.log("SalesBooster", data, location);

  const [
    claimSalesBoosterFunc,
    {
      data: claimSalesBoosterData,
      error: claimSalesBoosterError,
      isLoading: claimSalesBoosterIsLoading,
      isError: claimSalesBoosterIsError,
    },
  ] = useClaimSalesBoosterMutation();

  useEffect(() => {
    if (claimSalesBoosterData) {
      console.log("claimSalesBoosterData", claimSalesBoosterData);
      setCelebrate(true);
      if (claimSalesBoosterData.status == 200) {
        setPointAdded(claimSalesBoosterData?.body?.point_added);
      }
      setTimeout(() => {
        setCelebrate(false);
        navigation.navigate(RedeemRewardHistory);
      }, 4000);
    } else if (claimSalesBoosterError) {
      console.log("claimSalesBoosterError", claimSalesBoosterError);
      setError(true);
      setMessage(claimSalesBoosterError?.data?.message);
    }
  }, [claimSalesBoosterData, claimSalesBoosterError]);

  

  const modalClose = () => {
    setError(false);
  };

  const getDataFromSalesBoosterCard = async (data) => {
    console.log("getDataFromSalesBoosterCard", data);

    const credentials = await Keychain.getGenericPassword();

    if (credentials) {
      console.log(
        "Credentials successfully loaded for user " + credentials.username
      );
      const token = credentials.username;
      try {
        const body = {
          trigger: data,
          district:
            location?.district == undefined ? "N/A" : location?.district,
          state: location?.state == undefined ? "N/A" : location?.state,
          city: location?.city == undefined ? "N/A" : location?.city,
          pincode: location?.pincode == undefined ? "N/A" : location?.pincode,
          lat: location?.lat == undefined ? "N/A" : location?.lat,
          log: location?.lon == undefined ? "N/A" : location?.lon,
          platform_id: 1,
          platform: "android",
          method_id: "1",
          method: "android",
        };
        const params = {
          token: token,
          body: body,
        };

        console.log("claimSalesBoosterFunc", params);
        claimSalesBoosterFunc(params);
      } catch (e) {
        console.log("error in claiming salesbooster", e);
      }
    }
  };

  const SalesBoosterCard = ({item,index}) => {
    const confettiArray = [
      require("../../../assets/images/Artboard1.png"),
      require("../../../assets/images/Artboard2.png"),
      require("../../../assets/images/Artboard3.png"),
      require("../../../assets/images/Artboard4.png"),
      require("../../../assets/images/Artboard5.png"),
      require("../../../assets/images/Artboard6.png"),
    ];
   const image =confettiArray[index%6]

    console.log("SalesBoosterCard", item,index);
    const claimRewards = () => {
      getDataFromSalesBoosterCard(item)
    };

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={claimRewards}
        style={{ width: "45%", margin: 8 }}
      >
        <Card>
          <Card.Content style={{ marginBottom: 4 }}>
            {item.trigger_status == 1 &&<Text style={{ fontWeight: "700",color:'black' }} variant="bodyMedium">
              Tap to claim
            </Text>}
            {item.trigger_status == 2 &&<Text style={{ fontWeight: "700",color:'grey' }} variant="bodyMedium">
              Reward Claimed
            </Text>}
          </Card.Content>
          <Card.Cover resizeMode="contain" source={image} />
        </Card>
      </TouchableOpacity>
    );
  };

  // const renderInnerItem = ({ item, index }) => (

  // );

  // const renderOuterItem = ({ item }) => (
  //   <FlatList
  //     data={item}
  //     numColumns={2}
  //     renderItem={renderInnerItem}
  //     keyExtractor={(innerItem, innerIndex) => innerIndex.toString()}
  //     style={styles.innerList}
  //     contentContainerStyle={styles.innerContentContainer}
  //   />
  // );

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!celebrate && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            width: "100%",
            height: "10%",
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
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <PoppinsTextMedium
              content="Sales Booster"
              style={{
                marginLeft: 10,
                fontSize: 16,
                fontWeight: "700",
                color: "black",
              }}
            ></PoppinsTextMedium>
          </View>
        </View>
      )}
      <PoppinsTextMedium
        style={{
          fontWeight: "bold",
          fontSize: 22,
          color: ternaryThemeColor,
          marginBottom: 20,
        }}
        content="Congrats !! You have won"
      ></PoppinsTextMedium>
      {celebrate && (
        <ConfettiCannon
          fallSpeed={1000}
          explosionSpeed={100}
          autoStart={true}
          count={200}
          origin={{ x: -10, y: 0 }}
        />
      )}
      {celebrate && (
        <PoppinsTextMedium
          style={{
            fontWeight: "bold",
            fontSize: 22,
            color: ternaryThemeColor,
            marginBottom: 20,
          }}
          content={`${pointAdded} Points`}
        ></PoppinsTextMedium>
      )}

      {!celebrate && (
        <FlatList
          data={data}
          numColumns={2}
          renderItem={
            SalesBoosterCard
          }
          keyExtractor={(outerItem, outerIndex) => outerIndex.toString()}
          style={styles.outerList}
          contentContainerStyle={styles.outerContentContainer}
        />
      )}

      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
        ></ErrorModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerList: {
    width: "100%",
    zIndex: 0,
  },
  outerContentContainer: {
    paddingBottom: 10,
  },
  innerList: {
    width: "100%",
  },
  innerContentContainer: {
    justifyContent: "space-between",
  },
});

export default SalesBooster;
