import SignupForm from '../../../components/auth/SignUpForm';
import SiteHeader from '@/components/common/SiteHeader';
import SiteFooter from '@/components/common/SiteFooter';

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <section className="mx-auto flex w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full flex justify-center">
          <SignupForm />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
