import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageSection from "@/components/common/PageSection";

type HeroProps = {
  isAuthed?: boolean;
};

export default function Hero({ isAuthed }: HeroProps) {
  return (
    <PageSection className="bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="inline-flex rounded-full border ui-border bg-slate-100 px-3 py-1 text-xs font-medium ui-muted">
            Trusted rental workflows for renters and owners
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Find verified homes and book with confidence.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Digital Housing helps renters discover quality properties and lets owners manage listings, bookings, and profile trust signals in one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="ui-btn-primary">
              <Link href="/properties">Browse Properties</Link>
            </Button>
            {isAuthed ? (
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/login">Sign in</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500">Secure auth</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Cookie-based sessions</p>
            <p className="mt-2 text-sm text-slate-600">Reliable authentication with role-aware access.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500">Verified listings</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Quality properties</p>
            <p className="mt-2 text-sm text-slate-600">Browse trustworthy property details and media.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
            <p className="text-xs text-slate-500">Fast booking flow</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Request booking, track status, move in faster</p>
            <p className="mt-2 text-sm text-slate-600">From browse to confirmation with clear states and updates.</p>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
