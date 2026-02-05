'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/store/api";

export default function ProtectedRoute({ children, redirectTo = "/auth/login", allowedRoles, }: { children: React.ReactNode, redirectTo?: string;  allowedRoles?: Array<'renter' | 'owner' | 'admin'> }) {
    
    const router = useRouter();
    const { data:user, isLoading, isError } = useGetMeQuery();

    useEffect(() => {
        if (!isLoading) {
            console.debug('ProtectedRoute user data', user);
            if (isError || !user?.user) {
                router.replace(redirectTo);

            }
        }}, [isLoading, isError, user, router, redirectTo]);
        if (isLoading) return <div className="p-6 text-sm  text-gray-600">Checking your session...</div>
        if (isError || !user?.user) return null;
        if (allowedRoles && !allowedRoles.includes(user.user.role)) {
            return <div className="p-6 text-sm text-red-600">Access denied</div>

        }
        return <>{children}</>

}