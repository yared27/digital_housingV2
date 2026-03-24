"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmptyState from "@/components/ui/EmptyState";
import { TableRowsSkeleton } from "@/components/ui/Skeletons";
import { getDashboardRole } from "@/lib/dashboardNav";
import { uploadWithSignature } from "@/lib/cloudinary";
import { useGetMeQuery } from "@/store/api";
import { useUpdateMeMutation } from "@/store/api";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data, isLoading, isError, refetch } = useGetMeQuery();
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (!data?.user) return;
    setFullName(data.user.fullName || "");
    setEmail(data.user.email || "");
    setPhone(data.user.phone || "");
    setDateOfBirth(data.user.dateOfBirth || "");
    setCountry(data.user.address?.country || "");
    setCity(data.user.address?.city || "");
    setPostalCode(data.user.address?.postalCode || "");
    setAvatar(data.user.avatar || "");
  }, [data?.user]);

  const onAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploaded = await uploadWithSignature(file);
      setAvatar(uploaded);
      await updateMe({ avatar: uploaded }).unwrap();
      refetch();
    } catch (error: any) {
      alert(error?.data?.message || "Avatar upload failed");
    }
  };

  const onSave = async () => {
    try {
      await updateMe({
        fullName,
        phone,
        dateOfBirth,
        avatar: avatar || undefined,
        address: {
          country: country || undefined,
          city: city || undefined,
          postalCode: postalCode || undefined,
        },
      }).unwrap();
      refetch();
      alert("Profile updated");
    } catch (error: any) {
      alert(error?.data?.message || "Could not update profile");
    }
  };

  return (
    <ProtectedRoute>
      <AppShell role={getDashboardRole(data?.user)} user={data?.user} title="My Profile">
        <div className="space-y-5">
          {isLoading ? <TableRowsSkeleton rows={5} /> : null}

          {isError ? (
            <EmptyState
              title="Could not load your profile"
              description="Please retry."
              actionLabel="Retry"
              onAction={refetch}
            />
          ) : null}

          {!isLoading && !isError ? (
            <>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Account</h2>
                <p className="text-sm text-slate-500">Manage your public profile and contact details.</p>

                <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center">
                  {avatar ? (
                    <img src={avatar} alt="avatar" className="h-20 w-20 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                      {(fullName || email || "U").slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="avatarUpload">Upload avatar</Label>
                    <Input id="avatarUpload" type="file" accept="image/*" onChange={onAvatarSelect} className="mt-2" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Personal Info</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={email} disabled />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Address</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={onSave} disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}