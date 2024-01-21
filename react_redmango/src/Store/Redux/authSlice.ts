import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../Interfaces";

export const emptyUserState : IUser = {
    name:'',
    login:'',
    id:'',
    role:''
};

export const authSlice = createSlice({
    name: "userAuth",
    initialState: emptyUserState,
    reducers:{
        setAuthUser:(state, action) =>{
            state.name = action.payload.name;
            state.id = action.payload.id;
            state.login = action.payload.login;
            state.role = action.payload.role;
        }
    }
});

export const { setAuthUser } = authSlice.actions;
export const authReducer = authSlice.reducer;