import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

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
  login: (email?: string, password?: string, remember?: boolean) => Promise<User>;
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
          await new Promise(resolve => setTimeout(resolve, 300));
          setCurrentUser({
            id: "1",
            name: "Instagram Influencer",
            email: "influencer@instagram.com",
            role: "influencer",
            avatar: "https://i.pravatar.cc/150?img=47"
          });
        } catch (error) {
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email?: string, _password?: string, remember: boolean = false) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const user: User = {
        id: "1",
        name: "Instagram Influencer",
        email: email || "influencer@instagram.com",
        role: "influencer",
        avatar: "https://i.pravatar.cc/150?img=47"
      };
      const access_token = "mock_auth_token_123";
      
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

  const register = async (email: string, _password: string, role: Role, name: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const user: User = {
        id: "2",
        name,
        email,
        role,
      };
      const access_token = "mock_auth_token_456";
      
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
