
import { Route, Routes } from 'react-router-dom';
import { Footer, Header } from '../Components/Layout';
import { AccessDenied, AddMenuItem, AllOrders, Home, Login, MenuItemDetail, MenuItemList, NotFound, OrderDetail, Orders, Payment, Register, ShoppingCart, TestAuthAdmin, TestAuthCommon } from '../Pages';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useGetShoppingCartQuery } from '../Api/ShoppingCartApi';
import { setShoppingCart } from '../Store/Redux/shoppingCartSlice';
import { IUser } from '../Interfaces';
import { jwtDecode } from 'jwt-decode';
import { setAuthUser } from '../Store/Redux/authSlice';
import { RootState } from '../Store/Redux/store';
import checkToken from '../Helper/checkToken';

type token = string | null;

function App() {

  const dispatch = useDispatch();
  const [skip, setSkip] = useState(true);
  const userData: IUser = useSelector((state: RootState) => state.authStore);
  const { data, isLoading } = useGetShoppingCartQuery(userData.id, {
    skip: skip
  });

  useEffect(() => {
    const token: token = localStorage.getItem('RM_Token');
    if (checkToken()) {
      const { name, id, login, role }: IUser = jwtDecode(token!);
      dispatch(setAuthUser({ name, id, login, role }));
    }
  }, []);
  useEffect(() => {
    if (!isLoading && data) {
      dispatch(setShoppingCart(data.result?.cartItems));
    }
  }, [data]);

  useEffect(() => {
    if (userData.id) setSkip(false);
  }, [userData]);

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
          <Route path='/authorization' element={<TestAuthAdmin />}></Route>
          <Route path='/authentication' element={<TestAuthCommon />}></Route>
          <Route path='/accessDenied' element={<AccessDenied />}></Route>
          <Route path='/payment' element={<Payment />}></Route>
          <Route path='/orders' element={<Orders />}></Route>
          <Route path='/allOrders' element={<AllOrders />}></Route>
          <Route path='/orderDetail/:id' element={<OrderDetail />}></Route>
          <Route path='/menuItemList' element={<MenuItemList />}></Route>
          <Route path='/addMenuItem' element={<AddMenuItem />}></Route>
          <Route path='/addMenuItem/:id' element={<AddMenuItem />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
