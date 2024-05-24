import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  eachScanTriggers:[],
  checkTriggers:[]
}

export const salesBoosterSlice = createSlice({
  name: 'salesBooster',
  initialState,
  reducers: {
    
    setEachScanTriggers:(state,action)=>{
        state.eachScanTriggers= action.payload
    },
    setCheckTriggers:(state,action)=>{
        state.checkTriggers = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setEachScanTriggers, setCheckTriggers} = salesBoosterSlice.actions

export default salesBoosterSlice.reducer