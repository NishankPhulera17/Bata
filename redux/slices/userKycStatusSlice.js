import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  kycData:{},
  kycCompleted:false,
  panCompleted:false,
  aadharCompleted:false,
  gstCompleted:false
  
}

export const userKycStatusSlice = createSlice({
  name: 'kycDataSlice',
  initialState,
  reducers: {
    
    
    setKycData: (state, action) => {
        state.kycData = action.payload
      },
      setKycCompleted: (state, action) => {
        state.kycCompleted = true
      },
      setPanCompleted: (state, action) => {
        state.panCompleted = action.payload
      },
      setAadharCompleted: (state, action) => {
        state.panCompleted = action.payload
      },
      setGstCompleted: (state, action) => {
        state.gstCompleted = action.payload
      }
  },
})

// Action creators are generated for each case reducer function
export const { setKycData,setKycCompleted, setAadharCompleted, setGstCompleted,setPanCompleted} = userKycStatusSlice.actions

export default userKycStatusSlice.reducer