"use client";

import { useMemo, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import EmptyState from "@/components/ui/EmptyState";
import { TableRowsSkeleton } from "@/components/ui/Skeletons";
import { useGetMeQuery, useListBookingsQuery, useUpdateBookingStatusMutation } from "@/store/api";

function BookingsContent() {
  const { data: meData } = useGetMeQuery();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const { data, isLoading, isFetching, isError, refetch } = useListBookingsQuery({
    page,
    limit: 12,
    status: status || undefined,
  });

  const totalPages = Math.max(1, data?.meta?.totalPages || 1);

  const rows = useMemo(() => data?.data || [], [data?.data]);

  const handleCancel = async (id?: string) => {
    if (!id) return;
    try {
      await updateStatus({ id, status: "cancelled" }).unwrap();
      refetch();
    } catch (error: any) {
      alert(error?.data?.message || "Could not cancel booking");
    }
  };

  return (
    <AppShell role="renter" user={meData?.user} title="My Bookings">
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Bookings</h2>
              <p className="text-sm text-slate-500">Track your booking requests and updates.</p>
            </div>
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

        {isLoading ? <TableRowsSkeleton rows={6} /> : null}

        {isError ? (
          <EmptyState
            title="Could not load bookings"
            description="Try again in a moment."
            actionLabel="Retry"
            onAction={refetch}
          />
        ) : null}

        {!isLoading && !isError && rows.length === 0 ? (
          <EmptyState
            title="No bookings yet"
            description="When you request a booking, it will appear here."
          />
        ) : null}

        {rows.length > 0 ? (
          <div className="space-y-3">
            {rows.map((booking) => {
              const bookingId = booking._id || booking.id;
              const property = typeof booking.propertyId === "string" ? null : booking.propertyId;
              const canCancel = booking.status === "pending" || booking.status === "confirmed";

              return (
                <div key={bookingId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {property?.title || `Property ${String(booking.propertyId).slice(0, 8)}`}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">Total: {booking.totalPrice ? `$${booking.totalPrice}` : "N/A"}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "rounded-full px-2 py-1 text-xs font-medium",
                          booking.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-700"
                            : booking.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : booking.status === "declined"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-slate-100 text-slate-700",
                        ].join(" ")}
                      >
                        {booking.status || "unknown"}
                      </span>
                      {canCancel ? (
                        <button
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
                          onClick={() => handleCancel(bookingId)}
                          disabled={isUpdating}
                        >
                          Cancel
                        </button>
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

export default function BookingsPage() {
  return (
    <ProtectedRoute allowedRoles={["renter"]}>
      <BookingsContent />
    </ProtectedRoute>
  );
}
