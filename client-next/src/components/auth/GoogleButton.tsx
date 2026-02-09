"use client"
import {Button} from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

export const GoogleButton = () => {

    const [Loading, setIsLoading] = useState(false);

    const handleGoogleAuth = () => {
        setIsLoading(true);
        window.open("http://localhost:5000/api/auth/google", "_self");
    };

    return (
        <Button onClick={handleGoogleAuth} disabled={Loading} variant = "outline" className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-100">
            <FcGoogle className="text-lg" />
            {Loading ? "Loading..." : "Continue with Google"}
        </Button>
    );
};

