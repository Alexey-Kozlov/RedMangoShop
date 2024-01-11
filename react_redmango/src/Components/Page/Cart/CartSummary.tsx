import React from 'react'
import { ICartItem } from '../../../Interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/Redux/store';
import { removeFromCart, updateQuantity } from '../../../Store/Redux/shoppingCartSlice';
import { useUpdateShoppingCartMutation } from '../../../Api/ShoppingCartApi';
const empty = require('../../../../src/Assets/Images/Empty.png');

function CartSummary() {

    const shoppingCartStore: ICartItem[] = useSelector(
        (state: RootState) => state.shoppingCartStore.cartItems ?? []
    )
    const dispatch = useDispatch();
    const [updateShoppingCart]  = useUpdateShoppingCartMutation();

    const handleQuantity = (quantity:number, cartItem: ICartItem) => {
        if(cartItem.quantity === 1 && quantity === -1){
            return;
        }
        updateShoppingCart({
            menuItemId : cartItem.menuItem.id, 
            itemQuantityChanged: quantity, 
            userId: '9f771410-7aac-4648-8d19-b6cc488381ae'
        });
        if(quantity == 0 ){
            dispatch(removeFromCart({cartItem: cartItem}));
        } else {
            dispatch(updateQuantity({cartItem: cartItem, quantity: cartItem.quantity + quantity}));
        }

    }

    if (!shoppingCartStore) {
        return <div>Корзина пуста</div>
    }

    return (
        <div className='container p-4 m-2'>
            <h4 className='text-center text-success'>В корзине</h4>

            {shoppingCartStore.map((item: ICartItem, index: number) => {
                return (
                    <div className='d-flex flex-sm-row flex-column align-items-center custom-card-shadow rounded m3'
                        key={index}
                        style={{ background: 'ghostwhite' }}>
                        <div className='p-3'>
                            <img src={ 
                                item.menuItem.image ?
                                `data:image/png;base64, ${item.menuItem.image}` :
                                empty
                            } width={'120px'} className='rounded-circle' />
                        </div>
                        <div className='p-2 mx-3' style={{ width: '100%' }}>
                            <div className='d-flex justify-content-between align-items-center'>
                                <h4 style={{ fontWeight: 300 }}>{item.menuItem.name}</h4>
                                <h4>{(item.quantity * item.menuItem.price).toFixed(2)} руб.</h4>
                            </div>
                            <div className='flex-fill'>
                                <h4 className='text-danger'>{item.menuItem.price} руб.</h4>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className='d-flex justify-content-between p-2 mt-2 rounded-pill custom-card-shadow'
                                    style={{ width: '100px', height: '43px' }}>
                                    <span style={{ color: 'rgba(22,22,22,.7)' }} role='button'>
                                        <i className='bi bi-dash-circle-fill'
                                            onClick={()=>handleQuantity(-1, item )}
                                        ></i>
                                    </span>
                                    <span>
                                        <b>{item.quantity}</b>
                                    </span>
                                    <span style={{ color: 'rgba(22,22,22,.7)' }} role='button'>
                                        <i className='bi bi-plus-circle-fill'
                                            onClick={()=>handleQuantity(1, item )}
                                        ></i>
                                    </span>
                                </div>
                                <button className='btn btn-danger mx-1'
                                    onClick={()=>handleQuantity(0, item )}
                                >Удалить</button>
                            </div>
                        </div>
                    </div>)
            })}

        </div>
    )
}

export default CartSummary