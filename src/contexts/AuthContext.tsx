import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type Role = "brand" | "influencer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string, role?: Role, name?: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, _password: string, role: Role = "brand", name?: string) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const user: User = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      name: name || email.split("@")[0],
      email,
      role,
    };
    
    setCurrentUser(user);
    setIsLoading(false);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
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
