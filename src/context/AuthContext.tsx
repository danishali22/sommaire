// app/context/AuthContext.tsx
"use client";

import { IUserWithPlan } from "@/models/User";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: IUserWithPlan | null;
  loading: boolean;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refetch: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUserWithPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      } else {
        setUser(null);
        console.error("❌ Failed to fetch user:", data.error);
      }
    } catch (err) {
      console.error("❌ Error fetching user:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
