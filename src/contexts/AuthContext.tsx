import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import apiClient from "@/lib/apiClient";

export type Role = "brand" | "influencer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string, remember?: boolean) => Promise<User>;
  register: (email: string, password: string, role: Role, name: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
      if (token) {
        try {
          const response = await apiClient.get("/auth/me");
          setCurrentUser(response.data);
        } catch (error) {
          // 401 is handled by apiClient interceptor (clears token & redirects)
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string, remember: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { access_token, user } = response.data;
      if (remember) {
        localStorage.setItem("auth_token", access_token);
      } else {
        sessionStorage.setItem("auth_token", access_token);
      }
      setCurrentUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, role: Role, name: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/register", { email, password, role, name });
      const { access_token, user } = response.data;
      localStorage.setItem("auth_token", access_token);
      setCurrentUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, isLoading }}>
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
