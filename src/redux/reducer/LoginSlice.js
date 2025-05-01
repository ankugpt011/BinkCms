// src/store/slices/loginSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: null,
  apiEndPoint: null,
  apiKey: null,
  partnerData: null,

};

const LoginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLoginData: (state, action) => {
        console.log('logindata',action?.payload)
      state.userData = action.payload;
    },
    setPartnerData: (state, action) => {
      console.log('action.payload',action.payload)
        state.partnerData = action.payload;
        state.apiEndPoint = action.payload?.apiEndPoint;
        state.apiKey = action.payload?.apiKey;
      },
    clearLoginData: (state) => {
        return initialState; 
    },
  },
});

export const { setLoginData,setPartnerData, clearLoginData } = LoginSlice.actions;
export default LoginSlice.reducer;
