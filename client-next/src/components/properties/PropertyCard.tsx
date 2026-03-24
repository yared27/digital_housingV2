"use client";
import Link from "next/link";
import React from "react";
import { Property } from "@/types/property";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PropertyCard({ property }: { property: Property }) {
  const id = property._id || property.id;
  const image = property.propertyImages?.[0] || "/images/signup.jpg";
  const location = [property.village, property.address?.city, property.address?.state]
    .filter(Boolean)
    .join(", ");

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <div className="relative">
          <img
            src={image}
            alt={property.title}
            className="h-44 w-full rounded-lg object-cover"
          />
          <span
            className={[
              "absolute left-3 top-3 rounded-full px-2 py-1 text-xs font-medium",
              property.isAvailable
                ? "bg-emerald-600 text-white"
                : "bg-slate-700 text-white",
            ].join(" ")}
          >
            {property.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
        <div className="pt-3">
          <div>
            <CardTitle className="line-clamp-1 text-lg">{property.title}</CardTitle>
            <CardDescription className="line-clamp-1 text-sm text-slate-500">{location || "Location not specified"}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-slate-600">{property.description}</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <div>
            <div className="text-lg font-semibold text-slate-900">
              {typeof property.price?.amount === "number" ? `$${property.price.amount.toLocaleString()}` : "N/A"}
            </div>
            <div className="text-xs text-slate-500">{property.price?.period || "period not set"}</div>
          </div>
          <Link href={`/properties/${id}`}>
            <Button>View Details</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
