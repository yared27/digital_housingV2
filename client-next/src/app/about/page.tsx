import SiteHeader from "@/components/common/SiteHeader";
import SiteFooter from "@/components/common/SiteFooter";
import PageSection from "@/components/common/PageSection";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <PageSection
        className="py-12 sm:py-16"
        title="About Digital Housing"
        subtitle="Building trust-first rental experiences for renters, owners, and administrators."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Our mission</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              We simplify housing discovery and booking by combining verified listings, transparent workflows, and role-based operations in one modern platform.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">How we work</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              We focus on practical experiences: clear property data, secure authentication, and actionable dashboards that help users make decisions quickly.
            </p>
          </article>
        </div>
      </PageSection>

      <SiteFooter />
    </main>
  );
}
