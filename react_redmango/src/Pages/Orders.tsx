import React from 'react'
import { Auth } from '../HOC'
import { useSelector } from 'react-redux';
import { RootState } from '../Store/Redux/store';
import { useGetOrdersQuery } from '../Api/OrderApi';
import { OrderList } from '../Components/Page/Order';
import { MainLoader } from '../Components/Page/Common';
import { Status_Constant } from '../Utility/Constant';

const filterOptions = [
    "Все",
    Status_Constant.CONFIRMED,
    Status_Constant.BEING_COOKED,
    Status_Constant.READY_FOR_PICKUP,
    Status_Constant.CANCELLED
];

function Orders() {

    const userId = useSelector((state:RootState) => state.authStore.id);
    const {data, isLoading} = useGetOrdersQuery({userId});

    if(isLoading) return <MainLoader />

    return (
        <>
            <div className='d-flex align-items-center justify-content-between mx-5 mt-5'>
                <h1 className='text-success'>Мои заказы</h1>
            </div>
            <OrderList orderData={data?.apiResponse.result} />
        </>
    )
}

export default Auth(Orders);