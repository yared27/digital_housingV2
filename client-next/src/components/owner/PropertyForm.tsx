"use client";
import React, { useState } from "react";
import { Property } from "@/types/property";
import { uploadWithSignature } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PropertyPayload = {
  title: string;
  description: string;
  village: string;
  address: {
    street?: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  price: {
    amount: number;
    period: "daily" | "weekly" | "monthly" | "yearly";
  };
  propertyType: "apartment" | "house" | "room" | "studio";
  amenities: string[];
  propertyImages: string[];
  isAvailable: boolean;
  isVerified?: boolean;
};

type PropertyFormProps = {
  onSubmit: (data: PropertyPayload) => Promise<void>;
  initial?: Partial<Property>;
  mode?: "create" | "edit";
  canVerify?: boolean;
};

const defaultForm = {
  title: "",
  description: "",
  village: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  amount: "",
  period: "monthly" as "daily" | "weekly" | "monthly" | "yearly",
  propertyType: "apartment" as "apartment" | "house" | "room" | "studio",
  amenities: "",
  isAvailable: true,
  isVerified: false,
};

export default function PropertyForm({ onSubmit, initial, mode = "create", canVerify = false }: PropertyFormProps) {
  const [form, setForm] = useState(() => ({
    ...defaultForm,
    title: initial?.title || "",
    description: initial?.description || "",
    village: initial?.village || "",
    street: initial?.address?.street || "",
    city: initial?.address?.city || "",
    state: initial?.address?.state || "",
    zipCode: initial?.address?.zipCode || "",
    amount: initial?.price?.amount ? String(initial.price.amount) : "",
    period: initial?.price?.period || "monthly",
    propertyType: initial?.propertyType || "apartment",
    amenities: (initial?.amenities || []).join(", "),
    isAvailable: initial?.isAvailable ?? true,
    isVerified: initial?.isVerified ?? false,
  }));
  const [remoteImages, setRemoteImages] = useState<string[]>(initial?.propertyImages || []);
  const [localImages, setLocalImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setLocalImages((prev) => [...prev, ...Array.from(files)].slice(0, 10));
  };

  const removeRemoteImage = (index: number) => {
    setRemoteImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const removeLocalImage = (index: number) => {
    setLocalImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.village || !form.city || !form.state || !form.amount) {
      alert("Please fill all required fields");
      return;
    }

    setUploading(true);
    try {
      const uploaded = [...remoteImages];
      for (const f of localImages) {
        const url = await uploadWithSignature(f);
        uploaded.push(url);
      }

      const body: PropertyPayload = {
        title: form.title,
        description: form.description,
        village: form.village,
        address: {
          street: form.street || undefined,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode || undefined,
        },
        price: {
          amount: Number(form.amount),
          period: form.period,
        },
        propertyType: form.propertyType,
        amenities: form.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        propertyImages: uploaded,
        isAvailable: form.isAvailable,
        ...(canVerify ? { isVerified: form.isVerified } : {}),
      };

      await onSubmit(body);

      if (mode === "create") {
        setForm(defaultForm);
        setRemoteImages([]);
        setLocalImages([]);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload or create property');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className="ui-focus-ring mt-2 min-h-[110px] w-full rounded-md border border-slate-200 p-2 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="village">Village *</Label>
          <Input id="village" value={form.village} onChange={(e) => setForm((prev) => ({ ...prev, village: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="street">Street</Label>
          <Input id="street" value={form.street} onChange={(e) => setForm((prev) => ({ ...prev, street: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="city">City *</Label>
          <Input id="city" value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Input id="state" value={form.state} onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input id="zipCode" value={form.zipCode} onChange={(e) => setForm((prev) => ({ ...prev, zipCode: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="amount">Price *</Label>
          <Input id="amount" type="number" value={form.amount} onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="period">Price Period</Label>
          <select
            id="period"
            value={form.period}
            onChange={(e) => setForm((prev) => ({ ...prev, period: e.target.value as PropertyPayload["price"]["period"] }))}
            className="ui-focus-ring mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <Label htmlFor="propertyType">Property Type</Label>
          <select
            id="propertyType"
            value={form.propertyType}
            onChange={(e) => setForm((prev) => ({ ...prev, propertyType: e.target.value as PropertyPayload["propertyType"] }))}
            className="ui-focus-ring mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="room">Room</option>
            <option value="studio">Studio</option>
          </select>
        </div>
        <div>
          <Label htmlFor="amenities">Amenities (comma separated)</Label>
          <Input id="amenities" value={form.amenities} onChange={(e) => setForm((prev) => ({ ...prev, amenities: e.target.value }))} />
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(e) => setForm((prev) => ({ ...prev, isAvailable: e.target.checked }))}
          />
          Available for booking
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.isVerified}
            disabled={!canVerify}
            onChange={(e) => setForm((prev) => ({ ...prev, isVerified: e.target.checked }))}
          />
          Verified {canVerify ? "" : "(admin only)"}
        </label>
      </div>

      <div>
        <Label htmlFor="images">Images</Label>
        <input id="images" type="file" multiple accept="image/*" onChange={handleFiles} className="mt-2 block w-full text-sm" />

        {(remoteImages.length > 0 || localImages.length > 0) ? (
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {remoteImages.map((image, idx) => (
              <div key={`${image}-${idx}`} className="rounded-md border border-slate-200 p-2">
                <img src={image} alt="uploaded" className="h-24 w-full rounded object-cover" />
                <button className="mt-2 text-xs text-rose-600" onClick={() => removeRemoteImage(idx)}>
                  Remove
                </button>
              </div>
            ))}
            {localImages.map((file, idx) => (
              <div key={`${file.name}-${idx}`} className="rounded-md border border-slate-200 p-2">
                <img src={URL.createObjectURL(file)} alt={file.name} className="h-24 w-full rounded object-cover" />
                <button className="mt-2 text-xs text-rose-600" onClick={() => removeLocalImage(idx)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={uploading} className="ui-btn-primary">
          {uploading ? "Saving..." : mode === "create" ? "Create Property" : "Update Property"}
        </Button>
      </div>
    </div>
  );
}
