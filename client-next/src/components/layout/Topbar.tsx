"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/store/api";
import type { IUser } from "@/types/user";

type TopbarProps = {
  title?: string;
  user?: IUser | null;
  onMenuClick?: () => void;
};

export default function Topbar({ title, user, onMenuClick }: TopbarProps) {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  const initials = useMemo(() => {
    const source = user?.fullName || user?.email || "U";
    const chunks = source.split(" ").filter(Boolean);
    if (chunks.length === 1) return chunks[0][0]?.toUpperCase() || "U";
    return `${chunks[0][0] || ""}${chunks[1][0] || ""}`.toUpperCase();
  }, [user?.email, user?.fullName]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Even if logout request fails, clear client flow by navigating to login.
    }
    router.replace("/auth/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-700 md:hidden"
            aria-label="Open menu"
          >
            Menu
          </button>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Digital Housing</p>
            <h1 className="text-base font-semibold text-slate-900 md:text-lg">{title || "Dashboard"}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-900">{user.fullName || "User"}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  {initials}
                </div>
              )}
              <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
                {isLoading ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => router.push("/auth/login")}>Sign in</Button>
          )}
        </div>
      </div>
    </header>
  );
}
