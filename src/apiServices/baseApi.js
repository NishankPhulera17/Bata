
import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://103.153.58.83:5000' }),
    endpoints: () => ({
      
      }),
    })
  
  