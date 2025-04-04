import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, FlatList, Linking, } from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { months } from 'moment/moment';
import PoppinsText from '../electrons/customFonts/PoppinsText';
import { ScrollView } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { useGetAppCampaignMutation } from '../../apiServices/campaign/CampaignApi';
import Close from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';



// create a component
const CampaignVideoModal = ({ isVisible, onClose }) => {
    const [visible, setVisible] = useState(isVisible)
    const [hide, setHide] = useState(true);

    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : '#FFB533';

    const [
        getAppCampaign,
        {
            data: getAppCampaignData,
            isLoading: getAppCampaignIsLoading,
            isError: getAppCampaignIsError,
            error: getAppCampaignError,
        },
    ] = useGetAppCampaignMutation();

    useEffect(() => {

        const getToken = async () => {
            const credentials = await Keychain.getGenericPassword();
            const token = credentials.username;

            getAppCampaign(token)
        }

        getToken()
    }, [])

    useEffect(() => {
        if (getAppCampaignData) {
            console.log("getAppCampaignData", JSON.stringify(getAppCampaignData));
            if(getAppCampaignData?.body?.data.length ==0)
            setVisible(false)
            else
            setVisible(true)


            console.log("can user hide campaign",getAppCampaignData?.body?.data?.[0]?.can_user_hide)
            setHide(!getAppCampaignData?.body?.data?.[0]?.can_user_hide);
        }
        else {
            console.log("getAppCampaignIsError", getAppCampaignIsError);
        }
    }, [getAppCampaignData, getAppCampaignIsError])

    const touchedVideo = () => {
        Linking.openURL(`${getAppCampaignData?.body?.data?.[0]?.video_link}`)
        // setHide(false);
    }


    const touchedKnowMore = () => {
        Linking.openURL(`${getAppCampaignData?.body?.data?.[0]?.web_link}`)
        // setHide(false);
    }

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <PoppinsTextMedium style={{ fontWeight: '800', color: 'black', fontSize: 20 }} content="Campaign App Promotion"></PoppinsTextMedium>
                    {getAppCampaignData &&
                        <Image style={{ width: '100%', height: 150, resizeMode: "center", marginTop: 10 }} source={{ uri:  getAppCampaignData?.body?.data?.[0]?.image }}></Image>
                    }


                    <TouchableOpacity style={{ width: '80%', borderRadius: 5, height: 40, backgroundColor: '#E10c68', alignItems: 'center', justifyContent: 'center', marginTop: 20, alignSelf: 'center' }} onPress={() => {
                        touchedVideo()
                    }}>
                        <PoppinsTextMedium content="VIDEO" style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}></PoppinsTextMedium>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: '80%', borderRadius: 5, height: 40, backgroundColor: '#2C2C2C', alignItems: 'center', justifyContent: 'center', marginTop: 10, alignSelf: 'center' }} onPress={() => {
                        touchedKnowMore()
                    }}>
                        <PoppinsTextMedium content="KNOW MORE" style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}></PoppinsTextMedium>
                    </TouchableOpacity>


                    {
                        !hide &&
                        <TouchableOpacity style={[{
                            backgroundColor: ternaryThemeColor, padding: 6, borderRadius: 5, position: 'absolute', top: -10, right: -10,
                        }]} onPress={() => {
                            setVisible(false)
                            onClose() }}>
                            <Close name="close" size={17} color="#ffffff" />
                        </TouchableOpacity>
                    }

                    <View>
                    </View>

                </View>
            </View >
        </Modal >
    );
};


// define your styles
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        width: '90%',
        height: 350,
        borderRadius: 10,
        padding: 20,
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#0004ec',
        borderRadius: 10,
        position: 'absolute',
        top: -10,
        right: -10,
    },

    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalTop: {
        height: 161,
        width: '100%',
    },
    circle: {
        backgroundColor: "#ffffff",
        height: 147,
        width: 147,
        borderRadius: 90
    },
    listContainer: {
        marginTop: 20,
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginTop: 20
    }
});


//make this component available to the app
export default CampaignVideoModal;