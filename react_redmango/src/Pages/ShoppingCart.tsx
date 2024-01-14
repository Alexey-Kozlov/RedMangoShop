import React from 'react'
import { CartDetails, CartSummary } from '../Components/Page/Cart'
import { Auth } from '../HOC';

function ShoppingCart() {
  return (
    <div className='row w-100' style={{ marginTop: '10px' }}>
      <div className='col-lg-6 col-12' style={{ fontWeight: 300 }}>
        <CartSummary />
      </div>
      <div className='col-lg-6 col-12 p-4'>
        <CartDetails />
      </div>
    </div>
  )
}

export default Auth(ShoppingCart);