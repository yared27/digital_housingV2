import Link from "next/link";
import { Property } from "@/types/property";

export default function MarketingPropertyCard({ property }: { property: Property }) {
  const image = property.propertyImages?.[0] || "/images/signup.jpg";
  const location = [property.village, property.address?.city, property.address?.state].filter(Boolean).join(", ");

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/properties/${property._id || property.id}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
        <img src={image} alt={property.title} className="h-48 w-full object-cover" />
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold text-slate-900">{property.title}</h3>
          <span
            className={[
              "rounded-full px-2 py-1 text-xs font-medium",
              property.isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600",
            ].join(" ")}
          >
            {property.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-slate-500">{location || "Location not specified"}</p>
        <p className="mt-3 text-sm font-medium text-slate-900">
          {typeof property.price?.amount === "number" ? `$${property.price.amount.toLocaleString()}` : "N/A"}
          <span className="ml-1 text-xs text-slate-500">/{property.price?.period || "period"}</span>
        </p>
      </div>
    </article>
  );
}
