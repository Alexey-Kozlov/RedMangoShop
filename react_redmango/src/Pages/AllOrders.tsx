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
        <>
            <div className='d-flex align-items-center justify-content-between mx-5 mt-5'>
                <h1 className='text-success'>Заказы</h1>
                <div className='d-flex' style={{width:'40%'}}>
                    <input
                        type='text'
                        className='form-control mx-2'
                        placeholder='Поиск имени или телефона'
                    />
                    <select className='form-select w-50 mx-2'>
                        
                    </select>
                </div>
            </div>
            <OrderList orderData={data.result} />
        </>
    )
}

export default AdminAuth(AllOrders);