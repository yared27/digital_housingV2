import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import Steps from "@/components/marketing/Steps";
import Testimonials from "@/components/marketing/Testimonials";
import CTASection from "@/components/marketing/CTASection";
import Footer from "@/components/marketing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      <Features />
      <Steps />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}