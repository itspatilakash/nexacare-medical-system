import { createContext, useContext, useEffect, useState } from "react";
import { getUserFromToken, type User, authApi } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
