import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const shoppingCartApi = createApi({
    reducerPath: "shoppingCartApi",
    baseQuery: fetchBaseQuery({
        baseUrl:"http://localhost:5053/api/",
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