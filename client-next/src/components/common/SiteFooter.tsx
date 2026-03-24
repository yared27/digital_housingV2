"use client";

import Link from "next/link";
import { useGetMeQuery } from "@/store/api";
import { getRoleRedirectPath } from "@/lib/authRedirect";

export default function SiteFooter() {
  const { data } = useGetMeQuery();
  const user = data?.user;
  const roleDashboardHref = getRoleRedirectPath(user?.role);
  const isRenter = user?.role === "renter";

  return (
    <footer className="ui-surface ui-border border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="ui-text text-sm font-semibold">Digital Housing</p>
          <p className="ui-muted mt-2 max-w-sm text-sm">
            Discover verified listings, request bookings quickly, and manage rental workflows in one platform.
          </p>
        </div>

        <div className="ui-muted grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="ui-text font-medium">Platform</p>
            <ul className="mt-3 space-y-2">
              <li><Link href="/properties" className="ui-focus-ring hover:text-slate-900">Properties</Link></li>
              {user ? (
                <>
                  {!isRenter ? (
                    <li><Link href={roleDashboardHref} className="ui-focus-ring hover:text-slate-900">Dashboard</Link></li>
                  ) : null}
                  {isRenter ? (
                    <>
                      <li><Link href="/bookings" className="ui-focus-ring hover:text-slate-900">My Bookings</Link></li>
                      <li><Link href="/profile" className="ui-focus-ring hover:text-slate-900">Profile</Link></li>
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  <li><Link href="/auth/login" className="ui-focus-ring hover:text-slate-900">Sign in</Link></li>
                  <li><Link href="/auth/signup" className="ui-focus-ring hover:text-slate-900">Sign up</Link></li>
                </>
              )}
            </ul>
          </div>
          <div>
            <p className="ui-text font-medium">Company</p>
            <ul className="mt-3 space-y-2">
              <li><Link href="/about" className="ui-focus-ring hover:text-slate-900">About</Link></li>
              <li><Link href="/contact" className="ui-focus-ring hover:text-slate-900">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="ui-text font-medium">Follow</p>
            <ul className="mt-3 space-y-2">
              <li><a href="#" className="ui-focus-ring hover:text-slate-900">X</a></li>
              <li><a href="#" className="ui-focus-ring hover:text-slate-900">LinkedIn</a></li>
              <li><a href="#" className="ui-focus-ring hover:text-slate-900">GitHub</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="ui-border border-t">
        <div className="ui-muted mx-auto w-full max-w-6xl px-4 py-4 text-xs sm:px-6 lg:px-8">
          Copyright {new Date().getFullYear()} Digital Housing. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
