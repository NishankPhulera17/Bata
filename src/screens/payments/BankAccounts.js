import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Modal,
  Pressable
} from 'react-native';
import MessageModal from '../../components/modals/MessageModal';
import { useSelector } from 'react-redux';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useListAccountsMutation } from '../../apiServices/bankAccount.js/ListBankAccount';
import Icon from 'react-native-vector-icons/AntDesign';
import Dots from 'react-native-vector-icons/Entypo';
import Edit from 'react-native-vector-icons/Entypo';
import Plus from 'react-native-vector-icons/AntDesign';
import Info from 'react-native-vector-icons/Feather';
import Delete from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Keychain from 'react-native-keychain';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import { useDeleteBankMutation } from '../../apiServices/bankAccount.js/DeleteBankAccount';
import { useIsFocused } from '@react-navigation/native';
import { isAction } from '@reduxjs/toolkit';
import { useUpdateStatusBankAccountMutation } from '../../apiServices/bankAccount.js/AddBankAccount';
import FastImage from 'react-native-fast-image';


const BankAccounts = ({ navigation, route }) => {
  const [message, setMessage] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [accountData, setAccountData] = useState()
  const [hasSelectedPaymentMethod, setHasSelectedPaymentMethod] = useState()
  const [modalVisible, setModalVisible] = useState(false);
  const[activeBeneId, setActiveBeneID] = useState(null)


  const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader.gif')).uri;


  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const userData = useSelector(state => state.appusersdata.userData)

    const type = route.params?.type
    console.log("navigating to bank page from",type)
  const [listAccountFunc, {
    data: listAccountData,
    error: listAccountError,
    isLoading: listAccountIsLoading,
    isError: listAccountIsError
  }] = useListAccountsMutation();


  const [
    updateStatusBankAccount,
    {
      data: updateStatusBankAccountData,
      isLoading: updateStatusBankAccountIsLoading,
      isError: updateStatusBankAccountIsError,
      error: updateStatusBankAccountError,
    },
  ] = useUpdateStatusBankAccountMutation();


  

  const [deleteBankFunc, {
    data: deleteBankData,
    error: deleteBankError,
    isLoading: deleteBankIsLoading,
    isError: deleteBankIsError
  }] = useDeleteBankMutation()

  const focused = useIsFocused()
  const height = Dimensions.get('window').height
  const deleteData = async (data) => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' + credentials.username
      );
      const token = credentials.username
      const id = data

      const params = {
        token: token,
        id: id
      }
      deleteBankFunc(params)
      refetchData()
    }
  }
  const refetchData = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' + credentials.username
      );
      const token = credentials.username
        
      const userId = userData.id

      const params = {
        token: token,
        userId: userId
      }
      listAccountFunc(params)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          'Credentials successfully loaded for user ' + credentials.username
        );
        const token = credentials.username
        const userId = userData.id

        const params = {
          token: token,
          userId: userId
        }
        listAccountFunc(params)

      }
    }
    fetchData()
  }, [])
  useEffect(() => {
    refetchData()
  }, [focused])

  useEffect(() => {
    if (deleteBankData) {
      console.log("deleteBankData", deleteBankData)
      if (deleteBankData.success) {
        refetchData()
      }

    }
    else if (deleteBankError) {
      console.log("deleteBankError", deleteBankError)
    }
  }, [deleteBankData, deleteBankError])

  useEffect(() => {
    if (updateStatusBankAccountData) {
      console.log("updateStatusBankAccountData", updateStatusBankAccountData)
    
      refetchData()
    }
    else if (updateStatusBankAccountError) {
      console.log("updateStatusBankAccountError", updateStatusBankAccountError)
    }
  }, [updateStatusBankAccountData, updateStatusBankAccountError])


  

  useEffect(() => {
    if (listAccountData) {
      console.log("listAccountData", listAccountData.body)
      setAccountData(listAccountData.body)
      
    }
    else if (listAccountError) {
      console.log("listAccountError", listAccountError)
    }
  }, [listAccountData, listAccountError])




  const setSelectedPaymentMethod = (data) => {
    console.log("Selected bank account",data)
    setHasSelectedPaymentMethod(data.id)
  }



  const BankComponentAccount = (props) => {
    const [selected, setSelected] = useState(false)
    const [openDrawer, setOpenDrawer] = useState(false)
    const bankName = props.bankName
    const accountNo = props.accountNo
    const ifsc = props.ifsc
    const type = props.type
    const name = props.name
  

    console.log("selected", props.unSelect)
    

    useEffect(() => {
      console.log(props.unSelect)
      if (props.unSelect === "account") {
        setSelected(!selected)
      }
    }, [props.unSelect])

    

    const handleSelection = () => {
      setSelected(!selected)

      props.handleData({
        accountNo: accountNo,
        id: props.id,
        type: type
      })

    }

    return (


      <View
        onPress={() => { setOpenDrawer(false) }}
        style={{
          width: '90%',
          borderColor: '#DDDDDD',
          borderBottomWidth: 0.6,
          alignItems: 'flex-start',
          justifyContent: 'center',
          height: 140,
          flexDirection: "row", marginTop: 20,

        }}>



        <View style={{ alignItems: 'flex-start', justifyContent: 'center', width: '80%' }}>
          <PoppinsText style={{ color: 'black', fontSize: 18, fontWeight: '700' }} content={bankName}></PoppinsText>
          <PoppinsTextMedium style={{ color: '#747474', fontSize: 14, fontWeight: '700', textAlign: 'justify', marginTop: 4 }} content={`Name : ${name}`}></PoppinsTextMedium>
          <PoppinsTextMedium style={{ color: '#747474', fontSize: 14, fontWeight: '700', textAlign: 'justify', marginTop: 4 }} content={`Account No : ${accountNo}`}></PoppinsTextMedium>
          <PoppinsTextMedium style={{ color: '#747474', fontSize: 14, fontWeight: '700', textAlign: 'justify', marginTop: 4 }} content={`IFSC Code: ${ifsc}`}></PoppinsTextMedium>



        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center', width: '20%' }}>

          <View style={{ height: 24, width: 24, borderRadius: 10, borderWidth: 1, borderColor: '#DDDDDD', alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => {
              handleSelection()
            }}>
              <Icon name={"checkcircle"} color={selected ? ternaryThemeColor : "white"} size={20}></Icon>
            </TouchableOpacity>
          </View>
          {
            openDrawer && <View style={{ height: 60, width: 80, borderRadius: 4, backgroundColor: "white", alignItems: "flex-start", justifyContent: "center", position: 'absolute', elevation: 2, left: -20, top: 30 }}>

              {/* <TouchableOpacity onPress={()=>{

                        }} style={{height:'50%',flexDirection:'row',alignItems:"center",justifyContent:"flex-start"}}>
                          <Edit style={{marginLeft:4}} name="edit" size={14} color={ternaryThemeColor}></Edit>
                          <PoppinsTextMedium style={{color:ternaryThemeColor,fontSize:14,marginLeft:4}} content="Edit"></PoppinsTextMedium>                        
                        </TouchableOpacity> */}
              <TouchableOpacity onPress={() => {
                console.log(props.id)
                deleteData(String(props.id))
                setModalVisible(true)

              }} style={{ height: '50%', flexDirection: 'row', alignItems: "center", justifyContent: 'center' }}>
                <Delete style={{ marginLeft: 4 }} name="delete" size={14} color={ternaryThemeColor}></Delete>
                <PoppinsTextMedium style={{ color: ternaryThemeColor, fontSize: 14, marginLeft: 4 }} content="Delete"></PoppinsTextMedium>
              </TouchableOpacity>

            </View>
          }
          <TouchableOpacity onPress={() => { setOpenDrawer(!openDrawer) }}>
            <Dots name={"dots-three-vertical"} color={ternaryThemeColor} style={{ marginLeft: 4 }} size={26}></Dots>
          </TouchableOpacity>
        </View>
      </View>


    );
  };
  const BankComponentUpi = (props) => {
    const [selected, setSelected] = useState(false)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [isClicked,setIsClicked] = useState(false)
    const upi = props.upi
    const type = props.type
    const status = props.status
    const id = props.id

    useEffect(() => {
      console.log(props.unSelect)
      if (props.unSelect === props.id) {
        setSelected(!selected)
      }
    }, [props.unSelect])

    useEffect(()=>{
        console.log("isClicked", )
    },[isClicked])

    const handleSelection = (selection) => {

      const getToken = async()=>{
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(
            'Credentials successfully loaded for user ' + credentials.username
          );
          const token = credentials.username

          updateStatusBankAccount({
            // s: getTenantData().tenant_id,
            token: token,
            id: id
          })
      }}
      
      getToken();
     

      setSelected(!selection)
      console.log("selection",selection)
      if(!selection)
      {
        props.handleData({
          upi: upi,
          id: props.id,
          type: type
        })
      }
      // setIsClicked(true)

      
      
    }
    return (

      <View style={{ alignItems: "flex-start", justifyContent: 'center', width: '90%', height: 70, marginTop: 20, flexDirection: "row", borderBottomWidth: 1, borderColor: '#DDDDDD' }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {

            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Info name="info" color={ternaryThemeColor} size={40}></Info>
              <PoppinsTextMedium style={{ color: 'black', width: 300, marginTop: 20, fontSize: 18 }} content="Are you sure?"></PoppinsTextMedium>
              <PoppinsTextMedium style={{ color: 'black', width: '90%', marginTop: 20, fontSize: 20 }} content="Do you want to delete this account?"></PoppinsTextMedium>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center", marginTop: 20 }}>
                <TouchableOpacity onPress={() => {
                  console.log("cancel")
                  setModalVisible(false)


                }} style={{ alignItems: "center", justifyContent: "center", backgroundColor: 'white', flexDirection: "row", height: 40, width: 100, borderRadius: 20, borderWidth: 1 }}>
                  <PoppinsTextMedium style={{ color: 'black', marginLeft: 10, fontWeight: '700' }} content="Cancel"></PoppinsTextMedium>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  console.log("Delete")
                  setModalVisible(false)
                  deleteData(String(props.id))

                }} style={{ alignItems: "center", justifyContent: "center", backgroundColor: ternaryThemeColor, flexDirection: "row", marginLeft: 40, height: 40, width: 100,zIndex:1, borderRadius: 20 }}>
                  <PoppinsTextMedium style={{ color: 'white', marginLeft: 10 }} content="Delete"></PoppinsTextMedium>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>
        <View
          style={{
            width: '80%',
            alignItems: 'flex-start',
            justifyContent: 'center',

          }}>
          <PoppinsTextMedium style={{ color: 'black', fontSize: 20, fontWeight: '700' }} content={upi}></PoppinsTextMedium>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center', width: '20%' }}>

          <View style={{ height: 24, width: 24, borderRadius: 10, borderWidth: 1, borderColor: '#DDDDDD', alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => {
              handleSelection(selected)
            }}>
              {/* <Icon name={"checkcircle"} color={selected ? ternaryThemeColor : status && !isClicked ? ternaryThemeColor : "white"} size={20}></Icon> */}
              {/* <Icon name={"checkcircle"} color={selected ? ternaryThemeColor : "white"} size={20}></Icon> */}
              <Icon name={"checkcircle"} color={status ? ternaryThemeColor : "white"} size={20}></Icon>


            </TouchableOpacity>
          </View>
          {
            openDrawer && <View style={{ height: 60, width: 80, borderRadius: 4, backgroundColor: "white", alignItems: "flex-start", justifyContent: "center", position: 'absolute', elevation: 2, left: -20, top: 30 }}>
              {/* <TouchableOpacity style={{height:'50%',flexDirection:'row',alignItems:"center",justifyContent:"flex-start"}}>
                          <Edit style={{marginLeft:4}} name="edit" size={14} color={ternaryThemeColor}></Edit>
                          <PoppinsTextMedium style={{color:ternaryThemeColor,fontSize:14,marginLeft:4}} content="Edit"></PoppinsTextMedium>
                         
                        </TouchableOpacity> */}
              <TouchableOpacity onPress={() => {
                console.log(props.id)
                setModalVisible(true)
              }} style={{ height: '50%', flexDirection: 'row', alignItems: "center", justifyContent: 'center' }}>
                <Delete style={{ marginLeft: 4 }} name="delete" size={14} color={ternaryThemeColor}></Delete>
                <PoppinsTextMedium style={{ color: ternaryThemeColor, fontSize: 14, marginLeft: 4 }} content="Delete"></PoppinsTextMedium>
              </TouchableOpacity>

            </View>
          }
          <TouchableOpacity onPress={() => { setOpenDrawer(!openDrawer) }}>
            <Dots name={"dots-three-vertical"} color={ternaryThemeColor} style={{ marginLeft: 4 }} size={26}></Dots>
          </TouchableOpacity>
        </View>
      </View>

    );
  };

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: ternaryThemeColor,
        height: '100%',
      }}>

      {error && (
        <MessageModal
          modalClose={modalClose}
          title="Error"
          message={message}
          openModal={error}></MessageModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          title="Success"
          message={message}
          openModal={success}></MessageModal>
      )}

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          width: '100%',
          marginTop: 20,
          height: 30,

        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: 'contain',
              marginLeft: 20,
            }}
            source={require('../../../assets/images/blackBack.png')}></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          content="Bank Account"
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
      </View>

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
          backgroundColor: '#F6F6F6',
          width: '100%',
          height: height - 100,
          marginTop: 30
        }}>
        <PoppinsTextMedium
          style={{
            fontWeight: '800',
            fontSize: 20,
            color: 'black',
            marginTop: 20,

          }}
          content="Preferred Method"></PoppinsTextMedium>
        <ScrollView style={{ width: '100%' }}>
          <View style={{ alignItems: "center", justifyContent: "center" }}>

            {listAccountData?.body?.length !== 0 &&
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: '90%',
                  backgroundColor: 'white',
                  borderColor: ternaryThemeColor,
                  borderWidth: 2,
                  borderRadius: 10,
                  marginTop: 20,
                  // minHeight: 140
                }}>
                {console.log("listAccountData in view", listAccountData?.body.length)}
                {
                  listAccountData && listAccountData?.body.map((item, index) => {
                    if (!Object.keys(item.bene_details).includes("upi_id")) {
                      console.log("true", item)
                      return (
                        <BankComponentAccount unSelect={hasSelectedPaymentMethod} handleData={setSelectedPaymentMethod} key={index} type="account" id={item.id} bankName={item.bene_bank} accountNo={item.bene_details.bank_account} ifsc={item.bene_details.ifsc} name={item.bene_name} status={item.status=="1"}></BankComponentAccount>

                      )

                    }
                    else {
                      console.log("false", item)
                      return (
                        <BankComponentUpi unSelect={hasSelectedPaymentMethod} handleData={setSelectedPaymentMethod} key={index} id={item.id} type="upi" upi={item.bene_details.upi_id} status={item.status == "1"} ></BankComponentUpi>
                      )
                    }

                  })

                }


              </View>
            }

            {(listAccountData?.body?.length == 0  || listAccountData == undefined ) && <View style={{ alignItems: 'center', marginTop:"60%"}}>
              <PoppinsTextMedium style ={{fontSize:16}}content="No Bank Account has been added yet !"></PoppinsTextMedium>
            </View>}

            
        


          </View>

        </ScrollView>
        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 20, right: 20 }}>
          <PoppinsText content="Add Account" style={{ color: ternaryThemeColor, fontSize: 16 }}></PoppinsText>
          <TouchableOpacity onPress={() => { navigation.navigate('AddBankAccountAndUpi') }} style={{ backgroundColor: '#DDDDDD', height: 60, width: 60, borderRadius: 30, alignItems: "center", justifyContent: 'center', marginLeft: 10 }}>

            <Plus name="pluscircle" size={50} color={ternaryThemeColor}></Plus>
          </TouchableOpacity>
        </View>
           {
           type==="Cashback" &&  <TouchableOpacity onPress={()=>{
            navigation.navigate("OtpVerification",{type:"Cashback",selectedAccount:hasSelectedPaymentMethod})
            }} style={{width:130,alignItems:'center',justifyContent:'center',backgroundColor:ternaryThemeColor,padding:8, position: 'absolute', bottom: 100, left: 145 }}>
              <PoppinsText content ="Get OTP" style={{color:'white',fontSize:16}}></PoppinsText>
            </TouchableOpacity>
            }

{
              listAccountIsLoading && <View style={{ backgroundColor: 'white', width:'100%', height:'150%' } }>
                    <FastImage
                        style={{ width: 100, height: 100, alignSelf: 'center',marginTop:'50%' }}
                        source={{
                            uri: gifUri, // Update the path to your GIF
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>
            }

      </View>
      

    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 240,
    backgroundColor: 'white',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,

    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default BankAccounts;