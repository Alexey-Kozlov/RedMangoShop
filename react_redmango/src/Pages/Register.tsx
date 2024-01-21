import React, { useState } from 'react'
import { Roles_Constant } from '../Utility/Constant'
import { inputHelper, toastNotify } from '../Helper';
import { useRegisterUserMutation } from '../Api/AuthApi';
import { IResponse } from '../Interfaces';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [registerUser] = useRegisterUserMutation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userInput, setUserInput] = useState({
        login: '',
        password: '',
        role: '',
        name: ''
    });

    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const tempData = inputHelper(e, userInput);
        setUserInput(tempData);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const response: IResponse = await registerUser({
            login: userInput.login,
            password: userInput.password,
            role: userInput.role,
            name: userInput.name
        });
        if (response.data) {
            toastNotify(`Пользователь ${userInput.name} успешно зарегистрирован! Войдите в систему для продолжения.`);
            navigate('/login');
        } else if (response.error) {
            toastNotify(response.error.data.errorMessages[0], 'error');
        }
        setLoading(false);
    }

    return (
        <div className='container text-center'>
            <form method='post' onSubmit={handleSubmit}>
                <h1 className='mt-5'>Регистрация</h1>
                <div className='mt-5'>
                    <div className='col-sm-6 offset-sm-3 col-xs-12 mt-4'>
                        <input
                            type='text'
                            name='name'
                            className='form-control'
                            placeholder='Введите имя пользователя...'
                            required
                            value={userInput.name}
                            onChange={handleUserInput}
                        />
                    </div>
                    <div className='col-sm-6 offset-sm-3 col-xs-12 mt-4'>
                        <input
                            type='text'
                            name='login'
                            className='form-control'
                            placeholder='Введите login...'
                            required
                            value={userInput.login}
                            onChange={handleUserInput}
                        />
                    </div>
                    <div className='col-sm-6 offset-sm-3 col-xs-12 mt-4'>
                        <input
                            type='password'
                            name='password'
                            className='form-control'
                            placeholder='Введите пароль...'
                            required
                            value={userInput.password}
                            onChange={handleUserInput}
                        />
                    </div>
                    <div className='col-sm-6 offset-sm-3 col-xs-12 mt-4'>
                        <select
                            className='form-control form-select'
                            name='role'
                            required
                            value={userInput.role}
                            onChange={handleUserInput}
                        >
                            <option value="">-- Выберите роль --</option>
                            <option value={Roles_Constant.CUSTOMER}>Пользователь</option>
                            <option value={Roles_Constant.ADMIN}>Администратор</option>
                        </select>
                    </div>
                </div>
                <div className='mt-5'>
                    <button type='submit' className='btn btn-success' disabled={loading}>
                        Регистрация
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Register