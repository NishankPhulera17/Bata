import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const AddBankAccount = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        addBankDetails : builder.mutation({
            query(params){
                console.log(params)
                return {
                    url:`/api/app/bankDetail/add`,
                    method:'Post',
                    headers:{
                        "Content-Type": "application/json",
                        "slug":slug,
                        "Authorization": `Bearer ${params.token}`,
                    },
                    body:params.data
                    
                   
                }
            }
        }),
        updateStatusBankAccount: builder.mutation({
            query: (params) => {
              return {
                method: "PATCH",
                url: `/api/app/bankDetail/${params.id}`,
                headers: {
                    Authorization: "Bearer " + params.token,
                  slug: slug,
                },
              };
            },
          }),

        
    })
});


export const {useAddBankDetailsMutation, useUpdateStatusBankAccountMutation} = AddBankAccount

