import { ShieldCheck, Building2, CalendarCheck2, LayoutDashboard, ImagePlus, RefreshCw } from "lucide-react";
import PageSection from "@/components/common/PageSection";

const features = [
  {
    title: "Secure Authentication",
    description: "Cookie-based auth with role-aware redirects for renter, owner, and admin journeys.",
    Icon: ShieldCheck,
  },
  {
    title: "Verified Properties",
    description: "Property details include structured location, pricing, amenities, and availability metadata.",
    Icon: Building2,
  },
  {
    title: "Booking Requests",
    description: "Renters request bookings and owners can confirm or decline through clear status workflows.",
    Icon: CalendarCheck2,
  },
  {
    title: "Owner Dashboard",
    description: "Manage listings, monitor pending requests, and update property details from one workspace.",
    Icon: LayoutDashboard,
  },
  {
    title: "Cloud Image Upload",
    description: "Signed Cloudinary uploads support secure media workflows for listings and profile avatars.",
    Icon: ImagePlus,
  },
  {
    title: "Real-time Ready",
    description: "Architecture is prepared for richer update flows and future live collaboration features.",
    Icon: RefreshCw,
  },
];

export default function FeatureGrid() {
  return (
    <PageSection
      id="features"
      className="py-16 sm:py-20"
      title="Built for modern rental operations"
      subtitle="Professional tools for renters, owners, and administrators in one cohesive platform."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <feature.Icon className="h-10 w-10 rounded-xl bg-slate-100 p-2 text-slate-700" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </PageSection>
  );
}
