import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl:"http://localhost:5053/api/",
    }),
    tagTypes:['Orders'],
    endpoints: (builder)  => ({
        createOrder: builder.mutation({
            query: (orderDetails) =>({
                url: "order",
                method:'post',
                headers: {
                    "Content-type": "application/json"
                },
                body: orderDetails
            }),
            invalidatesTags:['Orders']
        }),
        getOrders: builder.query({
            query: (userId) => ({
                url: 'order',
                params: {
                    userId: userId
                }
            }),
            providesTags:['Orders']
        }),
        getOrderById: builder.query({
            query: (id) => ({
                url: `order/${id}`,
                params: {

                }
            }),
            providesTags:['Orders']
        }),
        updateOrder: builder.mutation({
            query: (orderDetail) =>({
                url:'order/'+ orderDetail.orderHeaderId,
                method:'PUT',
                headers: {
                    'content-type':'application/json'
                },
                body: orderDetail
            }),
            invalidatesTags:['Orders']
        })
    })
})

export const { useCreateOrderMutation, useGetOrderByIdQuery, useGetOrdersQuery, useUpdateOrderMutation} = orderApi;
export default orderApi;