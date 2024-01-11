import React, { useState } from 'react'
import { ICartItem } from '../../../Interfaces'
import { RootState } from '../../../Store/Redux/store'
import { useSelector } from 'react-redux';
import { inputHelper } from '../../../Helper';
import { Loader } from '../Common';

function CartDetails() {

    const [loading, setLoading] = useState(false);
    const shoppingCartStore: ICartItem[] = useSelector(
        (state: RootState) => state.shoppingCartStore.cartItems ?? []
    )
    let totalSum = 0;
    let totalItems = 0;

    const initialUserData = {
        name: '',
        email: '',
        phone: ''
    }

    shoppingCartStore?.map((item:ICartItem) => {
        totalItems += item.quantity ?? 0;
        totalSum += (item.quantity ?? 0) * (item.menuItem.price ?? 0);
        return null;
    });

    const [userInput, setUserInput] = useState(initialUserData);
    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tempData = inputHelper(e, userInput);
        setUserInput(tempData);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
    }

  return (
    <div className='border pb-5 pt-3'>
        <h1 style={{fontWeight:'300'}} className='text-center text-success'>
            Пользователь
        </h1>
        <hr />
        <form onSubmit={handleSubmit} className='col-10 mx-auto'>
            <div className='form-group mt-3'>
                Наименование
                <input 
                type='text' 
                value={userInput.name}
                onChange={handleUserInput}
                className='form-control' 
                placeholder='Наименование...' 
                name='name' 
                required />
            </div>
            <div className='form-group mt-3'>
                Эл.почта
                <input 
                type='email' 
                value={userInput.email}
                onChange={handleUserInput}
                className='form-control' 
                placeholder='Эл.почта...' 
                name='email' 
                required />
            </div>
            <div className='form-group mt-3'>
                Телефон
                <input 
                type='number' 
                value={userInput.phone}
                onChange={handleUserInput}
                className='form-control' 
                placeholder='Телефон...' 
                name='phone' required />
            </div>
            <div className='form-group mt-3'>
                <div className='card p-3' style={{background:'ghostwhite'}}>
                    <h5>Итог: {totalSum.toFixed(2)} руб.</h5>
                    <h5>Количество покупок: {totalItems}</h5>
                </div>
            </div>
            <button type='submit' 
                disabled={loading}
                className='btn btn-lg btn-success form-control mt-3'>
                    {
                        loading ? <Loader /> : (
                            <>
                                Все правильно? Размещаем заказ!
                                &nbsp;<i className="bi bi-emoji-smile"></i>
                            </>
                        )
                    }                    
            </button>
        </form>
    </div>
  )
}

export default CartDetails