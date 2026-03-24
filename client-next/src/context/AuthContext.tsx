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
            const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
            try {
                let response = await fetch(`${base}/api/users/me`, {
                    credentials: "include"
                });

                if (response.status === 401) {
                    const refresh = await fetch(`${base}/api/auth/refresh-token`, {
                        method: "POST",
                        credentials: "include",
                    });
                    if (refresh.ok) {
                        response = await fetch(`${base}/api/users/me`, {
                            credentials: "include"
                        });
                    }
                }

                if (response && response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else if (response) {
                    // helpful debug log for non-OK responses
                    console.debug('Auth fetch response:', response.status, response.statusText);
                }
            } catch (err) {
                // Log network/CORS errors for easier debugging
                console.error('Failed to fetch auth user:', err);
            } finally {
                setUserLoading(false);
            }
        };
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{user, setUser, loading: userLoading }}>
            {!userLoading && children}
        </AuthContext.Provider>
    );
};

