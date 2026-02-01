import { configureStore } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SignupData, SignupResponse } from "@/types/auth/signup";

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/",
    credentials: 'include'
    }),
    
    endpoints : (builder) =>({
        signup: builder.mutation<SignupResponse, SignupData>({
            query : (body) => ({
                url : '/auth/signUp',
                method : 'POST',
                body
            }),
        }),

        login : builder.mutation<{
            token:string; user:any
        }, {email:string, password:string}>({
            query : (body) => ({
                url : '/auth/signIn',
                method : 'POST',
                body
            }),
        }),

       
    }),
})
export const { useLoginMutation, useSignupMutation } = api
