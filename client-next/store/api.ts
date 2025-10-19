import { configureStore } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api"}),
    
    endpoints : (builder) =>({
        signup: builder.mutation<{
            token : String; user:any
        }, {name:string, email:string, password:string}>({
            query : (body) => ({
                url : 'auth/signup',
                method : 'POST',
                body
            }),
        }),
        login : builder.mutation<{
            token:string; user:any
        }, {email:string, password:string}>({
            query : (body) => ({
                url : 'auth/signin',
                method : 'POST',
                body
            }),
        }),

       
    }),
})
export const { useLoginMutation, useSignupMutation } = api
