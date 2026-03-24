"use client";
import React, { useMemo, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import EmptyState from "@/components/ui/EmptyState";
import StatCard from "@/components/ui/StatCard";
import { CardsGridSkeleton, StatCardSkeleton } from "@/components/ui/Skeletons";
import {
  useCreatePropertyMutation,
  useDeletePropertyMutation,
  useGetMeQuery,
  useListBookingsQuery,
  useListPropertiesQuery,
  useUpdatePropertyMutation,
} from "@/store/api";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyForm from "@/components/owner/PropertyForm";
import { getDashboardRole } from "@/lib/dashboardNav";

export default function OwnerPropertiesPage() {
  return (
    <ProtectedRoute allowedRoles={["owner","admin"]}>
      <OwnerProperties />
    </ProtectedRoute>
  );
}

function OwnerProperties() {
  const { data: me, isLoading: isLoadingMe } = useGetMeQuery();
  const userId = me?.user?._id || me?.user?.id || "";
  const role = getDashboardRole(me?.user);

  const { data, isLoading, isError, refetch } = useListPropertiesQuery({ ownerId: role === "owner" ? userId : undefined, limit: 50 });
  const { data: pendingBookings } = useListBookingsQuery({ status: "pending", page: 1, limit: 100 });
  const [createProperty] = useCreatePropertyMutation();
  const [updateProperty] = useUpdatePropertyMutation();
  const [deleteProperty] = useDeletePropertyMutation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  const myProps = useMemo(
    () =>
      (data?.data || []).filter((property) =>
        role === "admin" ? true : String(property.ownerId) === String(userId)
      ),
    [data?.data, role, userId]
  );

  const stats = useMemo(() => {
    const total = myProps.length;
    const available = myProps.filter((property) => property.isAvailable).length;
    const verified = myProps.filter((property) => property.isVerified).length;
    const pending = (pendingBookings?.data || []).filter((booking) => booking.status === "pending").length;
    return { total, available, verified, pending };
  }, [myProps, pendingBookings?.data]);

  const editingProperty = myProps.find((item) => (item._id || item.id) === editingPropertyId);

  const handleCreate = async (payload: any) => {
    await createProperty(payload).unwrap();
    setShowCreateForm(false);
    refetch();
  };

  const handleUpdate = async (payload: any) => {
    if (!editingPropertyId) return;
    await updateProperty({ id: editingPropertyId, body: payload }).unwrap();
    setEditingPropertyId(null);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this property?')) return;
    await deleteProperty(id).unwrap();
    refetch();
  };

  return (
    <AppShell role={role} user={me?.user} title="My Properties">
      <div className="space-y-5">
        {isLoading || isLoadingMe ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Properties" value={stats.total} />
            <StatCard label="Available" value={stats.available} />
            <StatCard label="Verified" value={stats.verified} />
            <StatCard label="Pending Bookings" value={stats.pending} />
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Manage Properties</h2>
              <p className="text-sm text-slate-500">Create listings, update details, and manage availability.</p>
            </div>
            <button
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              onClick={() => {
                setShowCreateForm((prev) => !prev);
                setEditingPropertyId(null);
              }}
            >
              {showCreateForm ? "Close Form" : "Create Property"}
            </button>
          </div>
        </div>

        {showCreateForm ? (
          <PropertyForm mode="create" onSubmit={handleCreate} canVerify={role === "admin"} />
        ) : null}

        {editingProperty ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Edit Property</h3>
              <button className="text-sm text-slate-600" onClick={() => setEditingPropertyId(null)}>
                Cancel
              </button>
            </div>
            <PropertyForm initial={editingProperty} mode="edit" onSubmit={handleUpdate} canVerify={role === "admin"} />
          </div>
        ) : null}

        {isLoading ? <CardsGridSkeleton cards={6} /> : null}

        {isError ? (
          <EmptyState
            title="Could not load properties"
            description="Please retry."
            actionLabel="Retry"
            onAction={refetch}
          />
        ) : null}

        {!isLoading && !isError && myProps.length === 0 ? (
          <EmptyState
            title="No properties yet"
            description="Create your first property to start receiving booking requests."
            actionLabel="Create property"
            onAction={() => setShowCreateForm(true)}
          />
        ) : null}

        {myProps.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {myProps.map((property) => {
              const propertyId = property._id || property.id;
              return (
                <div key={propertyId} className="space-y-2">
                  <PropertyCard property={property} />
                  <div className="flex gap-2">
                    <button
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                      onClick={() => setEditingPropertyId(propertyId || null)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-md border border-rose-300 px-3 py-1.5 text-sm text-rose-700"
                      onClick={() => propertyId && handleDelete(propertyId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
