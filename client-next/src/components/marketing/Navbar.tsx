"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded bg-indigo-600" />
          <span className="text-lg font-semibold">Digital Housing</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm hover:text-indigo-600">Features</a>
          <a href="#how-it-works" className="text-sm hover:text-indigo-600">How it works</a>
          <a href="#testimonials" className="text-sm hover:text-indigo-600">Testimonials</a>
          <a href="#cta" className="text-sm hover:text-indigo-600">Get started</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="#cta">
            <Button>Get started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}