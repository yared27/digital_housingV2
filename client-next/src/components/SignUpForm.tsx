"use client";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { FiEye, FiEyeOff  } from "react-icons/fi";
import { Eye, EyeOff } from "lucide-react";
const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Submit logic here (e.g., API call)
  };

  const signInWithGoogle = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

const [isVisible, setIsVisible] = useState(false);
const toggleVisibility = () => setIsVisible(prevState => !prevState);

  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100"
              required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100"
              required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100"
              required />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={isVisible ? "text" : "password"}
              className="w-full text-sm text-slate-600 bg-white border border-slate-300 appearance-none rounded-lg ps-3.5 pe-10 py-2.5 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter your password..."
              aria-label="Password"
              value={formData.password}
              onChange={handleChange}
              required />
            <button
              className="absolute inset-y-0  top-1/2 end-0 flex  z-20 px-2.5 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus-visible:text-indigo-500 hover:text-indigo-500 transition-colors"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
              aria-controls="password"
            >
              {isVisible ? (
                <EyeOff size={20} aria-hidden="true" />
              ) : (
                <Eye size={20} aria-hidden="true" />
              )}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type={isVisible ? "text" : "password"}
              name="confirmPassword"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100"
              required />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Sign Up
          </Button>
        </form>

        <div className="my-6 text-center text-gray-500 text-sm">or</div>

        <Button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-100 transition-all"
        >
          <FcGoogle className="text-xl" /> Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
