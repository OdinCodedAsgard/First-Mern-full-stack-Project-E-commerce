import { createSlice } from "@reduxjs/toolkit";

const initialUser ={
    currentUser:null,
    error:null,
    loading:true,
};

const UserSlice = createSlice({
    name:"user",
    "initialState" : initialUser , 
    reducers:{
        SignInStart:(state) => {
            state.loading=false;
        },
    SignInSuccess: (state,action)=>{
        state.currentUser = action.payload;
        state.error= null;
        state.loading= false;
    },
    SignInFail:(state,action)=> {
        state.error= action.payload;
        state.loading= false;
    },
    updateUserInfoStart :(state)=>{
        state.loading = true
    },
    updateUserInfoSuccess : (state,action)=>{
        state.loading = false,
        state.currentUser = {...state.currentUser, ...action.payload}
        state.error = null
    },
    updateUserInfoFail :(state,action)=>{
        state.error = action.payload,
         state.loading= false
    },
    deleteUserStart:(state)=>{
        state.loading = true
    },
    deleteUserSuccess:(state)=>{
     state.loading = false,
     state.error = null,
     state.currentUser = null
    },
    deleteUserFail: (state,action)=>{
        state.error = action.payload,
        state.loading = false
    }
    }
})

export const { SignInFail,SignInStart,SignInSuccess, updateUserInfoFail,updateUserInfoStart,updateUserInfoSuccess,deleteUserFail,deleteUserStart,deleteUserSuccess} = UserSlice.actions;

export default UserSlice.reducer;