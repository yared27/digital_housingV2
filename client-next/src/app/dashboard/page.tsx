"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/store/api";
import { getRoleRedirectPath } from "@/lib/authRedirect";

export default function DashboardPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMeQuery();

  useEffect(() => {
    if (isLoading) return;

    if (isError || !data?.user) {
      router.replace("/auth/login");
      return;
    }

    router.replace(getRoleRedirectPath(data.user.role));
  }, [data, isError, isLoading, router]);

  return <div className="p-6 text-sm text-gray-600">Loading dashboard...</div>;
}