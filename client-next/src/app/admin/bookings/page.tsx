"use client";

import { useMemo, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import EmptyState from "@/components/ui/EmptyState";
import { TableRowsSkeleton } from "@/components/ui/Skeletons";
import { useGetMeQuery, useListBookingsQuery, useUpdateBookingStatusMutation } from "@/store/api";

function AdminBookingsContent() {
  const { data: meData } = useGetMeQuery();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, refetch } = useListBookingsQuery({
    page,
    limit: 20,
    status: status || undefined,
  });
  const [updateStatus] = useUpdateBookingStatusMutation();
  const totalPages = Math.max(1, data?.meta?.totalPages || 1);

  const bookings = useMemo(() => data?.data || [], [data?.data]);

  const onStatusChange = async (id: string, next: "confirmed" | "declined" | "cancelled" | "completed") => {
    try {
      await updateStatus({ id, status: next }).unwrap();
      refetch();
    } catch (error: any) {
      alert(error?.data?.message || "Could not update status");
    }
  };

  return (
    <AppShell role="admin" user={meData?.user} title="Admin Bookings">
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-600">Manage and review booking lifecycle.</p>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-md border border-slate-300 px-3 text-sm"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="declined">Declined</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {isLoading ? <TableRowsSkeleton rows={8} /> : null}

        {isError ? <EmptyState title="Failed to load bookings" description="Retry to continue." actionLabel="Retry" onAction={refetch} /> : null}

        {!isLoading && !isError && bookings.length === 0 ? <EmptyState title="No bookings" description="No results for current status filter." /> : null}

        {bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const id = booking._id || booking.id;
              const renter = typeof booking.renterId === "string" ? null : booking.renterId;
              const owner = typeof booking.ownerId === "string" ? null : booking.ownerId;
              const property = typeof booking.propertyId === "string" ? null : booking.propertyId;

              return (
                <div key={id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{property?.title || `Property ${String(booking.propertyId).slice(0, 8)}`}</p>
                      <p className="text-sm text-slate-500">Renter: {renter?.fullName || renter?.email || String(booking.renterId).slice(0, 8)}</p>
                      <p className="text-sm text-slate-500">Owner: {owner?.fullName || owner?.email || String(booking.ownerId).slice(0, 8)}</p>
                      <p className="text-sm text-slate-500">{new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{booking.status || "unknown"}</span>
                      {id ? (
                        <>
                          <button className="rounded-md border border-emerald-300 px-3 py-1.5 text-xs text-emerald-700" onClick={() => onStatusChange(id, "confirmed")}>Confirm</button>
                          <button className="rounded-md border border-rose-300 px-3 py-1.5 text-xs text-rose-700" onClick={() => onStatusChange(id, "declined")}>Decline</button>
                          <button className="rounded-md border border-slate-300 px-3 py-1.5 text-xs" onClick={() => onStatusChange(id, "cancelled")}>Cancel</button>
                          <button className="rounded-md border border-indigo-300 px-3 py-1.5 text-xs text-indigo-700" onClick={() => onStatusChange(id, "completed")}>Complete</button>
                        </>
                      ) : null}
                    </div>
                  </div>
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

export default function AdminBookingsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminBookingsContent />
    </ProtectedRoute>
  );
}
