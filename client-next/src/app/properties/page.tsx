"use client";

import { useMemo, useState } from "react";
import SiteHeader from "@/components/common/SiteHeader";
import SiteFooter from "@/components/common/SiteFooter";
import PageSection from "@/components/common/PageSection";
import { MarketingPropertyCardSkeleton } from "@/components/common/LoadingSkeletons";
import MarketingPropertyCard from "@/components/marketing/PropertyCard";
import EmptyState from "@/components/ui/EmptyState";
import { useListPropertiesQuery } from "@/store/api";

type PublicFilterState = {
  city: string;
  state: string;
  village: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  amenities: string;
  sortBy: "newest" | "price_asc" | "price_desc";
};

const initialFilters: PublicFilterState = {
  city: "",
  state: "",
  village: "",
  propertyType: "",
  minPrice: "",
  maxPrice: "",
  amenities: "",
  sortBy: "newest",
};

export default function PublicPropertiesPage() {
  const [filters, setFilters] = useState<PublicFilterState>(initialFilters);
  const [page, setPage] = useState(1);

  const query = useMemo(() => {
    const amenities = filters.amenities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    return {
      page,
      limit: 12,
      sortBy: filters.sortBy,
      city: filters.city || undefined,
      state: filters.state || undefined,
      village: filters.village || undefined,
      propertyType: filters.propertyType || undefined,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      amenities: amenities.length ? amenities : undefined,
    };
  }, [filters, page]);

  const { data, isLoading, isError, isFetching, refetch } = useListPropertiesQuery(query);
  const totalPages = Math.max(1, data?.meta?.totalPages || 1);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <PageSection
        className="py-10 sm:py-12"
        title="Browse properties"
        subtitle="Discover listings by location, type, amenities, and budget."
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <input
              value={filters.city}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, city: e.target.value }));
                setPage(1);
              }}
              placeholder="City"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            />
            <input
              value={filters.state}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, state: e.target.value }));
                setPage(1);
              }}
              placeholder="State"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            />
            <input
              value={filters.village}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, village: e.target.value }));
                setPage(1);
              }}
              placeholder="Village"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            />
            <select
              value={filters.propertyType}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, propertyType: e.target.value }));
                setPage(1);
              }}
              className="h-10 rounded-md border border-slate-300 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <option value="">All property types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="room">Room</option>
              <option value="studio">Studio</option>
            </select>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, minPrice: e.target.value }));
                setPage(1);
              }}
              placeholder="Min price"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, maxPrice: e.target.value }));
                setPage(1);
              }}
              placeholder="Max price"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            />
            <input
              value={filters.amenities}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, amenities: e.target.value }));
                setPage(1);
              }}
              placeholder="Amenities: wifi, parking"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            />
            <select
              value={filters.sortBy}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, sortBy: e.target.value as PublicFilterState["sortBy"] }));
                setPage(1);
              }}
              className="h-10 rounded-md border border-slate-300 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
              onClick={() => {
                setFilters(initialFilters);
                setPage(1);
              }}
            >
              Clear filters
            </button>
            <button
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="mt-6">
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
              title="Unable to load properties"
              description="Please check your connection and retry."
              actionLabel="Retry"
              onAction={refetch}
            />
          ) : null}

          {!isLoading && !isError && (data?.data?.length || 0) === 0 ? (
            <EmptyState
              title="No properties found"
              description="Try changing your filters to broaden your search."
              actionLabel="Clear filters"
              onAction={() => {
                setFilters(initialFilters);
                setPage(1);
              }}
            />
          ) : null}

          {(data?.data?.length || 0) > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data?.data?.map((property) => (
                <MarketingPropertyCard key={property._id || property.id} property={property} />
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <p>
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-50"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1 || isFetching}
            >
              Previous
            </button>
            <button
              className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-50"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages || isFetching}
            >
              Next
            </button>
          </div>
        </div>
      </PageSection>

      <SiteFooter />
    </main>
  );
}
