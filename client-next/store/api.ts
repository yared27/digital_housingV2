"use client";
import { configureStore } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SignupData, SignupResponse } from "@/types/auth/signup";
import { IUser } from "@/types/user";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const baseQuery = fetchBaseQuery({ 
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers) => {
        headers.set("Content-Type", "application/json");
        return headers;
    }

});

//auto frefresh wrapper
const baseQueryWithReauth: typeof baseQuery = async (args:any, api:any, extraOptions:any) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        // try to get a new token
        const refreshResult = await baseQuery({url:'/api/auth/refresh-token', method:'POST'}, api, extraOptions);
        if (refreshResult?.error) {
            result = await baseQuery(args, api, extraOptions); // return the original 401 error
        } else {
            result = await baseQuery(args, api, extraOptions);
        }

}
    return result
}

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Auth', 'User', 'Property'],
    
    endpoints : (builder) =>({
         getMe : builder.query<{user:IUser}, void>({
            query : () => ({
                url : 'api/users/me', 
                providesTags: ['Auth'],
            }),
        }),
        
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                invalidatesTags: ['Auth'],
            }),
        }),

        signup: builder.mutation<SignupResponse, SignupData>({
            query : (body) => ({
                url : '/auth/signUp',
                method : 'POST',
                body
            }),
        }),

        login : builder.mutation<{ok:boolean, token:string; user:IUser}, {email:string, password:string}>({
            query : (body) => ({
                url : 'api/auth/signIn',
                method : 'POST',
                body
            }),
            invalidatesTags: ['Auth'],
        }),

        updateMe: builder.mutation<{user:IUser}, Partial<{name:string, email:string}>>({
            query: (body) => ({
                url: '/api/user/me',
                method: 'PUT',
                body
            }),
            invalidatesTags: ['User'],
        }),

       
    }),
})
export const {useGetMeQuery, useLogoutMutation, useLoginMutation, useSignupMutation, useUpdateMeMutation } = api