"use client"
import {Button} from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export const GoogleButton = () => {
    const handleGoogleAuth = () => {
        window.open("http://localhost:5000/auth/google", "_self");
    };

    return (
        <Button onClick={handleGoogleAuth} variant = "outline" className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-100">
            <FcGoogle className="text-lg" />
            Continue with Google
        </Button>
    );
};

