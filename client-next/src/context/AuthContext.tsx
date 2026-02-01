"use client";
import { createContext, useContext, useEffect, useState } from "react"
interface AuthContextType {
    user: string | null;
    setUser: React.Dispatch<React.SetStateAction<string | null>>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    const [userLoading, setUserLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch("http://localhost:5000/api/auth/me", {
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            }
            setUserLoading(false);
        };
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{user, setUser, loading: userLoading }}>
            {!userLoading && children}
        </AuthContext.Provider>
    );
};

