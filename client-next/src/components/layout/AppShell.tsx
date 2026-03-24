"use client";

import { useState } from "react";
import type { IUser } from "@/types/user";
import { DashboardRole } from "@/lib/dashboardNav";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

type AppShellProps = {
  role: DashboardRole;
  user?: IUser | null;
  title?: string;
  children: React.ReactNode;
};

export default function AppShell({ role, user, title, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar title={title} user={user} onMenuClick={() => setMobileOpen((prev) => !prev)} />

      <div className="mx-auto flex max-w-[1440px]">
        <div className="hidden w-64 shrink-0 md:block">
          <Sidebar role={role} />
        </div>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
            <button
              type="button"
              className="absolute inset-0 bg-black/30"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
              <Sidebar role={role} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        ) : null}

        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
