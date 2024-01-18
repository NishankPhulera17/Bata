import { baseApi } from '../baseApi';
import { slug } from '../../utils/Slug';

export const ReturnPointListApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getReturnPointList: builder.mutation({
            query(params) {
                console.log("data point sharing", params);
                return {
                    method: 'GET',
                    url: `/api/app/return-barcode`,

                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + params.token,
                        slug: slug,
                    },
                };
            },
        }),
    
    }),
});

export const { useGetReturnPointListMutation } = ReturnPointListApi;
