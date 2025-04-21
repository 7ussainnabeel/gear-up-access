import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  refreshUser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await fetch("/users/me"); // Adjust endpoint as needed
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, refreshUser: fetchCurrentUser }}>
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
