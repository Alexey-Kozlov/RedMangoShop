import React, { useEffect, useState } from 'react'
import { AdminAuth, Auth } from '../HOC'
import { useSelector } from 'react-redux';
import { RootState } from '../Store/Redux/store';
import { useGetOrdersQuery } from '../Api/OrderApi';
import { OrderList } from '../Components/Page/Order';
import { MainLoader } from '../Components/Page/Common';
import { getStatusEnumRus, inputHelper } from '../Helper';
import { Status_Constant } from '../Utility/Constant';
import { IUser } from '../Interfaces';

const filterOptions = [
    "Все",
    Status_Constant.CONFIRMED,
    Status_Constant.BEING_COOKED,
    Status_Constant.READY_FOR_PICKUP,
    Status_Constant.CANCELLED
];

function AllOrders() {

    const [filters, setFilters] = useState({ search: '', status: '' });
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageOptions, setPageOptions] = useState({
        pageNumber: 1,
        pageSize: 5
    });
    const [currentPageSize, setCurrentPageSize] = useState(pageOptions.pageSize);
    const { data, isLoading } = useGetOrdersQuery({
        search: (filters ? filters.search : ''),
        status: (filters ? filters.status : 'Все'),
        pageNumber: pageOptions.pageNumber,
        pageSize: pageOptions.pageSize
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const tempValue = inputHelper(e, filters);
        setFilters(tempValue);
    }

    useEffect(()=>{
        if(data){
            const { TotalRecords } = JSON.parse(data.totalRecords);
            setTotalRecords(TotalRecords);
        }
    },[data]);

    const getPageDetails = () =>{
        const startNumber = (pageOptions.pageNumber - 1) * pageOptions.pageSize + 1;
        const endNumber = pageOptions.pageNumber * pageOptions.pageSize;
        return `${startNumber} - ${endNumber < totalRecords ? endNumber : totalRecords} из ${totalRecords}`;
    }

    const handlePageOptionsChange = (direction: string, pageSize?: number) => {
        switch (direction) {
            case 'prev': setPageOptions({ pageSize: currentPageSize, pageNumber: pageOptions.pageNumber - 1 });
                break;
            case 'next': setPageOptions({ pageSize: currentPageSize, pageNumber: pageOptions.pageNumber + 1 });
                break;
            case 'change': 
                setPageOptions({pageSize:pageSize ? pageSize : pageOptions.pageSize, pageNumber: 1});
                setCurrentPageSize(pageSize!);
            break;
        }
    }

    if (isLoading) return <MainLoader />

    return (
        <>
            <div className='d-flex align-items-center justify-content-between mx-5 mt-5'>
                <h1 className='text-success'>Заказы</h1>
                <div className='d-flex' style={{ width: '40%' }}>
                    <input
                        type='text'
                        className='form-control mx-2'
                        placeholder='Поиск имени или телефона'
                        onChange={handleChange}
                        name='search'
                    />
                    <select
                        className='form-select w-50 mx-2'
                        onChange={handleChange}
                        name='status'
                    >
                        {filterOptions.map((item: any, index: number) => {
                            return (
                                <option value={item == 'Все' ? '' : item} 
                                key={index}>
                                    {getStatusEnumRus(item)}
                                </option>
                            )
                        })}

                    </select>
                </div>
            </div>
            <OrderList orderData={data?.apiResponse.result} />
            <div className='d-flex mx-5 justify-content-end align-items-center'>
                <div>Записей на странице:</div>
                <div>
                    <select 
                        className='form-select mx-2'
                        onChange={(e:React.ChangeEvent<HTMLSelectElement>) =>{
                            handlePageOptionsChange('change', Number(e.target.value));                            
                        }}
                        style={{width:'80px'}}
                        value={currentPageSize}
                    >
                        <option>5</option>
                        <option>10</option>
                        <option>50</option>
                    </select>
                </div>
                <div className='mx-2'>
                    {getPageDetails()}
                </div>
                <button 
                    disabled={pageOptions.pageNumber == 1}
                    className='btn btn-outline-primary px-3 mx-2'
                    onClick={()=>handlePageOptionsChange('prev')}
                >
                    <i className='bi bi-chevron-left'></i>
                </button>
                <button 
                    disabled={pageOptions.pageNumber * pageOptions.pageSize >= totalRecords}
                    className='btn btn-outline-primary px-3 mx-2'
                    onClick={()=>handlePageOptionsChange('next')}
                >
                    <i className='bi bi-chevron-right'></i>
                </button>
            </div>
        </>
    )
}

export default AdminAuth(AllOrders);