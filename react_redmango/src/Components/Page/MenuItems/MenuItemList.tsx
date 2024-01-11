import React, { useEffect, useState } from 'react';

import { IMenuItem } from '../../../Interfaces';
import MenuItemCard from './MenuItemCard';
import { useGetMenuItemsQuery } from '../../../Api/MenuItemApi';
import { useDispatch } from 'react-redux';
import { setMenuItem } from '../../../Store/Redux/menuItemSlice';
import { MainLoader } from '../Common';

function MenuItemList() {
    //const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);

  const { data, isLoading } = useGetMenuItemsQuery(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading) {
      dispatch(setMenuItem(data.result));
    }
  }, [isLoading]);

  if(isLoading){
    return (
    <div>
      <MainLoader />
    </div>)
  }

  return (
    <div className='container row'>
      {data.result.length > 0 && data.result.map((menuItem : IMenuItem, index: number) => {
        return <MenuItemCard menuItem = {menuItem} key={index} />
      })}
    </div>
  )
}

export default MenuItemList