"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import EmptyState from "@/components/ui/EmptyState";
import StatCard from "@/components/ui/StatCard";
import { StatCardSkeleton, TableRowsSkeleton } from "@/components/ui/Skeletons";
import { useGetAdminRecentQuery, useGetAdminStatsQuery, useGetMeQuery } from "@/store/api";

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminOverview />
    </ProtectedRoute>
  );
}

function AdminOverview() {
  const { data: meData } = useGetMeQuery();
  const { data: stats, isLoading: isLoadingStats, isError: isStatsError, refetch: refetchStats } = useGetAdminStatsQuery();
  const { data: recent, isLoading: isLoadingRecent, isError: isRecentError, refetch: refetchRecent } = useGetAdminRecentQuery();

  return (
    <AppShell role="admin" user={meData?.user} title="Admin Overview">
      <div className="space-y-5">
        {isLoadingStats ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : isStatsError ? (
          <EmptyState title="Failed to load stats" description="Retry to fetch admin metrics." actionLabel="Retry" onAction={refetchStats} />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Users" value={stats?.totalUsers || 0} />
            <StatCard label="Total Properties" value={stats?.totalProperties || 0} />
            <StatCard label="Total Bookings" value={stats?.totalBookings || 0} />
            <StatCard label="Pending Bookings" value={stats?.pendingBookings || 0} />
          </div>
        )}

        {isLoadingRecent ? (
          <TableRowsSkeleton rows={8} />
        ) : isRecentError ? (
          <EmptyState title="Failed to load recent activity" description="Retry to refresh latest properties and bookings." actionLabel="Retry" onAction={refetchRecent} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Latest Properties</h2>
              <div className="mt-3 space-y-2">
                {(recent?.properties || []).map((property) => (
                  <div key={property._id || property.id} className="rounded-lg border border-slate-100 p-3">
                    <p className="text-sm font-medium text-slate-900">{property.title}</p>
                    <p className="text-xs text-slate-500">
                      {[property.village, property.address?.city, property.address?.state].filter(Boolean).join(", ")}
                    </p>
                  </div>
                ))}
                {(recent?.properties || []).length === 0 ? <p className="text-sm text-slate-500">No recent properties.</p> : null}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Latest Bookings</h2>
              <div className="mt-3 space-y-2">
                {(recent?.bookings || []).map((booking) => {
                  const bookingId = booking._id || booking.id;
                  const property = typeof booking.propertyId === "string" ? null : booking.propertyId;
                  const renter = typeof booking.renterId === "string" ? null : booking.renterId;

                  return (
                    <div key={bookingId} className="rounded-lg border border-slate-100 p-3">
                      <p className="text-sm font-medium text-slate-900">{property?.title || String(booking.propertyId).slice(0, 8)}</p>
                      <p className="text-xs text-slate-500">Renter: {renter?.fullName || renter?.email || String(booking.renterId).slice(0, 8)}</p>
                      <p className="text-xs text-slate-500">Status: {booking.status || "unknown"}</p>
                    </div>
                  );
                })}
                {(recent?.bookings || []).length === 0 ? <p className="text-sm text-slate-500">No recent bookings.</p> : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}