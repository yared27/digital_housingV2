"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/store/api";
import { getRoleRedirectPath } from "@/lib/authRedirect";

const navItems = [
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { data } = useGetMeQuery();
  const user = data?.user;
  const roleDashboardHref = getRoleRedirectPath(user?.role);
  const isRenter = user?.role === "renter";
  const primaryHref = isRenter ? "/bookings" : roleDashboardHref;
  const primaryLabel = isRenter ? "My Bookings" : "Dashboard";

  return (
    <header className="sticky top-0 z-40 border-b ui-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="ui-focus-ring inline-flex items-center gap-2 ui-text">
          <span className="ui-btn-primary inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold">DH</span>
          <span className="text-sm font-semibold sm:text-base">Digital Housing</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "ui-focus-ring rounded-md px-3 py-2 text-sm transition-colors",
                  isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isRenter ? (
                <Button asChild variant="ghost" className="hidden text-slate-700 hover:bg-slate-100 sm:inline-flex">
                  <Link href="/profile">Profile</Link>
                </Button>
              ) : null}

              <Button asChild className="ui-btn-primary">
                <Link href={primaryHref}>{primaryLabel}</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-slate-700 hover:bg-slate-100">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild className="ui-btn-primary">
                <Link href="/auth/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
