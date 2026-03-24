"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardRole, getNavItemsForRole } from "@/lib/dashboardNav";

type SidebarProps = {
  role: DashboardRole;
  onNavigate?: () => void;
};

export default function Sidebar({ role, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const navItems = getNavItemsForRole(role);

  return (
    <aside className="h-full w-full border-r border-slate-200 bg-white">
      <div className="px-5 py-5">
        <p className="text-xs uppercase tracking-wide text-slate-500">Navigation</p>
      </div>
      <nav className="space-y-1 px-3 pb-4">
        {navItems.map((item) => {
          const isAdminOverview = item.href === "/admin";
          const isActive = isAdminOverview
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={[
                "block rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
