"use client";

import { useState } from "react";
import { useUpdateMeMutation } from "@/store/api";

type Props = {
  user?: any;
  loading?: boolean;
};

export default function PersonalInfoCard({ user, loading }: Props) {
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState<string>(() => user?.fullName?.split(" ")[0] ?? "");
  const [lastName, setLastName] = useState<string>(() => user?.fullName?.split(" ").slice(1).join(" ") ?? "");
  const [email, setEmail] = useState<string>(() => user?.email ?? "");
  const [phone, setPhone] = useState<string>(() => user?.phone ?? "");
  const [dateOfBirth, setDateOfBirth] = useState<string>(() => user?.dateOfBirth ?? "");

  const [updateMe, { isLoading: saving }] = useUpdateMeMutation();

  const onSave = async () => {
    const name = [firstName, lastName].filter(Boolean).join(" ");
    await updateMe({ name }).unwrap();
    setEditing(false);
  };

  if (loading) return <div className="h-48 animate-pulse rounded-xl bg-slate-100" />;

  return (
    <section className="rounded-xl border bg-white">
      <div className="flex items-center justify-between border-b px-4 py-3 md:px-6">
        <h2 className="text-base font-semibold text-slate-800">Personal Information</h2>
        <button
          onClick={() => (editing ? onSave() : setEditing(true))}
          disabled={saving}
          className="rounded bg-amber-500 px-3 py-1 text-sm text-white disabled:opacity-60"
        >
          {editing ? (saving ? "Saving..." : "Save") : "Edit"}
        </button>
      </div>

      <div className="grid gap-4 px-4 py-4 md:grid-cols-3 md:gap-6 md:px-6">
        <Field label="First Name" editing={editing}>
          <input
            className="w-full rounded border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={!editing}
          />
        </Field>

        <Field label="Last Name" editing={editing}>
          <input
            className="w-full rounded border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={!editing}
          />
        </Field>

        <Field label="Date of Birth" editing={editing}>
          <input
            type="date"
            className="w-full rounded border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            disabled={!editing}
          />
        </Field>

        <Field label="Email Address" editing={false}>
          <input className="w-full cursor-not-allowed rounded border border-slate-200 bg-slate-50 p-2 text-sm" value={email} disabled />
        </Field>

        <Field label="Phone Number" editing={editing}>
          <input
            className="w-full rounded border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!editing}
          />
        </Field>

        <Field label="User Role" editing={false}>
          <input
            className="w-full cursor-not-allowed rounded border border-slate-200 bg-slate-50 p-2 text-sm"
            value={user?.role ?? ""}
            disabled
          />
        </Field>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  editing,
}: {
  label: string;
  children: React.ReactNode;
  editing: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
      {children}
      {!editing && typeof children === "string" && (
        <p className="rounded border border-slate-200 bg-slate-50 p-2 text-sm">{children}</p>
      )}
    </div>
  );
}