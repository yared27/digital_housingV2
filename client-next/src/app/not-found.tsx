import Link from "next/link";
import SiteHeader from "@/components/common/SiteHeader";
import SiteFooter from "@/components/common/SiteFooter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <section className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">404</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Page not found</h1>
          <p className="mt-3 text-sm text-slate-600">The page you requested does not exist or may have moved.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-slate-900 text-white hover:bg-slate-800">
              <Link href="/">Go home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/properties">Browse properties</Link>
            </Button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
