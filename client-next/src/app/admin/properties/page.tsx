"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import EmptyState from "@/components/ui/EmptyState";
import { CardsGridSkeleton } from "@/components/ui/Skeletons";
import PropertyCard from "@/components/properties/PropertyCard";
import { useDeletePropertyMutation, useGetMeQuery, useListPropertiesQuery } from "@/store/api";
import { useState } from "react";

function AdminPropertiesContent() {
  const { data: meData } = useGetMeQuery();
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching, refetch } = useListPropertiesQuery({
    page,
    limit: 12,
    city: city || undefined,
    state: state || undefined,
    sortBy: "newest",
  });
  const [deleteProperty] = useDeletePropertyMutation();
  const totalPages = Math.max(1, data?.meta?.totalPages || 1);

  const onDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this property?")) return;
    try {
      await deleteProperty(id).unwrap();
      refetch();
    } catch (error: any) {
      alert(error?.data?.message || "Delete failed");
    }
  };

  return (
    <AppShell role="admin" user={meData?.user} title="Admin Properties">
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              placeholder="Filter by city"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm"
            />
            <input
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setPage(1);
              }}
              placeholder="Filter by state"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm"
            />
            <button
              className="h-10 rounded-md border border-slate-300 px-3 text-sm"
              onClick={() => {
                setCity("");
                setState("");
                setPage(1);
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {isLoading ? <CardsGridSkeleton cards={6} /> : null}

        {isError ? <EmptyState title="Failed to load properties" description="Retry to continue." actionLabel="Retry" onAction={refetch} /> : null}

        {!isLoading && !isError && (data?.data?.length || 0) === 0 ? (
          <EmptyState title="No properties" description="No properties match current filters." />
        ) : null}

        {(data?.data?.length || 0) > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data?.data?.map((property) => {
              const id = property._id || property.id;
              return (
                <div key={id} className="space-y-2">
                  <PropertyCard property={property} />
                  <div className="rounded-md border border-slate-200 bg-white p-2 text-xs text-slate-600">
                    <p>Owner ID: {String(property.ownerId || "n/a")}</p>
                    <p>Verified: {property.isVerified ? "Yes" : "No"}</p>
                  </div>
                  <button className="rounded-md border border-rose-300 px-3 py-1.5 text-sm text-rose-700" onClick={() => onDelete(id)}>
                    Delete Property
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
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
      </div>
    </AppShell>
  );
}

export default function AdminPropertiesPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminPropertiesContent />
    </ProtectedRoute>
  );
}
