import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  dashboardItems:[]
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    
    
    setDashboardItems: (state, action) => {
        state.dashboardItems = action.payload
      },
      
  },
})

// Action creators are generated for each case reducer function
export const {setDashboardItems} = dashboardSlice.actions

export default dashboardSlice.reducer