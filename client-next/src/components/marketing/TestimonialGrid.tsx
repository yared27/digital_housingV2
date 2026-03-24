import PageSection from "@/components/common/PageSection";

const testimonials = [
  {
    quote:
      "The search and booking flow is straightforward. I could compare options quickly and request a booking in minutes.",
    role: "Renter",
  },
  {
    quote:
      "Managing listings and requests from one dashboard keeps my property operations organized and responsive.",
    role: "Property owner",
  },
  {
    quote:
      "The role-based structure makes administration and moderation easier for platform operations.",
    role: "Platform admin",
  },
];

export default function TestimonialGrid() {
  return (
    <PageSection className="bg-slate-50 py-16 sm:py-20" title="What users value" subtitle="Early feedback on clarity, trust, and usability.">
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <figure key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <blockquote className="text-sm leading-6 text-slate-700">“{item.quote}”</blockquote>
            <figcaption className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">{item.role}</figcaption>
          </figure>
        ))}
      </div>
    </PageSection>
  );
}
