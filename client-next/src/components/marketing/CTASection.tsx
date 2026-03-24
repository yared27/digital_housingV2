import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageSection from "@/components/common/PageSection";

export default function CTASection() {
  return (
    <PageSection className="py-16 sm:py-20">
      <div className="ui-btn-primary rounded-2xl px-6 py-10 sm:px-10 sm:py-12">
        <p className="text-sm text-slate-300">Ready to start?</p>
        <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Join Digital Housing today</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          Browse available properties as a renter, or list and manage your properties as an owner.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
            <Link href="/auth/signup">Get started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-slate-500 text-slate-100 hover:bg-slate-800">
            <Link href="/owner/properties">List your property</Link>
          </Button>
        </div>
      </div>
    </PageSection>
  );
}
