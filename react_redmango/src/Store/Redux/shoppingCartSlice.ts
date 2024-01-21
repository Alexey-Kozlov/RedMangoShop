import { createSlice } from "@reduxjs/toolkit";
import { ICartItem, IShoppingCart } from "../../Interfaces";

const initialState: IShoppingCart = {
    cartItems: []
};

export const shoppingCartSlice = createSlice({
    name: "CartItems",
    initialState: initialState,
    reducers:{
        setShoppingCart:(state, action) =>{
            state.cartItems = action.payload;
        },
        updateQuantity:(state, action) =>{
            let item = state.cartItems?.find(p => p.id === action.payload.cartItem.id);
            if(item){
                item.quantity = action.payload.quantity;
            }
            // state.cartItems = state.cartItems?.map((item) =>{
            //     if(item.id === action.payload.cartItem.id){
            //         return item.quantity = action.payload.quantity;
            //     }
            //     return item;
            // });
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems?.filter(p => p.id != action.payload.cartItem.id);
        }
    }
});

export const { setShoppingCart, updateQuantity, removeFromCart } = shoppingCartSlice.actions;
export const shoppingCartReducer = shoppingCartSlice.reducer;