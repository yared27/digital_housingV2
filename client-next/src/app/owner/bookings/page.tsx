"use client";
import React, { useMemo, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import EmptyState from "@/components/ui/EmptyState";
import { TableRowsSkeleton } from "@/components/ui/Skeletons";
import { getDashboardRole } from "@/lib/dashboardNav";
import { useGetMeQuery, useListBookingsQuery, useUpdateBookingStatusMutation } from "@/store/api";

export default function OwnerBookingsPage() {
  return (
    <ProtectedRoute allowedRoles={["owner","admin"]}>
      <OwnerBookings />
    </ProtectedRoute>
  );
}

function OwnerBookings() {
  const { data: meData } = useGetMeQuery();
  const role = getDashboardRole(meData?.user);
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } = useListBookingsQuery({
    page,
    limit: 20,
    status: status || undefined,
  });
  const [updateStatus] = useUpdateBookingStatusMutation();
  const totalPages = Math.max(1, data?.meta?.totalPages || 1);

  const bookings = useMemo(() => {
    const startMs = dateFrom ? new Date(dateFrom).getTime() : null;
    const endMs = dateTo ? new Date(dateTo).getTime() : null;

    return (data?.data || [])
      .filter((booking) => {
        const bookingStart = new Date(booking.startDate).getTime();
        if (startMs && bookingStart < startMs) return false;
        if (endMs && bookingStart > endMs) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }, [data?.data, dateFrom, dateTo]);

  const handle = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status: status as any }).unwrap();
      refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to update booking");
    }
  };

  return (
    <AppShell role={role} user={meData?.user} title="Booking Requests">
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="declined">Declined</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
                onClick={() => {
                  setStatus("");
                  setDateFrom("");
                  setDateTo("");
                  setPage(1);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {isLoading ? <TableRowsSkeleton rows={6} /> : null}

        {isError ? (
          <EmptyState
            title="Could not load booking requests"
            description="Please retry shortly."
            actionLabel="Retry"
            onAction={refetch}
          />
        ) : null}

        {!isLoading && !isError && bookings.length === 0 ? (
          <EmptyState title="No booking requests" description="Requests will appear here as renters submit them." />
        ) : null}

        {bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const bookingId = booking._id || booking.id;
              const renter = typeof booking.renterId === "string" ? null : booking.renterId;
              const property = typeof booking.propertyId === "string" ? null : booking.propertyId;

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
                      <p className="mt-1 text-sm text-slate-500">
                        Renter: {renter?.fullName || renter?.email || String(booking.renterId).slice(0, 8)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "rounded-full px-2 py-1 text-xs font-medium",
                          booking.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : booking.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-700"
                            : booking.status === "declined"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-slate-100 text-slate-700",
                        ].join(" ")}
                      >
                        {booking.status || "unknown"}
                      </span>
                      {booking.status === "pending" ? (
                        <>
                          <button
                            className="rounded-md border border-emerald-300 px-3 py-1.5 text-sm text-emerald-700"
                            onClick={() => bookingId && handle(bookingId, "confirmed")}
                          >
                            Confirm
                          </button>
                          <button
                            className="rounded-md border border-rose-300 px-3 py-1.5 text-sm text-rose-700"
                            onClick={() => bookingId && handle(bookingId, "declined")}
                          >
                            Decline
                          </button>
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
