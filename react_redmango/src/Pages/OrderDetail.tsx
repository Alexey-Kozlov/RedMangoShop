import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetOrderByIdQuery } from '../Api/OrderApi';
import { OrderSummary } from '../Components/Page/Order';

function OrderDetail() {

    const {id} = useParams();
    const {data, isLoading} = useGetOrderByIdQuery(id);        
    let userInput, orderDetail;
    if(!isLoading && data.result){
        userInput = {
            name: data.result?.name,
            phone: data.result?.phone
        };
        orderDetail = {
            id: data.result?.orderHeaderId,
            cartItems: data.result?.orderDetails,
            cartTotal: data.result?.orderTotal,
            status: data.result?.status
        };
    }

    const getState = (_orderDetail: any, _userInput: any ) => {
        const state = {
            apiResult: _orderDetail,
            userInput: _userInput
        };
        
        return state;
    }

  return (
    <div className='container my-5 mx-auto p-5 w-100' style={{maxWidth:'750px'}}>
       {!isLoading && orderDetail && userInput && (
        <OrderSummary state= { getState(orderDetail, userInput) } />
       )}
    </div>
  )
}

export default OrderDetail