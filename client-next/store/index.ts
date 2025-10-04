import { configureStore } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api"}),
    endpoints : (builder) =>({
        getProperties : builder.query<any[], void>({
            query : () => 'properties', 
    }),
    }),
})

export const { useGetPropertiesQuery} = api
const store = configureStore({
    reducer: {
        // your reducers here
        [api.reducerPath]: api.reducer
    }
    ,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;