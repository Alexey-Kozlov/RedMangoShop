import React, { useState } from 'react'
import { IMenuItem } from '../../../Interfaces';
import { Link } from 'react-router-dom';
import { useUpdateShoppingCartMutation } from '../../../Api/ShoppingCartApi';
import { Loader } from '../Common';
const empty = require('../../../../src/Assets/Images/Empty.png');

interface Props {
    menuItem: IMenuItem
}

function MenuItemCard(props: Props) {

    const [isAddintToCart, setIsAddingToCart] = useState<boolean>(false);
    const [updateShoppingCart] = useUpdateShoppingCartMutation();

    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        const response = await updateShoppingCart({
            menuItemId:props.menuItem.id, 
            itemQuantityChanged:1, 
            userId:'9f771410-7aac-4648-8d19-b6cc488381ae'
        });
        setIsAddingToCart(false);
    }

  return (
    <div className='col-md-4 col-12 p-4'>
        <div className='card' style={{boxShadow:'0 1px 7px 0 rgb(0 0 0 / 50%)'}}>
            <div className='card-body pt-2'>
                <div className='row col-10 offset-1 p-4'>
                      <Link to={`/menuItemDetail/${props.menuItem.id}`}>
                          <img 
                          src=
                          { 
                            props.menuItem.image ?
                            `data:image/png;base64, ${props.menuItem.image}` :
                            empty
                          }
                          style={{ borderRadius: '50%' }}
                          className='w-100 mt-5 image-box' />
                      </Link>
                </div>
                {props.menuItem.specialTag && (
                <i className='bi bi-star btn btn-success'
                    style={{
                        position:"absolute",
                        top:'15px',
                        left:'15px',
                        padding:'5px 10px',
                        borderRadius: '3px',
                        outline: 'none !important',
                        cursor: 'pointer'
                    }}
                >&nbsp;{props.menuItem.specialTag}!</i>)
                }
                  {isAddintToCart ? (
                  <div style={{position:"absolute", top:'15px', right:'15px'}}>
                    <Loader text_type = 'warning' size = { 100 } />
                  </div>) : (
                      <i className='bi bi-cart-plus btn btn-outline-danger'
                          style={{
                              position: "absolute",
                              top: '15px',
                              right: '15px',
                              padding: '5px 10px',
                              borderRadius: '3px',
                              outline: 'none !important',
                              cursor: 'pointer'
                          }}
                          onClick={() => handleAddToCart()}
                      ></i>
                  )}

                  <div className='text-center'>
                      <p className='card-title m-0 text-success fs-3'>
                          <Link 
                            to={`/menuItemDetail/${props.menuItem.id}`}
                            style={{textDecoration:'none', color:'green'}}
                          >
                              {props.menuItem.name}
                          </Link>
                      </p>
                      <p className='badge bg-secondary' style={{ fontSize: '12px' }}>{props.menuItem.category}</p>
                  </div>
                <p className='card-text' style={{textAlign:'center'}}>{props.menuItem.description}</p>
                <div className='row text-center'>
                    <h4>{props.menuItem.price} руб.</h4>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MenuItemCard