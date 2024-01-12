import React, { useState } from 'react'
import { inputHelper, toastNotify } from '../Helper';
import { useLoginUserMutation } from '../Api/AuthApi';
import { IResponse, IUser } from '../Interfaces';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../Store/Redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { MainLoader } from '../Components/Page/Common';

function Login() {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userInput, setUserInput] = useState({
        login:'',
        password:''
    });
    const [loginUser] = useLoginUserMutation();

    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tempData = inputHelper(e, userInput);
        setUserInput(tempData);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const response: IResponse = await loginUser({
            login:userInput.login,
            password:userInput.password
        });
        if(response.data){
            const {token} = response.data.result;
            const {name, id, login, role} : IUser = jwtDecode(token);
            localStorage.setItem('RM_Token',token);
            dispatch(setAuthUser({name, id, login, role}));
            toastNotify(`Успешный вход в систему пользователя ${name}!`);
            navigate('/');
        } else if (response.error){
            toastNotify(response.error.data.errorMessages[0], 'error');
            setError(response.error.data.errorMessages[0]);
        }
        setLoading(false);
    }

    if(loading) return <MainLoader />
    

  return (
    <div className='container text-center'>
        <form method='post' onSubmit={handleSubmit}>
            <h1 className='mt-5'>Логин</h1>
            <div className='mt-5'>
                <div className='col-sm-6 offset-sm-3  col-xs-12 mt-4'>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Введите логин..'
                        name='login'
                        value={userInput.login}
                        onChange={handleUserInput}
                        required
                    />
                </div>
                <div className='col-sm-6 offset-sm-3  col-xs-12 mt-4'>
                    <input
                        type='password'
                        className='form-control'
                        placeholder='Введите пароль..'
                        name='password'
                        onChange={handleUserInput}
                        value={userInput.password}
                        required
                    />
                </div>
            </div>
            <div className='mt-2'>
                {error && <p className='text-danger'>{error}</p>}
                <button type='submit' className='btn btn-success' style={{width: '200px'}}>
                    Войти
                </button>
            </div>
        </form>
    </div>
  )
}

export default Login