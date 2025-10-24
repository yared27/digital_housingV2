 "use client";
import {Card, CardContent, CardHeader, CardFooter} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {useLoginMutation} from "@/store/api";
import {LoginData} from "@/types/auth/login";
export const LoginForm = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  }
  // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await login(formData);
            alert("Login successful!");
        } catch (error: any) {
            console.error("Login failed:", error);
            const message =
            error?.data?.message ||
            error?.error ||
            error?.message ||
            "An unknown error occurred";

            alert(`Login failed: ${message}`);
            }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
        <Card className="w-[400px] max-w-full shadow-xl rounded-2xl">
          <CardHeader>
            <h2 className="text-2xl font-bold">Login</h2>
            </CardHeader>
            <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="email" className="block mb-1">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col space-y-2 relative">
                    <Label htmlFor="password" className="block mb-1">Password</Label>
                    <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full"
                    />
                    <Button type="button" onClick={togglePasswordVisibility} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} aria-controls="password" className="absolute  top-1/3 end-0   px-2 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus-visible:text-indigo-500 hover:text-indigo-500 transition-colors">
                        {showPassword ? (<EyeOff size={20} aria-hidden="true" />) : (<Eye size={20} aria-hidden="true" />)}
                    </Button>
                </div>
                <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-60 w-full">
                    {isLoading ? "Logging in..." : "Login"}
                </Button>
            </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center pb-6">
            <Button variant="outline" className="w-full flex items-center justify-center mb-2 gap-2">
                <FcGoogle size={20} />
                Continue with Google
            </Button>
            <div className="flex">
                <p className="text-gray-500">Don't have an account?</p>
                <Button variant="link" className="text-blue-600 hover:underline">
                    Sign up
                </Button>
            </div>
            <div className="mt-2 flex">
                <p> Forgot your password?</p>
                <Button variant="link" className="text-blue-600 hover:underline">
                    Reset it
                </Button>
            
            </div>
        </CardFooter>
    </Card>
</div>
    )
}
