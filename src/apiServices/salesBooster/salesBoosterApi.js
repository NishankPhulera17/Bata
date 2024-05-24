import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const salesBoosterApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        checkSalesBooster: builder.mutation({
        query: (token) => {
            console.log("salesBooster check", token)
        return {
        method: "GET",
        url: `/api/app/salesBooster/check`,
        headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        slug: slug,
        },
        };
        },
        })
        ,
        checkSalesBoosterHistory: builder.mutation({
            query: (token) => {
                console.log("salesBooster check", token)
            return {
            method: "GET",
            url: `/api/app/salesBooster/history`,
            headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            slug: slug,
            },
            };
            },
            }),
        checkSalesBoosterOnEachScan: builder.mutation({
            query: (token) => {
                return {
                method: "GET",
                url: `/api/app/salesBooster/eachScan`,
                headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
                slug: slug,
                },
                };
                },
        }),
        claimSalesBooster : builder.mutation({
            
            query: (params) => {
                return {
                method: "POST",
                url: `/api/app/salesBooster/claim`,
                headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + params.token,
                slug: slug,
                },
                body:params.body
                };
                },
        })
    })
});

export const {useCheckSalesBoosterMutation, useCheckSalesBoosterOnEachScanMutation, useClaimSalesBoosterMutation,useCheckSalesBoosterHistoryMutation} = salesBoosterApi;
