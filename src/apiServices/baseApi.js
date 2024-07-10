import { BaseUrl } from '../utils/BaseUrl'
import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ baseUrl: BaseUrl }),
    endpoints: () => ({
      
      }),
    })
  
    //http://saas-api-dev.genefied.in/
    //https://saas.genefied.in/