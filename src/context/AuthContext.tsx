
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export type UserRole = "admin" | "user" | "management" | "it";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

// Sample users for demo purposes
// In a real application, these would come from your database
const DEMO_USERS: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@icarlton.com",
    role: "admin",
  },
  {
    id: 2,
    name: "Management User",
    email: "info@icarlton.com",
    role: "management",
  },
  {
    id: 3,
    name: "IT Support",
    email: "support@icarlton.com",
    role: "it",
  },
  {
    id: 4,
    name: "Regular User",
    email: "user@icarlton.com",
    role: "user",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll check local storage for a logged-in user
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we're using the sample users
      const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
      
      // In a real app, password would be verified by the backend
      // For demo, any password works
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        loading, 
        isAuthenticated: !!currentUser,
        login,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
