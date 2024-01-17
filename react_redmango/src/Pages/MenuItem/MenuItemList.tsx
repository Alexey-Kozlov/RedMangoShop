import React from 'react'
import { useDeleteMenuItemMutation, useGetMenuItemsQuery } from '../../Api/MenuItemApi';
import { MainLoader } from '../../Components/Page/Common';
import { IMenuItem } from '../../Interfaces';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/Redux/store';
const empty = require('../../../src/Assets/Images/Empty.png');

function MenuItemList() {
    const { isFetching, refetch, data, isLoading } = useGetMenuItemsQuery({
        search: '', 
        category: '',
        sort: ''
      });
    const [deleteMenuItem] = useDeleteMenuItemMutation();
    const navigate = useNavigate();
    const handleDeleteMenuItem = async (id: number) => {
        toast.promise(
            deleteMenuItem(id),
            {
                pending: 'Выполнение удаления...',
                success: 'Запись успешно удалена',
                error: 'Ошибка удаления'
            },
            {
                theme: 'dark'
            }
        )
    }

    if(isLoading) return <MainLoader />

  return (
    <div className='table p-5'>
        <div className='d-flex align-items-center justify-content-between'>
            <h1 className='text-success'>Товары</h1>
            <button 
                className='btn btn-success'
                onClick={()=>navigate('/addMenuItem')}
            >Добавить</button>
        </div>
        <div className='p-2'>
            <div className='row border'>
                <div className='col-2'>Мзображение</div>
                <div className='col-1'>ID</div>
                <div className='col-2'>Наименование</div>
                <div className='col-2'>Категория</div>
                <div className='col-1'>Цена</div>
                <div className='col-2'>Акция</div>
                <div className='col-1'>Действие</div>
            </div>
            {data.result.map((item:IMenuItem, index:number) =>{
                return (
                    <div className='row border' key={index}>
                    <div className='col-2'>
                        <img src={ 
                            item.image ?
                            `data:image/png;base64, ${item.image}` :
                            empty
                          } style={{width:'100%', maxWidth:'120px'}} />
                    </div>
                    <div className='col-1'>{item.id}</div>
                    <div className='col-2'>{item.name}</div>
                    <div className='col-2'>{item.category}</div>
                    <div className='col-1'>{item.price}</div>
                    <div className='col-2'>{item.specialTag}</div>
                    <div className='col-1'>
                        <button 
                            className='btn btn-success'
                            onClick={()=>navigate('/addMenuItem/' + item.id)}
                        >
                            <i className='bi bi-pencil-fill'></i>
                        </button>
                        <button 
                            className='btn btn-danger mx-2'
                            onClick={()=>{handleDeleteMenuItem(item.id)}}
                        >
                            <i className='bi bi-trash-fill'></i>
                        </button>
                    </div>
                </div>
                )
            })}

        </div>
    </div>
  )
}

export default MenuItemList