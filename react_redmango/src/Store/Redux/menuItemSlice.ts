import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    menuItem: [],
    search: '',
    category: '',
    sort: 'Наименование, А - Я'
};

export const menuItemSlice = createSlice({
    name: "MenuItem",
    initialState: initialState,
    reducers:{
        setMenuItem:(state, action) =>{
            state.menuItem = action.payload;
        },
        setSearchValue:(state, action) =>{
            state.search = action.payload;
        },
        setCategoryValue:(state, action) =>{
            state.category = action.payload;
        },
        setSortValue:(state, action) =>{
            state.sort = action.payload;
        }
    }
});

export const { setMenuItem, setSearchValue, setCategoryValue, setSortValue } = menuItemSlice.actions;
export const menuItemReducer = menuItemSlice.reducer;