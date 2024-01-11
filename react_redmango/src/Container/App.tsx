
import { Route, Routes } from 'react-router-dom';
import { Footer, Header } from '../Components/Layout';
import { Home, MenuItemDetail, NotFound, ShoppingCart } from '../Pages';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useGetShoppingCartQuery } from '../Api/ShoppingCartApi';
import { setShoppingCart } from '../Store/Redux/shoppingCartSlice';

function App() {

  const dispatch = useDispatch();
  const { data, isLoading } = useGetShoppingCartQuery('9f771410-7aac-4648-8d19-b6cc488381ae');
  useEffect(() =>{
    if(!isLoading){
      dispatch(setShoppingCart(data.result?.cartItems));
    }
  },[data]);

  return (
    <div>
      <Header />
      <div className='pb-5'>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/menuItemDetail/:menuItemId' element={<MenuItemDetail />}></Route>
          <Route path='/ShoppingCart' element={<ShoppingCart />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
