
import { Route, Routes } from 'react-router-dom';
import { Footer, Header } from '../Components/Layout';
import { Home, Login, MenuItemDetail, NotFound, Register, ShoppingCart } from '../Pages';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useGetShoppingCartQuery } from '../Api/ShoppingCartApi';
import { setShoppingCart } from '../Store/Redux/shoppingCartSlice';
import { IUser } from '../Interfaces';
import { jwtDecode } from 'jwt-decode';
import { setAuthUser } from '../Store/Redux/authSlice';

function App() {

  const dispatch = useDispatch();
  const { data, isLoading } = useGetShoppingCartQuery('9f771410-7aac-4648-8d19-b6cc488381ae');

  useEffect(()=>{
    const token = localStorage.getItem('RM_Token');
    if(token){
      const {name, id, login, role} : IUser = jwtDecode(token);
      dispatch(setAuthUser({name, id, login, role}));
    }
  },[]);
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
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
