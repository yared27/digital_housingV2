"use client";

import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded bg-emerald-600" />
          <span className="font-semibold text-slate-800">Digital Housing</span>
        </div>
        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              placeholder="Search"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative rounded-full p-2 hover:bg-slate-100">
            <Bell className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
}