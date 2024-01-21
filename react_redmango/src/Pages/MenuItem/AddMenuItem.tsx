import React, { useEffect, useState } from 'react'
import { inputHelper, toastNotify } from '../../Helper';
import { useCreateMenuItemMutation, useGetMenuItemByIdQuery, useUpdateMenuItemMutation } from '../../Api/MenuItemApi';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLoader } from '../../Components/Page/Common';
import { Category_Constant } from '../../Utility/Constant';

const empty = require('../../../src/Assets/Images/Empty.png');
const Categories = [
    Category_Constant.КРУПА,
    Category_Constant.МОЛОЧНЫЕ,
    Category_Constant.МОРЕПРОДУКТЫ,
    Category_Constant.МЯСО,
    Category_Constant.ОВОЩИ,
    Category_Constant.ФРУКТЫ,
    Category_Constant.ХЛЕБ
]

const menuItemData = {
    name: '',
    description: '',
    specialTag: '',
    category: Categories[0],
    price: 0
}





function AddMenuItem() {
    const {id} = useParams();
    const [itemInput, setItemInput] = useState(menuItemData);
    const [imageDisplay, setImageDisplay] = useState<string>('');
    const [imageBlob, setImageBlob] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [createMenuItem] = useCreateMenuItemMutation();
    const [updateMenuItem] = useUpdateMenuItemMutation();
    const {data, isLoading} = useGetMenuItemByIdQuery(id);
    const navigate = useNavigate();

    useEffect(() =>{
        if(data && data.result){
            const tempData = {
                name: data.result.name,
                description: data.result.description,
                specialTag: data.result.specialTag,
                category: data.result.category,
                price: data.result.price
            }
            setItemInput(tempData);
            setImageDisplay(data.result.image ?
                `data:image/png;base64, ${data.result.image}` :
                empty);
        }
    },[data]);

    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement  | HTMLSelectElement | HTMLTextAreaElement>) => {
        const tempData = inputHelper(e, itemInput);
        setItemInput(tempData);
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const imageType = file.type.split('/')[1];
            const validImageTypes = ['jpg', 'jpeg', 'png', 'bmp'];
            if (!validImageTypes.find(p => p == imageType)) {
                setImageBlob('');
                toastNotify('Не поддерживаемый тип файла');
                return;
            }
            if (file.size > 1000 * 1024) {
                setImageBlob('');
                toastNotify(`Размер файла - ${(file.size / 1024 / 1000).toFixed(2)} Мб. Файл изображения должен быть меньше 1Мб!`);
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            setImageBlob(file);
            reader.onload = (e) => {
                const imgUrl = e.target?.result as string;
                setImageDisplay(imgUrl);
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (!imageBlob && !id) {
            toastNotify('Необходимо выбрать изображение!', 'error');
            setLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append('Name', itemInput.name);
        formData.append('Description', itemInput.description ?? '');
        formData.append('SpecialTag', itemInput.specialTag ?? '');
        formData.append('Category', itemInput.category);
        formData.append('Price', itemInput.price.toString());
        if(imageDisplay){
            formData.append('File', imageBlob);
        }
        let response;
        if(id){
            //update new menuItem
            formData.append('id', id);
            response = await updateMenuItem({data: formData, id: id});
            toastNotify('Запись была успешно обновлена!','success');
        } else {
            //create menuItem
            response = await createMenuItem(formData);
            toastNotify('Новая запись о товаре была успешно создана!','success');
        }

        if (response) {
            setLoading(false);
            navigate('/menuItemList');
        }

        setLoading(false);
    }

    if (loading) return <MainLoader />

    return (
        <div className='container border mt-5 p-5 bg-light'>
            <form method='post' encType='multipart/form-data' onSubmit={handleSubmit}>
                <h3 className='px-2 text-success text-center col-md-7'>
                    {id? `Редактирование товара` : `Добавление товара`}
                </h3>
                <div className='row mt-3'>
                    <div className='col-md-7'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Наименование'
                            name='name'
                            value={itemInput.name}
                            onChange={handleUserInput}
                            required />
                        <textarea
                            className='form-control mt-3'
                            placeholder='Примечание'
                            rows={5}
                            name='description'
                            value={itemInput.description}
                            onChange={handleUserInput}
                        ></textarea>
                        <input
                            type='text'
                            className='form-control mt-3'
                            placeholder='Акция'
                            name='specialTag'
                            value={itemInput.specialTag}
                            onChange={handleUserInput}
                        />
                        <select
                            className='form-control mt-3 form-select'
                            name='category'
                            value={itemInput.category}
                            onChange={handleUserInput}
                        >
                            {Categories.map((itemCategory:any, index:number) =>{
                                return (
                                    <option value={itemCategory}>{itemCategory}</option>
                                )
                            })}
                        </select>
                        <input
                            type='number'
                            className='form-control mt-3'
                            placeholder='Цена'
                            name='price'
                            value={itemInput.price}
                            onChange={handleUserInput}
                        />
                        <input
                            type='file'
                            className='form-control mt-3'
                            placeholder='Изображение'
                            onChange={handleFileChange}
                        />
                        <div className='row'>
                            <div className='col-6'>
                                <a onClick={() => navigate('/menuItemList')} className='btn btn-secondary form-control mt-3'>
                                    Назад
                                </a>
                            </div>
                            <div className='col-6'>
                                <button className='btn btn-success mt-3 form-control' type='submit'>
                                    {id? `Обновить` : `Добавить новый товар`}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-5 text-center'>
                        <img src={imageDisplay} style={{ width: '100% ', borderRadius: '30px' }} />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddMenuItem