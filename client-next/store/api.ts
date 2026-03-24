"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SignupData, SignupResponse } from "@/types/auth/signup";
import { IUser } from "@/types/user";
import { Booking } from "@/types/booking";
import { Property, PropertiesListResponse } from "@/types/property";

const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers) => {
        headers.set("Content-Type", "application/json");
        return headers;
    }

});

// Auto refresh wrapper.
const baseQueryWithReauth: typeof baseQuery = async (args:any, api:any, extraOptions:any) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        // Try to get a new token and retry the original request.
        const refreshResult = await baseQuery({url:'/api/auth/refresh-token', method:'POST'}, api, extraOptions);
        if (!refreshResult?.error) {
            result = await baseQuery(args, api, extraOptions);
        }

}
    return result
}

type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'completed';
type BookingsListResponse = {
    data: Booking[];
    meta: { page: number; limit: number; total: number; totalPages: number };
};

type AdminStatsResponse = {
    totalUsers: number;
    totalProperties: number;
    totalBookings: number;
    pendingBookings: number;
};

type AdminRecentResponse = {
    properties: Property[];
    bookings: Booking[];
};

type AdminUsersResponse = {
    data: IUser[];
    meta: { page: number; limit: number; total: number; totalPages: number };
};

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Auth', 'User', 'Property', 'Booking', 'Admin'],
    
    endpoints : (builder) =>({
        getMe : builder.query<{user:IUser}, void>({
            query : () => ({
                url : '/api/users/me',
            }),
            providesTags: ['User', 'Auth'],
        }),
        
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/api/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['Auth', 'User'],
        }),

        signup: builder.mutation<SignupResponse, SignupData>({
            query : (body) => ({
                url : '/api/auth/signUp',
                method : 'POST',
                body
            }),
        }),

        login : builder.mutation<{ user: IUser }, {email:string, password:string}>({
            query : (body) => ({
                url : '/api/auth/signIn',
                method : 'POST',
                body
            }),
            invalidatesTags: ['Auth', 'User'],
        }),

        updateMe: builder.mutation<
            { user: IUser },
            Partial<{
                fullName: string;
                phone: string;
                dateOfBirth: string;
                avatar: string;
                address: { country?: string; city?: string; postalCode?: string };
            }>
        >({
            query: (body) => ({
                url: '/api/users/me',
                method: 'PUT',
                body
            }),
            invalidatesTags: ['User'],
        }),

        listProperties: builder.query<
            PropertiesListResponse,
            Partial<{
                village?: string;
                city?: string;
                state?: string;
                propertyType?: string;
                minPrice?: number;
                maxPrice?: number;
                amenities?: string[];
                isAvailable?: boolean;
                ownerId?: string;
                sortBy?: string;
                page?: number;
                limit?: number;
            }>
        >({
            query: (params) => {
                // Build params while removing undefined/null values.
                const qs: Record<string, any> = {};
                if (!params) return { url: '/api/properties' };
                Object.entries(params as any).forEach(([k, v]) => {
                    if (v !== undefined && v !== null) {
                        if (Array.isArray(v)) qs[k] = v.join(',');
                        else qs[k] = String(v);
                    }
                });
                return { url: '/api/properties', params: qs };
            },
            transformResponse: (response: any) => {
                if (Array.isArray(response)) return { data: response, meta: undefined };
                if (response && response.data) return response;
                if (response && response.docs) return { data: response.docs, meta: response.meta };
                return { data: [], meta: undefined };
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.data.map((r: any) => ({ type: 'Property' as const, id: r._id || r.id })),
                          { type: 'Property', id: 'LIST' },
                      ]
                    : [{ type: 'Property', id: 'LIST' }],
        }),

        getPropertyById: builder.query<Property, string>({
            query: (id) => ({ url: `/api/properties/${id}` }),
            transformResponse: (response: any) => response?.data ?? response,
            providesTags: (result, error, id) => [{ type: 'Property', id }],
        }),

        createProperty: builder.mutation<Property, Partial<Property>>({
            query: (body) => ({ url: '/api/properties', method: 'POST', body }),
            transformResponse: (response: any) => response?.data ?? response,
            invalidatesTags: [{ type: 'Property', id: 'LIST' }],
        }),

        updateProperty: builder.mutation<Property, { id: string; body: Partial<Property> }>({
            query: ({ id, body }) => ({ url: `/api/properties/${id}`, method: 'PUT', body }),
            transformResponse: (response: any) => response?.data ?? response,
            invalidatesTags: (result, error, { id }) => [{ type: 'Property', id }, { type: 'Property', id: 'LIST' }],
        }),

        deleteProperty: builder.mutation<void, string>({
            query: (id) => ({ url: `/api/properties/${id}`, method: 'DELETE' }),
            invalidatesTags: [{ type: 'Property', id: 'LIST' }],
        }),

        createBooking: builder.mutation<
            { data: Booking },
            { propertyId: string; startDate: string; endDate: string; message?: string }
        >({
            query: (body) => ({
                url: '/api/bookings',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Booking'],
        }),

        listBookings: builder.query<
            BookingsListResponse,
            Partial<{ page: number; limit: number; ownerId: string; renterId: string; status: string }>
        >({
            query: (params) => ({
                url: '/api/bookings',
                params,
            }),
            providesTags: ['Booking'],
        }),

        updateBookingStatus: builder.mutation<
            { data: Booking },
            { id: string; status: Exclude<BookingStatus, 'pending'> }
        >({
            query: ({ id, status }) => ({
                url: `/api/bookings/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Booking'],
        }),

        checkAvailability: builder.query<
            { available: boolean },
            { propertyId: string; startDate: string; endDate: string }
        >({
            query: ({ propertyId, startDate, endDate }) => ({
                url: `/api/properties/${propertyId}/availability`,
                params: { startDate, endDate },
            }),
        }),

        getAdminStats: builder.query<AdminStatsResponse, void>({
            query: () => ({ url: '/api/admin/stats' }),
            providesTags: ['Admin'],
        }),

        getAdminRecent: builder.query<AdminRecentResponse, void>({
            query: () => ({ url: '/api/admin/recent' }),
            providesTags: ['Admin'],
        }),

        listAdminUsers: builder.query<AdminUsersResponse, Partial<{ page: number; limit: number }>>({
            query: (params) => ({ url: '/api/admin/users', params }),
            providesTags: ['Admin', 'User'],
        }),

       
    }),
})
export const {
    useListPropertiesQuery,
    useGetPropertyByIdQuery,
    useCreatePropertyMutation,
    useUpdatePropertyMutation,
    useDeletePropertyMutation,
    useGetMeQuery,
    useLogoutMutation,
    useLoginMutation,
    useSignupMutation,
    useUpdateMeMutation,
    useCreateBookingMutation,
    useListBookingsQuery,
    useUpdateBookingStatusMutation,
    useCheckAvailabilityQuery,
    useGetAdminStatsQuery,
    useGetAdminRecentQuery,
    useListAdminUsersQuery,
} = api