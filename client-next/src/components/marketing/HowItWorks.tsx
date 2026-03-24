import PageSection from "@/components/common/PageSection";

const steps = [
  {
    title: "Browse",
    description: "Explore curated property listings by location, type, price, and amenities.",
  },
  {
    title: "Request booking",
    description: "Choose dates and send a booking request from the property detail page.",
  },
  {
    title: "Get confirmation",
    description: "Track request status and finalize your rental flow with confidence.",
  },
];

export default function HowItWorks() {
  return (
    <PageSection id="how-it-works" className="bg-slate-50 py-16 sm:py-20" title="How it works" subtitle="A simple path from discovery to booking confirmation.">
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Step {index + 1}</p>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
          </li>
        ))}
      </ol>
    </PageSection>
  );
}
