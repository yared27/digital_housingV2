import GoogleCTAButton from "./GoogleCTAButton";

export default function CTASection() {
  return (
    <section id="cta" className="bg-indigo-50">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold">Ready to get started?</h2>
        <p className="mt-3 text-gray-700">
          Sign in with Google to explore verified listings and book with confidence.
        </p>
        <div className="mt-6 flex justify-center">
          <GoogleCTAButton />
        </div>
        <p className="mt-3 text-xs text-gray-600">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </section>
  );
}