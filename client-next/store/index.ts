import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";

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