export default function Features() {
  const features = [
    {
      title: "Verified Listings",
      desc: "Trustworthy properties with owner verification.",
      icon: "🏠",
    },
    {
      title: "Real-time Chat",
      desc: "Message owners instantly with Socket.io.",
      icon: "💬",
    },
    {
      title: "Map-based Search",
      desc: "Find homes near you with geospatial search.",
      icon: "🗺️",
    },
    {
      title: "Secure Bookings",
      desc: "Manage reservations and availability with ease.",
      icon: "📅",
    },
    {
      title: "Cloud Images",
      desc: "Fast, optimized media via Cloudinary CDN.",
      icon: "☁️",
    },
    {
      title: "Ratings & Reviews",
      desc: "Build reputation with transparent feedback.",
      icon: "⭐",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-3xl font-bold">Features that power your search</h2>
      <p className="mt-2 text-gray-700">Everything you need to find and book with confidence.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="text-2xl">{f.icon}</div>
            <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-gray-700">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}