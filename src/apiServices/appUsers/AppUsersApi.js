import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const AppUsersApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getAppUsersData : builder.mutation({
            query(){
                return {
                    url:`/api/app/appUserType`,
                    method:'get',
                    headers:{
                        "Content-Type": "application/json",
                        "slug":slug
                    },
                    
                   
                }
            }
        }),
        getAppUsersDataById : builder.mutation({
            query(params){
                return {
                    url:`/api/app/appUserType?appUserTypeId=${params.user_type_id}`,
                    method:'get',
                    headers:{
                        "Content-Type": "application/json",
                        "slug":slug
                    },
                    
                   
                }
            }
        })
    })
});


export const {useGetAppUsersDataMutation, useGetAppUsersDataByIdMutation} = AppUsersApi

