import React from 'react'
import { ICartItem, IPayment } from '../../../Interfaces'

function OrderSummary({ state: { apiResult, userInput } }: IPayment) {
    return (
        <div className='col-md-7'>
            {' '}
            <h3 className='text-success'>Заказ {apiResult.id}:</h3>
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
                        <h4 className='text-danger' style={{ textAlign: 'right', marginRight:'20px' }}>
                            {apiResult.cartTotal?.toFixed(2)} руб.
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderSummary