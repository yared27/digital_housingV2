"use client";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/store/api";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";

export default function Topbar() {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      router.replace("/auth/login");
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-sm">
            DH
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">Digital Housing</p>
            <p className="text-xs text-slate-500">Profile Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full border border-slate-200 bg-white hover:bg-slate-50"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
          </Button>

          <Button
            onClick={handleLogout}
            disabled={isLoading}
            className="rounded-full bg-emerald-600 px-5 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
}