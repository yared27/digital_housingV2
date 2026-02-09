"use client";
import { IUser } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [userLoading, setUserLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchUser = async () => {
            let response = await fetch("http://localhost:5000/api/users/me", {
                credentials: "include"
            });

            if (response.status === 401) {
                const refresh = await fetch("http://localhost:5000/api/auth/refresh-token", {
                    method: "POST",
                    credentials: "include",
                });
                if (refresh.ok) {
                    response = await fetch("http://localhost:5000/api/users/me", {
                        credentials: "include"
                    });
                }
            }

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

