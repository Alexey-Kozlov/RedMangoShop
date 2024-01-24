import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import checkToken from "../Helper/checkToken";

const paymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery: fetchBaseQuery({
        baseUrl:"http://localhost:5053/api/",
        prepareHeaders:(headers: Headers, api) => {
            const token = localStorage.getItem('RM_Token');
            token && checkToken() && headers.append('Authorization', 'Bearer ' + token);
        }
    }),
    endpoints: (builder)  => ({
        initPayment: builder.mutation({
            query: (userId) =>({
                url: "payment",
                method:'post',
                params:{
                    userId: userId
                }
            })
        })
    })
})

export const { useInitPaymentMutation} = paymentApi;
export default paymentApi;