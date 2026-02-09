"use client";
import GoogleCTAButton from "./GoogleCTAButton";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Find your perfect home in minutes
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              Discover verified listings, chat with owners, and book confidently — all in one
              platform. Built for speed, safety, and simplicity.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <GoogleCTAButton />
              <Button
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("features");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore features
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
              <span>• Verified properties</span>
              <span>• Real-time chat</span>
              <span>• Secure bookings</span>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            {/* Placeholder illustration / hero image */}
            <div className="aspect-[16/10] w-full rounded-md bg-gradient-to-br from-indigo-100 to-indigo-50" />
            <div className="mt-3 text-sm text-gray-600">
              Map-based search, instant messaging, and booking calendar — ready to go.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}