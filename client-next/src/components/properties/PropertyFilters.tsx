"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type PropertyFilterValues = {
  city: string;
  state: string;
  village: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  amenities: string;
  sortBy: "newest" | "price_asc" | "price_desc";
};

type PropertyFiltersProps = {
  value: PropertyFilterValues;
  isApplying?: boolean;
  onChange: (patch: Partial<PropertyFilterValues>) => void;
  onApply: () => void;
  onClear: () => void;
};

export default function PropertyFilters({ value, isApplying, onChange, onApply, onClear }: PropertyFiltersProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Filter Properties</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClear}>Clear Filters</Button>
          <Button onClick={onApply} disabled={isApplying}>{isApplying ? "Applying..." : "Apply"}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" value={value.city} onChange={(e) => onChange({ city: e.target.value })} placeholder="Kampala" />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" value={value.state} onChange={(e) => onChange({ state: e.target.value })} placeholder="Central" />
        </div>
        <div>
          <Label htmlFor="village">Village</Label>
          <Input id="village" value={value.village} onChange={(e) => onChange({ village: e.target.value })} placeholder="Bweyogerere" />
        </div>
        <div>
          <Label htmlFor="type">Property Type</Label>
          <select
            id="type"
            value={value.propertyType}
            onChange={(e) => onChange({ propertyType: e.target.value })}
            className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm"
          >
            <option value="">All</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="room">Room</option>
            <option value="studio">Studio</option>
          </select>
        </div>

        <div>
          <Label htmlFor="minPrice">Min Price</Label>
          <Input id="minPrice" type="number" value={value.minPrice} onChange={(e) => onChange({ minPrice: e.target.value })} placeholder="100" />
        </div>
        <div>
          <Label htmlFor="maxPrice">Max Price</Label>
          <Input id="maxPrice" type="number" value={value.maxPrice} onChange={(e) => onChange({ maxPrice: e.target.value })} placeholder="1000" />
        </div>
        <div>
          <Label htmlFor="amenities">Amenities (comma separated)</Label>
          <Input id="amenities" value={value.amenities} onChange={(e) => onChange({ amenities: e.target.value })} placeholder="wifi, parking" />
        </div>
        <div>
          <Label htmlFor="sort">Sort</Label>
          <select
            id="sort"
            value={value.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value as PropertyFilterValues["sortBy"] })}
            className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex gap-2 md:hidden">
        <Button className="flex-1" variant="outline" onClick={onClear}>Clear</Button>
        <Button className="flex-1" onClick={onApply} disabled={isApplying}>{isApplying ? "Applying..." : "Apply"}</Button>
      </div>

    </div>
  );
}
