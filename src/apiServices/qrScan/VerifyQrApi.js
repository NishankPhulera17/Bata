import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const VerifyQrApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        verifyQr : builder.mutation({
            query(data){
                console.log("from verifyqr api",data)
                return {
                    url:`api/app/barCodeScan`,
                    method:'post',
                    headers:{
                        "Content-Type": "application/json",
                        "slug":slug,
                        "Authorization": `Bearer ${data.token}`,
                    },
                    body:JSON.stringify(data.body)
                    
                }
            }
        })
    })
});


export const {useVerifyQrMutation} = VerifyQrApi

