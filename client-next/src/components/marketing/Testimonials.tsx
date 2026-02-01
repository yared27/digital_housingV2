export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "Found a verified apartment in my village within a day. The chat feature made coordination easy.",
      author: "Liya M.",
    },
    {
      quote:
        "Booking and messaging worked perfectly. Love the clean interface and fast search.",
      author: "Jonas K.",
    },
    {
      quote:
        "Uploading property photos was simple, and my listing started getting inquiries immediately.",
      author: "Sarah T.",
    },
  ];

  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-3xl font-bold">What users say</h2>
      <p className="mt-2 text-gray-700">Real feedback from renters and owners.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.author} className="rounded-lg border bg-white p-5 shadow-sm">
            <blockquote className="text-sm text-gray-700">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-3 text-sm font-semibold">— {t.author}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}