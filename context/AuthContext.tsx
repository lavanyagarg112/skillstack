// context/AuthContext.tsx
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  isLoggedIn: boolean;
  email?: string;
  organisationName?: string;
  firstname?: string;
  lastname?: string;
}
interface AuthCtx {
  user: User;
  setUser: (u: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({ isLoggedIn: false });

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then(setUser)
      .catch(() => {});
  }, []);

  async function logout() {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setUser({ isLoggedIn: false });
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
