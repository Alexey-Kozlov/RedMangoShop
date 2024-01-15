import React from 'react'
import { AdminAuth, Auth } from '../HOC'
import { useSelector } from 'react-redux';
import { RootState } from '../Store/Redux/store';
import { useGetOrdersQuery } from '../Api/OrderApi';
import { OrderList } from '../Components/Page/Order';
import { MainLoader } from '../Components/Page/Common';

function AllOrders() {

    const userId = useSelector((state:RootState) => state.authStore.id);
    const {data, isLoading} = useGetOrdersQuery('');

    if(isLoading) return <MainLoader />

    return (        
        <OrderList orderData={data.result} />
    )
}

export default AdminAuth(AllOrders);