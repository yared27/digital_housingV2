import { createSlice, PayloadAction } from "@reduxjs/toolkit";


//Defining the state shape of auth
interface AuthState {
    id:string | null,
    token:string | null,
    isAuthenticated:boolean
}

//Initial state for the auth slice
const initialState:AuthState = {
    id: null,
    token:null,
    isAuthenticated:false,
}

//Create the auth slice with reducers and action

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setAuthState: (state, action:PayloadAction<AuthState> )=>{
            state.id = action.payload.id
            state.token = action.payload.token
            state.isAuthenticated =true
        },

        //Action to clear the auth state (logout)
        clearAuthState: (state) =>{
            state.id =null
            state.token =null
            state.isAuthenticated=false
        }
    }
})


export const {setAuthState, clearAuthState} =authSlice.actions;

export const authReducer = authSlice.reducer;

export const authSelector = (state: {auth:AuthState}) => state.auth;