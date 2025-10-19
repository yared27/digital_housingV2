import SignupForm from '@/components/SignUpForm';
export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 bg-[url('/images/signup.jpg')] bg-cover bg-center">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-8">
       
        <div className="flex-1">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
