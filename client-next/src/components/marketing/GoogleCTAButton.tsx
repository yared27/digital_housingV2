"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export default function GoogleCTAButton() {
  const [loading, setLoading] = useState(false);
  const handleGoogleAuth = () => {
    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
    const authPath = process.env.NEXT_PUBLIC_GOOGLE_AUTH_PATH ?? "/api/auth/google";
    window.location.href = `${baseUrl}${authPath}`;
  };

  return (
    <Button
      onClick={handleGoogleAuth}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <FcGoogle className="text-lg" />
      {loading ? "Redirecting..." : "Continue with Google"}
    </Button>
  );
}