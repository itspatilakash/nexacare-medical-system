import { createContext, useContext, useEffect, useState } from "react";
import { getUserFromToken, authApi } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { data: profileData } = useQuery({
        queryKey: ['/api/auth/me'],
        queryFn: authApi.getProfile,
        enabled: !!user,
        retry: false,
    });
    useEffect(() => {
        const tokenUser = getUserFromToken();
        setUser(tokenUser);
        setIsLoading(false);
    }, []);
    const logout = () => {
        setUser(null);
        authApi.logout();
    };
    return (<AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            logout,
        }}>
      {children}
    </AuthContext.Provider>);
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
