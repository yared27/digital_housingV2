import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";

interface AuthCardProps {
    title: string;
    children: React.ReactNode;
}

const AuthCard = ({ title, children }: AuthCardProps) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-green-500">
        <Card className="w-[400px] shadow-md rounded-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center text-gray-800">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {children}
            </CardContent>
        </Card>
        </div>
    );
};

export default AuthCard;
