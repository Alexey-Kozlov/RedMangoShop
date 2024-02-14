import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import './Banner.css';
import { setSearchValue } from '../../../Store/Redux/menuItemSlice';

function Banner() {

    const [value, setValue] = useState('');
    const dispatch = useDispatch();
    const [currentTime, setCurrentTime] = useState(new Date());

    const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchValue(e.target.value));
        setValue(e.target.value);
    }
    useEffect(() => {
        const handleTimeOut = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(handleTimeOut);
    }, [])

    return (
        <div className='custom-banner'>
            <div className='m-auto' style={{ textAlign: 'center', color: 'white' }}>
                {currentTime.toLocaleString()}
            </div>
            <div
                className='m-auto d-flex align-items-center'
                style={{ width: '400px', height: '50vh' }}
            >
                <div className='d-flex align-items-center' style={{ width: '100%' }}>
                    <input
                        type='text'
                        className='form-control rounded-pill'
                        style={{ width: '100%', padding: '20px 20px' }}
                        placeholder='Поиск товаров...'
                        value={value}
                        onChange={handleValue}
                    />
                    <span style={{ position: 'relative', left: '-43px' }}>
                        <i className='bi bi-search'></i>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Banner