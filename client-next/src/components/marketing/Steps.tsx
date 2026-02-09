export default function Steps() {
  const steps = [
    {
      title: "Sign in with Google",
      desc: "Fast, secure sign-in — we set cookies for a seamless session.",
      num: 1,
    },
    {
      title: "Discover properties",
      desc: "Filter by village, price, amenities, and more.",
      num: 2,
    },
    {
      title: "Chat in real-time",
      desc: "Coordinate details and ask questions instantly.",
      num: 3,
    },
    {
      title: "Book with confidence",
      desc: "Check availability and reserve your dates.",
      num: 4,
    },
    {
      title: "Rate and review",
      desc: "Build reputation with trusted feedback.",
      num: 5,
    },
  ];

  return (
    <section id="how-it-works" className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">How it works</h2>
        <p className="mt-2 text-gray-700">
          A simple, streamlined flow from discovery to booking.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title} className="rounded-lg border bg-white p-5 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                {s.num}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-gray-700">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}