"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import EmptyState from "@/components/ui/EmptyState";
import { TableRowsSkeleton } from "@/components/ui/Skeletons";
import { useGetMeQuery, useListAdminUsersQuery } from "@/store/api";

function AdminUsersContent() {
  const { data: meData } = useGetMeQuery();
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, refetch } = useListAdminUsersQuery({ page, limit: 20 });
  const users = data?.data || [];
  const totalPages = Math.max(1, data?.meta?.totalPages || 1);

  return (
    <AppShell role="admin" user={meData?.user} title="Admin Users">
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Users</h2>
          <p className="text-sm text-slate-500">Read-only user listing for MVP admin dashboard.</p>
        </div>

        {isLoading ? <TableRowsSkeleton rows={8} /> : null}

        {isError ? <EmptyState title="Failed to load users" description="Retry to continue." actionLabel="Retry" onAction={refetch} /> : null}

        {!isLoading && !isError && users.length === 0 ? <EmptyState title="No users" description="No users available." /> : null}

        {users.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Account Verified</th>
                    <th className="px-4 py-3">Identity Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id || user.id || user.email} className="border-t border-slate-100">
                      <td className="px-4 py-3 text-slate-900">{user.fullName}</td>
                      <td className="px-4 py-3 text-slate-600">{user.email}</td>
                      <td className="px-4 py-3 text-slate-600">{user.role}</td>
                      <td className="px-4 py-3 text-slate-600">{user.isAccountVerified ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-slate-600">{user.isUserIdentityVerified ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminUsersContent />
    </ProtectedRoute>
  );
}
