import SiteHeader from "@/components/common/SiteHeader";
import SiteFooter from "@/components/common/SiteFooter";
import PageSection from "@/components/common/PageSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <PageSection
        className="py-12 sm:py-16"
        title="Contact us"
        subtitle="Questions, feedback, or partnership requests? Send us a message."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Support channels</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Email: support@digitalhousing.example</li>
              <li>Partnerships: partnerships@digitalhousing.example</li>
              <li>Hours: Mon - Fri, 09:00 - 18:00</li>
            </ul>
          </article>

          <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  className="min-h-[120px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  placeholder="How can we help?"
                />
              </div>
              <Button className="bg-slate-900 text-white hover:bg-slate-800" type="button">Send message</Button>
            </div>
          </form>
        </div>
      </PageSection>

      <SiteFooter />
    </main>
  );
}
