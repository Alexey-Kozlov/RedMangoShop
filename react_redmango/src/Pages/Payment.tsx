import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ICartItem, IPayment, IResponse } from '../Interfaces';
import { useCreateOrderMutation } from '../Api/OrderApi';
import { Status_Constant } from '../Utility/Constant';
import { Loader } from '../Components/Page/Common';
import { OrderSummary } from '../Components/Page/Order';


function Payment() {

    const { state: { apiResult, userInput } }: IPayment = useLocation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [createOrder] = useCreateOrderMutation();
    const navigate = useNavigate();

    const handleMakePay = async () => {
        setIsProcessing(true);
        let totalItems = 0;
        let orderTotal = 0;
        const orderDetailsDTO: any = [];
        apiResult.cartItems.forEach((item: ICartItem) => {
            let orderDetail: any = {};
            orderDetail.menuItemId = item.menuItem.id;
            orderDetail.quantity = item.quantity;
            orderDetail.itemName = item.menuItem.name;
            orderDetail.price = item.menuItem.price;
            orderDetailsDTO.push(orderDetail);

            orderTotal += (item.quantity! * item.menuItem.price);
            totalItems += item.quantity;
        });
        const response: IResponse = await createOrder({
            name: userInput.name,
            phone: userInput.phone,
            totalItems: totalItems,
            orderTotal: orderTotal,
            applicationUserId: apiResult.userId,
            stripePaymentIntentId: apiResult.stripePaymentIntentId,
            status: Status_Constant.CONFIRMED,
            orderDetailsDTO: orderDetailsDTO
        })
        if (response.data!.result && response.data!.result.status == Status_Constant.CONFIRMED.toString()) {
            navigate('/');
        }

        setIsProcessing(false);
    }

    const state = {
        apiResult: apiResult,
        userInput: userInput
    };
    
    return (
        <div className='container p-5'>
            <OrderSummary state={state} />
            <div style={{ textAlign: 'center' }} className='col-md-7'>
                <button type='submit'
                    disabled={isProcessing}
                    className='btn btn-lg btn-success form-control mt-3 w-50'
                    onClick={() => handleMakePay()}
                >
                    {
                        isProcessing ? <Loader /> : (
                            <>
                                Сделать платеж!
                                &nbsp;<i className="bi bi-emoji-smile"></i>
                            </>
                        )
                    }
                </button>
            </div>
        </div>
    )
}

export default Payment