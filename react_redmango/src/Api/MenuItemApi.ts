import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const menuItemApi = createApi({
    reducerPath: "menuItemApi",
    baseQuery: fetchBaseQuery({
        baseUrl:"http://localhost:5053/api/",
        prepareHeaders:(headers: Headers, api) => {
            const token = localStorage.getItem('RM_Token');
            token && headers.append('Authorization', 'Bearer ' + token);
        }
    }),
    tagTypes:["MenuItems"],
    endpoints: (builder)  => ({
        getMenuItems: builder.query({
            query: ({search, category, sort}) =>({
                url: "menuitem",
                params: {
                    search: search,
                    category: category,
                    sortType: sort
                }
            }),
            providesTags:["MenuItems"]
        }),
        getMenuItemById: builder.query({
            query: (id) =>({
                url: `menuitem/${id}`
            }),
            providesTags:["MenuItems"]
        }),
        updateMenuItem: builder.mutation({
            query: ({data, id}) =>({
                url:'menuItem/'+ id,
                method:'PUT',
                body: data
            }),
            invalidatesTags:['MenuItems']
        }),
        createMenuItem: builder.mutation({
            query: (data) =>({
                url:'menuItem',
                method:'POST',
                body: data
            }),
            invalidatesTags:['MenuItems']
        }),
        deleteMenuItem: builder.mutation({
            query: (id) =>({
                url:'menuItem/'+ id,
                method:'delete'
            }),
            invalidatesTags:['MenuItems']
        }),
    })
})

export const { useGetMenuItemsQuery, 
    useGetMenuItemByIdQuery,
    useCreateMenuItemMutation,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation } = menuItemApi;
export default menuItemApi;