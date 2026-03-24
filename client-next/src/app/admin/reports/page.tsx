"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import EmptyState from "@/components/ui/EmptyState";
import { useGetMeQuery } from "@/store/api";

function AdminReportsContent() {
  const { data: meData } = useGetMeQuery();

  return (
    <AppShell role="admin" user={meData?.user} title="Admin Reports">
      <EmptyState
        title="Reports are not implemented yet"
        description="This placeholder is available in navigation for future moderation/report workflows."
      />
    </AppShell>
  );
}

export default function AdminReportsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminReportsContent />
    </ProtectedRoute>
  );
}
