"use client";

import Link from "next/link";
import { User, Home, Wallet, Settings } from "lucide-react";

const Sidebar = () => {
  return (
    <nav className="sticky top-16 rounded-lg border bg-white p-3">
      <ul className="space-y-1 text-sm">
        <li>
          <Link href="/dashboard" className="flex items-center gap-2 rounded px-2 py-2 hover:bg-slate-50">
            <Home className="h-4 w-4" /> Dashboard
          </Link>
        </li>
        <li>
          <Link href="/profile" className="flex items-center gap-2 rounded bg-emerald-50 px-2 py-2 text-emerald-700">
            <User className="h-4 w-4" /> My Profile
          </Link>
        </li>
        <li>
          <Link href="/billing" className="flex items-center gap-2 rounded px-2 py-2 hover:bg-slate-50">
            <Wallet className="h-4 w-4" /> Billing
          </Link>
        </li>
        <li>
          <Link href="/settings" className="flex items-center gap-2 rounded px-2 py-2 hover:bg-slate-50">
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;