import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { checkToken } from "../Helper";

const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        //baseUrl:"http://localhost:5053/api/",
        baseUrl: process.env.REACT_APP_API_URL,
        prepareHeaders:(headers: Headers, api) => {
            const token = localStorage.getItem('RM_Token');
            token && checkToken() && headers.append('Authorization', 'Bearer ' + token);
        }
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
            query: ({userId, search, status, pageSize, pageNumber}) => ({
                url: 'order',
                params: {
                    userId: userId,
                    search: search,
                    status: status,
                    pageSize: pageSize,
                    pageNumber: pageNumber
                }
            }),
            transformResponse(apiResponse: {result: any}, meta: any){
                return {
                    apiResponse,
                    totalRecords: meta.response.headers.get("X-Pagination")                    
                }
            },
            providesTags:['Orders']
        }),
        getOrderById: builder.query({
            query: (id) => ({
                url: `order/${id}`
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