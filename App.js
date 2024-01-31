import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Alert, Text,TouchableOpacity } from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { store } from './redux/store';
import { Provider } from 'react-redux'
import messaging from '@react-native-firebase/messaging';
import ModalWithBorder from './src/components/modals/ModalWithBorder';
import Close from 'react-native-vector-icons/Ionicons';

const App = () => {

  const [notifModal, setNotifModal] = useState(false)
  const [notifData, setNotifData] = useState(null)

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("remote", remoteMessage)
      // Alert.alert(JSON.stringify(remoteMessage?.notification?.title ? remoteMessage?.notification?.title : "Notification"), JSON.stringify(remoteMessage?.notification?.body));
      setNotifModal(true)
      setNotifData(remoteMessage?.notification)

    });

    return unsubscribe;
  }, []);


  useEffect(()=>{

  console.log("Notification data",notifData,notifModal)
  },[notifModal,notifData])




  const notifModalFunc = () => {
    return (
      <View style={{height:130  }}>
        <View style={{ height: '100%', width:'100%', alignItems:'center',}}>
          <View>
          {/* <Bell name="bell" size={18} style={{marginTop:5}} color={ternaryThemeColor}></Bell> */}

          </View>
          <PoppinsTextLeftMedium content={notifData?.title ? notifData?.title : "Notification Title"} style={{ color: ternaryThemeColor, fontWeight:'800', fontSize:20, marginTop:8 }}></PoppinsTextLeftMedium>
      
          <PoppinsTextLeftMedium content={notifData?.title ? notifData?.title : "Notification Bodyn  kjja  mfkfkkff   ff jffj jknkjen jws k cndk kn jn"} style={{ color: '#000000', marginTop:10, padding:10, fontSize:15, fontWeight:'600' }}></PoppinsTextLeftMedium>
        </View>

        <TouchableOpacity style={[{
          backgroundColor: ternaryThemeColor, padding: 6, borderRadius: 5, position: 'absolute', top: -10, right: -10,
        }]} onPress={() => setNotifModal(false)} >
          <Close name="close" size={17} color="#ffffff" />
        </TouchableOpacity>



      </View>
    )
  }



  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1 }}>
        <StackNavigator>
         {notifModal &&  <ModalWithBorder
            modalClose={() => {
              setNotifModal(false)
            }}
            message={"message"}
            openModal={notifModal}
            comp={notifModalFunc}></ModalWithBorder>}
        </StackNavigator>

      </SafeAreaView>
    </Provider>
    // <View>
    // </View>
  );
}

const styles = StyleSheet.create({})

export default App;
