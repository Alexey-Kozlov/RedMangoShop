import React from 'react'
import OrderListProps from './OrderListType'
import { IOrderHeader } from '../../../Interfaces';
import { useNavigate } from 'react-router-dom';

function OrderList({orderData} : OrderListProps) {

    const navigate = useNavigate();

  return (
    <div className='table p-5'>
            <h1 className='text-uccess'>Заказы</h1>
            <div className='p-2'>
                <div className='row border'>
                    <div className='col-1'>ID</div>
                    <div className='col-3'>Покупатель</div>
                    <div className='col-2'>Телефон</div>
                    <div className='col-1'>Сумма</div>
                    <div className='col-1'>Товаров</div>
                    <div className='col-2'>Дата</div>
                    <div className='col-2'></div>
                </div>
                {orderData.map((item: IOrderHeader, index: number) => {
                    return (
                        <div className='row border' key={index}>
                            <div className='col-1'>{item.orderHeaderId}</div>
                            <div className='col-3'>{item.name}</div>
                            <div className='col-2'>{item.phone}</div>
                            <div className='col-1'>{item.orderTotal.toFixed(2)} руб.</div>
                            <div className='col-1'>{item.totalItems}</div>
                            <div className='col-2'>{new Date(item.orderDate).toLocaleDateString()}</div>
                            <div className='col-2'>
                                <button 
                                className='btn btn-success'
                                onClick={() => 
                                    navigate('/orderDetail/' + item.orderHeaderId)
                                }
                                >Подробно</button>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
  )
}

export default OrderList