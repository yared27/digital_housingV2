"use client";

import SiteHeader from "@/components/common/SiteHeader";
import SiteFooter from "@/components/common/SiteFooter";
import PageSection from "@/components/common/PageSection";
import { MarketingPropertyCardSkeleton } from "@/components/common/LoadingSkeletons";
import Hero from "../components/marketing/Hero";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import HowItWorks from "@/components/marketing/HowItWorks";
import TestimonialGrid from "@/components/marketing/TestimonialGrid";
import CTASection from "../components/marketing/CTASection";
import MarketingPropertyCard from "@/components/marketing/PropertyCard";
import EmptyState from "@/components/ui/EmptyState";
import { useGetMeQuery, useListPropertiesQuery } from "@/store/api";


export default function LandingPage() {
  const { data: meData } = useGetMeQuery();
  const { data, isLoading, isError, refetch } = useListPropertiesQuery({
    sortBy: "newest",
    limit: 6,
    page: 1,
  });

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <SiteHeader />
      <Hero isAuthed={Boolean(meData?.user)} />

      <PageSection className="pb-8 sm:pb-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Security</p>
            <p className="mt-2 text-base font-semibold text-slate-900">Secure login</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Trust</p>
            <p className="mt-2 text-base font-semibold text-slate-900">Verified listings</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Booking</p>
            <p className="mt-2 text-base font-semibold text-slate-900">Fast request workflow</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Operations</p>
            <p className="mt-2 text-base font-semibold text-slate-900">Role-based dashboards</p>
          </div>
        </div>
      </PageSection>

      <FeatureGrid />
      <HowItWorks />

      <PageSection
        title="Featured properties"
        subtitle="Latest listings from the platform"
        className="py-16 sm:py-20"
      >
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MarketingPropertyCardSkeleton />
            <MarketingPropertyCardSkeleton />
            <MarketingPropertyCardSkeleton />
            <MarketingPropertyCardSkeleton />
            <MarketingPropertyCardSkeleton />
            <MarketingPropertyCardSkeleton />
          </div>
        ) : null}

        {isError ? (
          <EmptyState
            title="Could not load featured properties"
            description="Please retry to load latest listings."
            actionLabel="Retry"
            onAction={refetch}
          />
        ) : null}

        {!isLoading && !isError && (data?.data?.length || 0) === 0 ? (
          <EmptyState
            title="No featured properties yet"
            description="Listings will appear here as properties are published."
          />
        ) : null}

        {(data?.data?.length || 0) > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.data?.map((property) => (
              <MarketingPropertyCard key={property._id || property.id} property={property} />
            ))}
          </div>
        ) : null}
      </PageSection>

      <TestimonialGrid />
      <CTASection />
      <SiteFooter />
    </main>
  );
}