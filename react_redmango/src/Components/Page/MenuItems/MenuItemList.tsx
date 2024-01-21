import React, { useEffect, useState } from 'react';

import { IMenuItem } from '../../../Interfaces';
import MenuItemCard from './MenuItemCard';
import { useGetMenuItemsQuery } from '../../../Api/MenuItemApi';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryValue, setMenuItem, setSortValue } from '../../../Store/Redux/menuItemSlice';
import { MainLoader } from '../Common';
import { RootState } from '../../../Store/Redux/store';
import { Category_Constant, SortTypes_Constant } from '../../../Utility/Constant';

function MenuItemList() {
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const dispatch = useDispatch();

  const searchValue = useSelector((state:RootState) => state.menuItemStore.search);
  const categoryValue = useSelector((state: RootState) => state.menuItemStore.category);
  const sortValue = useSelector((state: RootState) => state.menuItemStore.sort);
  const { isFetching, refetch, data, isLoading } = useGetMenuItemsQuery({
    search: searchValue, 
    category: categoryValue,
    sort: sortValue
  });

  const sortOption:Array<SortTypes_Constant> = [
    SortTypes_Constant.NAME_A_Z,
    SortTypes_Constant.NAME_Z_A,
    SortTypes_Constant.PRICE_HIGH_LOW,
    SortTypes_Constant.PRICE_LOW_HIGH
  ];

  const categories:Array<Category_Constant> = [
    Category_Constant.ВСЕ,
    Category_Constant.КРУПА,
    Category_Constant.МОЛОЧНЫЕ,
    Category_Constant.МОРЕПРОДУКТЫ,
    Category_Constant.МЯСО,
    Category_Constant.ОВОЩИ,
    Category_Constant.ФРУКТЫ,
    Category_Constant.ХЛЕБ
  ]

  //вызываем обновление запроса при каждом изменении поискового слова
  useEffect(() => {
    refetch();
  },[searchValue, categoryValue, sortValue]);

//вызываем обновление сохраненного набора данных
  useEffect(() =>{
  if(!isFetching){
    setMenuItems(data.result);
  }
  }, [isFetching])


  const handleCategoryClick = (i: number) => {
    const buttons = document.querySelectorAll('.custom-buttons');
    buttons.forEach((button, index) => {
      button.classList.remove('active');
      if(index === i){
        button.classList.add('active');
      }
    });
    dispatch(setCategoryValue(categories[i]));
  }

  const handleSortClick = (index:number) =>{
    dispatch(setSortValue(sortOption[index]));
  }

  //if(isLoading || isFetching) return <MainLoader /> 
  if(isLoading) return <MainLoader /> 

  return (
    <div className='container row'>
      <div className='my-3'>
        <ul className='nav w-100 d-flex justify-content-between'>
          <div className='d-flex justify-content-center' style={{maxWidth:'1000px'}}>
            {categories.map((categoryItem: any, index: number) => {
              return (
                <li
                  className='nav-item'               
                  key={index}>
                  <button
                    className={`nav-link p-0 pb-2 custom-buttons fs-5`}
                    onClick={() => handleCategoryClick(index)}
                  >
                    {categoryItem}
                  </button>
                </li>
              )
            })}
          </div>
          <div style={{ textAlign: 'center', marginRight: '2px' }}>
            <p style={{ marginBottom: '2px' }}>Сортировка</p>
            <li className='nav-item dropdown' style={{ marginTop: '2px' }}>
              <div
                className='nav-link dropdown-togggle text-dark fs-6 border'
                role='button'
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                {sortValue}
              </div>
              <ul className='dropdown-menu'>
                {sortOption.map((item: any, index: number) => {
                  return (
                    <li key={index}
                      className='dropdown-item'
                      onClick={() => handleSortClick(index)}
                    >{item}</li>
                  )
                })}
              </ul>
            </li>
          </div>

        </ul>
      </div>
      {menuItems.length > 0 && menuItems.map((menuItem : IMenuItem, index: number) => {
        return <MenuItemCard menuItem = {menuItem} key={index} />
      })}
    </div>
  )
}

export default MenuItemList