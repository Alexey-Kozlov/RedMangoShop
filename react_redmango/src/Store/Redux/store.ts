import { configureStore } from "@reduxjs/toolkit";
import { menuItemReducer } from "./menuItemSlice";
import { authApi, menuItemApi, shoppingCartApi } from "../../Api";
import { shoppingCartReducer } from "./shoppingCartSlice";
import { authReducer } from "./authSlice";

const store = configureStore({
    reducer: {
        menuItemStore: menuItemReducer,
        shoppingCartStore: shoppingCartReducer,
        authStore: authReducer,
        [menuItemApi.reducerPath]: menuItemApi.reducer,
        [shoppingCartApi.reducerPath]: shoppingCartApi.reducer,
        [authApi.reducerPath]: authApi.reducer  
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
        .concat(menuItemApi.middleware)
        .concat(shoppingCartApi.middleware)
        .concat(authApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
