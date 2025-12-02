import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "./api";

interface User {
  id: number;
  email: string;
  fullName: string;
  role: "customer" | "agent" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    if (!api.isAuthenticated()) {
      setLoading(false);
      return;
    }

    const response = await api.getCurrentUser();
    if (response.data) {
      setUser(response.data);
    } else {
      api.removeAuthToken();
    }
    setLoading(false);
  }

  async function login(email: string, password: string) {
    const response = await api.login(email, password);
    if (response.data) {
      api.setAuthToken(response.data.token);
      setUser(response.data.user);
      return { success: true };
    }
    return { success: false, error: response.error || "Login failed" };
  }

  async function register(data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }) {
    const response = await api.register(data);
    if (response.data) {
      api.setAuthToken(response.data.token);
      setUser(response.data.user);
      return { success: true };
    }
    return { success: false, error: response.error || "Registration failed" };
  }

  function logout() {
    api.removeAuthToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
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
