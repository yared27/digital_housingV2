"use client";
import React from "react";
import { useParams } from "next/navigation";
import SiteHeader from "@/components/common/SiteHeader";
import SiteFooter from "@/components/common/SiteFooter";
import PageSection from "@/components/common/PageSection";
import EmptyState from "@/components/ui/EmptyState";
import { TableRowsSkeleton } from "@/components/ui/Skeletons";
import { useGetPropertyByIdQuery } from "@/store/api";
import PropertyGallery from "@/components/properties/PropertyGallery";
import BookingWidget from "@/components/bookings/BookingWidget";

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data, isLoading, error } = useGetPropertyByIdQuery(id);

  const property = data;
  const location = [property?.village, property?.address?.city, property?.address?.state].filter(Boolean).join(", ");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <PageSection className="py-10 sm:py-12">
        {isLoading ? <TableRowsSkeleton rows={4} /> : null}
        {error ? <EmptyState title="Property not found" description="The requested property could not be loaded." /> : null}
        {property ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900">{property.title}</h1>
                <p className="mt-1 text-sm text-slate-500">{location || "Location not specified"}</p>
                <p className="mt-3 text-sm text-slate-700">{property.description}</p>

                <div className="mt-4">
                  <PropertyGallery images={property.propertyImages} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{property.propertyType || "type n/a"}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                    {property.price?.amount ? `$${property.price.amount}` : "Price n/a"} {property.price?.period || ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="xl:col-span-1">
              <BookingWidget propertyId={property._id || property.id || ''} />
            </div>
          </div>
        ) : null}
      </PageSection>
      <SiteFooter />
    </main>
  );
}
