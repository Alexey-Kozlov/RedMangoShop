import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useGetMenuItemByIdQuery } from '../Api/MenuItemApi';
import { useNavigate } from 'react-router-dom';
import { useUpdateShoppingCartMutation } from '../Api/ShoppingCartApi';
import { Loader, MainLoader } from '../Components/Page/Common';

const empty = require('../../src/Assets/Images/Empty.png');
//const alex - 9f771410-7aac-4648-8d19-b6cc488381ae

function MenuItemDetail() {

    const { menuItemId } = useParams();
    const { data, isLoading } = useGetMenuItemByIdQuery(menuItemId); 
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [isAddintToCart, setIsAddingToCart] = useState<boolean>(false);
    const [updateShoppingCart] = useUpdateShoppingCartMutation();

    const handleQuantity = (quant:number) =>{
        let newQuant = quantity + quant;
        if(newQuant == 0){
            newQuant = 1;
        }
        setQuantity((previousState) => {
            return newQuant;
        });
    }

    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        const response = await updateShoppingCart({
            menuItemId:menuItemId, 
            itemQuantityChanged:quantity, 
            userId:'9f771410-7aac-4648-8d19-b6cc488381ae'
        });
        setIsAddingToCart(false);
    }

    return (
        <div className='container pt-4 pt-md-5'>
            
        {!isLoading ? (
            <div className='row'>
                <div className='col-7'>
                    <h2 className='text-success'>{data.result?.name}</h2>
                    <span>
                        <span className='badge text-bg-dark pt-2' style={{ height: '40px', fontSize: '20px' }}>
                            {data.result?.category}
                        </span>
                    </span>
                    <span>
                        <span className='badge text-bg-light pt-2' style={{ height: '40px', fontSize: '20px' }}>
                            {data.result?.specialTag}
                        </span>
                    </span>
                    <p style={{ fontSize: '25px' }} className='pt-2'>{data.result?.description}</p>
                    <span className='h3'>{data.result?.price} руб.</span>&nbsp;&nbsp;&nbsp;
                    <span className='pb-2 p-3' style={{ border: '1px solid #333', borderRadius: '30px' }}>
                        <i onClick={()=>handleQuantity(-1)}
                        className='bi bi-dash p-1' style={{ fontSize: '25px', cursor: 'pointer' }}></i>
                        <span className='h3 mt-3 px-3'>{quantity}</span>
                        <i onClick={()=>handleQuantity(1)}
                        className='bi bi-plus p-1' style={{ fontSize: '25px', cursor: 'pointer' }}></i>
                    </span>
                    <div className='row pt-4'>
                        <div className='col-5'>      
                        {
                            isAddintToCart? (
                                <button disabled
                                className='btn btn-success form-control'
                                ><Loader size = { 50 } /></button>
                            ) : (
                                <button 
                                className='btn btn-success form-control'
                                onClick={()=>handleAddToCart()}
                                >Добавить в корзину</button>
                            )
                        }                   

                        </div>
                        <div className='col-5'>
                            <button className='btn btn-secondary form-control'
                            onClick={() => navigate(-1)}
                            >Назад
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-5'>
                    <img src=
                          { 
                            data.result?.image ?
                            `data:image/png;base64, ${data.result?.image}` :
                            empty
                          } 
                          width='100%' style={{ borderRadius: '50%' }}></img>
                </div>
            </div>
        ):(
            <div className="d-flex justify-content-center" style={{width:"100%"}}>
                <div>
                    <MainLoader />
                </div>
            </div>

        )}            
        </div>
    )
}

export default MenuItemDetail