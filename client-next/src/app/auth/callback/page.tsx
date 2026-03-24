"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/store/api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data, isLoading } = useGetMeQuery();

  useEffect(() => {
    if (isLoading) return;

    if (data?.user) {
      router.replace("/dashboard");
      return;
    }

    router.replace("/auth/login");
  }, [data, isLoading, router]);

  return <div className="p-6 text-sm text-gray-600">Signing you in...</div>;
}