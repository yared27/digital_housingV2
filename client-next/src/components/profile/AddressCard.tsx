"use client";

import { useEffect, useState } from "react";
import { useUpdateMeMutation } from "@/store/api";

type Props = {
  user?: any;
  loading?: boolean;
};

export default function AddressCard({ user, loading }: Props) {
  const [editing, setEditing] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [updateMe, { isLoading: saving }] = useUpdateMeMutation();

  useEffect(() => {
    setCountry(user?.address?.country ?? user?.location?.country ?? "");
    setCity(user?.address?.city ?? user?.location?.city ?? "");
    setPostalCode(user?.address?.postalCode ?? "");
  }, [user]);

  const onSave = async () => {
    await updateMe({
      address: {
        country,
        city,
        postalCode,
      },
    }).unwrap();
    setEditing(false);
  };

  if (loading) return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;

  return (
    <section className="rounded-xl border bg-white">
      <div className="flex items-center justify-between border-b px-4 py-3 md:px-6">
        <h2 className="text-base font-semibold text-slate-800">Address</h2>
        <button
          onClick={() => (editing ? onSave() : setEditing(true))}
          disabled={saving}
          className="rounded bg-amber-500 px-3 py-1 text-sm text-white disabled:opacity-60"
        >
          {editing ? (saving ? "Saving..." : "Save") : "Edit"}
        </button>
      </div>

      <div className="grid gap-4 px-4 py-4 md:grid-cols-3 md:gap-6 md:px-6">
        <Field label="Country" value={country} setValue={setCountry} editing={editing} />
        <Field label="City" value={city} setValue={setCity} editing={editing} />
        <Field label="Postal Code" value={postalCode} setValue={setPostalCode} editing={editing} />
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  setValue,
  editing,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  editing: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
      <input
        className={`w-full rounded border border-slate-200 p-2 text-sm outline-none ${
          editing ? "focus:border-emerald-500" : "bg-slate-50"
        }`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!editing}
      />
    </div>
  );
}