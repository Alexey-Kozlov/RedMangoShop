import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { ICartItem, IUser } from '../../Interfaces';
import { RootState } from '../../Store/Redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { emptyUserState, setAuthUser } from '../../Store/Redux/authSlice';
import { Roles_Constant } from '../../Utility/Constant';

const logo = require("../../Assets/Images/mango.jpg");

function Header() {
    const shoppingCartStore: ICartItem[] = useSelector(
        (state: RootState) => state.shoppingCartStore.cartItems ?? []
    );

    const userData : IUser = useSelector((state:RootState) => state.authStore);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('RM_Token');
        dispatch(setAuthUser({...emptyUserState}));
        navigate('/');
    }

  return (
      <div>
          <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
              <div className="container-fluid">
                  <NavLink className="nav-link" aria-current="page" to="/">
                      <img src={logo} style={{ height: "40px" }} className='m-1' />
                  </NavLink>
                  <button
                      className="navbar-toggler"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#navbarSupportedContent"
                      aria-controls="navbarSupportedContent"
                      aria-expanded="false"
                      aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarSupportedContent">
                      <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100">
                          <li className="nav-item">
                              <NavLink className="nav-link" aria-current="page" to="/">Главная</NavLink>
                          </li>
                          {userData.id &&
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/orders">Заказы</NavLink>
                            </li>
                          }
                          {userData.role == Roles_Constant.ADMIN && (
                              <li className="nav-item dropdown">
                                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                      Панель управления
                                  </a>
                                  <ul className="dropdown-menu">
                                      <li style={{cursor:'pointer'}} className="dropdown-item" onClick={()=>navigate('/allOrders')}>Все заказы</li>
                                      <li style={{cursor:'pointer'}} className="dropdown-item" onClick={()=>navigate('/authentication')}>Common</li>
                                      <li style={{cursor:'pointer'}} className="dropdown-item" onClick={()=>navigate('/authorization')}>Admin</li>
                                  </ul>
                              </li>
                          )}

                          <li className="nav-item">
                              <NavLink className="nav-link" aria-current="page" to="/shoppingCart">
                                <i className='bi bi-cart'></i>&nbsp;
                                {userData.id && shoppingCartStore.length ? `(${shoppingCartStore.length})`:''}
                              </NavLink>
                          </li>
                          <div className='d-flex' style={{marginLeft:'auto'}}>
                            {userData.id && (<>
                            <li className='nav-item'>
                            <button
                                    className='nav-link active'
                                    style={{border:0, cursor:'pointer', background:'transparent' }}
                                    >
                                        Здравствуйте, {userData.name}
                                    </button>
                            </li>
                            <li className='nav-item'>
                                <button
                                    className='btn btn-success btn-outlined rounded-pill text-white mx-2'
                                    style={{border:'none', height:'40px', width:'100px'}}
                                    onClick={()=>handleLogout()}
                                    >
                                        Выход
                                    </button>
                            </li></>)}
                            
                            {!userData.id && (<>                           
                            <li className='nav-item text-white'>
                                <NavLink className='nav-link' to='/register'>Регистрация</NavLink>
                            </li>
                            <li className='nav-item text-white'>
                                <NavLink 
                                    className='btn btn-success btn-outlined rounded-pill text-white mx-2'
                                    style={{border:'none', height:'40px', width:'100px'}}
                                    to='/login'>
                                        Вход
                                    </NavLink>
                            </li></>)}
                          </div>
                      </ul>
                  </div>
              </div>
          </nav>
    </div>
  )
}

export default Header