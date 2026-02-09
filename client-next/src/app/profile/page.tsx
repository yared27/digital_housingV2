"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useGetMeQuery } from "@/store/api";
import Sidebar from "@/components/profile/SideBar";
import Topbar from "@/components/profile/TopBar";
import ProfileSummary from "@/components/profile/ProfileSummary";
import PersonalInfoCard from "@/components/profile/PersonalInfoCard";
import AddressCard from "@/components/profile/AddressCard";

export default function ProfilePage() {
  const { data, isLoading } = useGetMeQuery();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Topbar />
        <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-6">
          <aside className="hidden w-64 md:block">
            <Sidebar />
          </aside>
          <main className="flex-1">
            <h1 className="mb-4 text-2xl font-semibold text-slate-800">My Profile</h1>

            <div className="space-y-6">
              <ProfileSummary currentUrl={data?.user?.avatar} user={data?.user} />
              <PersonalInfoCard user={data?.user} loading={isLoading} />
              <AddressCard user={data?.user} loading={isLoading} />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}