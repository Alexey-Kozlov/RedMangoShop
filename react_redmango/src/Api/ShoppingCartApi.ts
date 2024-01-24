import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { checkToken } from "../Helper";

const shoppingCartApi = createApi({
    reducerPath: "shoppingCartApi",
    baseQuery: fetchBaseQuery({
        //baseUrl:"http://localhost:5053/api/",
        baseUrl: process.env.REACT_APP_API_URL,
        prepareHeaders:(headers: Headers, api) => {
            const token = localStorage.getItem('RM_Token');
            token && checkToken() && headers.append('Authorization', 'Bearer ' + token);
        }
    }),
    tagTypes:["ShoppingCart"],
    endpoints: (builder)  => ({
        getShoppingCart: builder.query({
            query: (userId) =>({
                url: `shoppingCart`,
                params:{
                    userId: userId
                }
            }),
            providesTags:["ShoppingCart"]
        }),
        updateShoppingCart: builder.mutation({
            query:({menuItemId, itemQuantityChanged, userId}) =>({
                url: "shoppingCart",
                method:"POST",
                params:{
                    menuItemId : menuItemId, 
                    itemQuantityChanged: itemQuantityChanged, 
                    userId: userId
                }
            }),
            invalidatesTags:["ShoppingCart"]
        })
    })
})

export const { useGetShoppingCartQuery, useUpdateShoppingCartMutation } = shoppingCartApi;
export default shoppingCartApi;