import React, { useState } from 'react'
import { ICartItem, IPayment } from '../../../Interfaces'
import { getStatusColor, getStatusEnumRus } from '../../../Helper'
import { useNavigate } from 'react-router-dom';
import { Roles_Constant, Status_Constant } from '../../../Utility/Constant';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Store/Redux/store';
import { useUpdateOrderMutation } from '../../../Api/OrderApi';
import { MainLoader } from '../Common';

function OrderSummary({ state: { apiResult, userInput } }: IPayment) {

    const orderStatusColor = getStatusColor(apiResult.status);
    const navigate = useNavigate();
    const userData = useSelector((state: RootState) => state.authStore);
    const [loading, setLoading] = useState(false);
    const [updateOrder] = useUpdateOrderMutation();

    const nextStatus:any = apiResult.status === Status_Constant.CONFIRMED?
        {color:'info', value: Status_Constant.BEING_COOKED} :
        apiResult.status === Status_Constant.BEING_COOKED ?
        {color:'warning', value: Status_Constant.READY_FOR_PICKUP} :
        apiResult.status === Status_Constant.READY_FOR_PICKUP &&
        {color:'success', value: Status_Constant.COMPLETED};

    const handleNextStatus = async () => {
        setLoading(true);
        await updateOrder({
            orderHeaderId: apiResult.id,
            status: nextStatus.value
        });
        setLoading(false);
    }
    const handleCancel = async () =>{
        setLoading(true);
        await updateOrder({
            orderHeaderId: apiResult.id,
            status: Status_Constant.CANCELLED
        });
        setLoading(false);
    }

    if(loading) return <MainLoader />

    return (
        <div className='col-md-7'>
            <div className='d-flex justify-content-between align-items-center'>
                <h3 className='text-success'>Заказ {apiResult.id}:</h3>
                <span className={`btn btn-outline-${orderStatusColor} fs-6`}>
                    {getStatusEnumRus(apiResult.status)}
                </span>
            </div>
            <div className='mt-3'>
                <div className='border py-3 px-2'>Покупатель: {userInput.name}</div>
                <div className='border py-3 px-2'>Телефон: {userInput.phone}</div>
                <div className='border py-3 px-2'>
                    <h4 className='text-success'>Покупки:</h4>
                    <div className='p-3'>
                        {apiResult.cartItems?.map((item: ICartItem, index: number) => {
                            return (
                                <div className='d-flex' key={index}>
                                    <div className='d-flex w-100 justify-content-between'>
                                        <p>{item.menuItem.name}</p>
                                        <p>{item.menuItem.price} * {item.quantity} = </p>
                                    </div>
                                    <p style={{ width: '110px', textAlign: 'right' }}>
                                        {(item.menuItem.price ?? 0) * (item.quantity ?? 0)} руб.
                                    </p>
                                </div>
                            )
                        })}
                        <hr />
                    </div>
                    <div className='d-flex w-100 justify-content-between'>
                        <h4 className='text-success' style={{ textAlign: 'left' }}>Итого:</h4>
                        <h4 className='text-danger' style={{ textAlign: 'right', marginRight: '20px' }}>
                            {apiResult.cartTotal?.toFixed(2)} руб.
                        </h4>
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-between align-items-center mt-3'>
                <button className='btn btn-secondary' onClick={()=>navigate(-1)}>
                    Назад
                </button>
                {userData.role == Roles_Constant.ADMIN && (
                    <div className='d-flex'>
                        {apiResult.status !== Status_Constant.CANCELLED &&
                        apiResult.status !== Status_Constant.COMPLETED && (
                    <button 
                        className='btn btn-danger mx-2'
                        onClick={handleCancel}
                    >Отмена</button>
                        )}
                    <button 
                        className={`btn btn-${nextStatus.color}`}
                        onClick={handleNextStatus}
                    >{getStatusEnumRus(nextStatus.value)}</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderSummary