"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "@/store/api";
import { LoginData } from "@/types/auth/login";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await login(formData).unwrap();
      router.replace("/dashboard");
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        "Unable to sign in. Please check your credentials.";
      setErrorMessage(message);
    }
  };

  const signInWithGoogle = () => {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
    window.open(`${apiBase}/api/auth/google`, "_self");
  };

  return (
    <Card className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-lg">
      <CardHeader>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
        <p className="text-sm text-slate-500">Sign in to continue to Digital Housing.</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="ui-focus-ring absolute inset-y-0 right-2 inline-flex items-center text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {errorMessage ? (
            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <Button type="submit" disabled={isLoading} className="ui-btn-primary w-full">
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button onClick={signInWithGoogle} variant="outline" className="w-full">
          <FcGoogle size={18} />
          Continue with Google
        </Button>

        <p className="text-sm text-slate-600">
          No account yet?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/signup")}
            className="font-medium text-slate-900 underline underline-offset-4"
          >
            Create one
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};
