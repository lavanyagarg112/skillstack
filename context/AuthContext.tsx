// context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type OrgRole = "admin" | "employee";

export interface OrganisationMembership {
  id: number;
  organisationname: string;
  role: OrgRole;
}

export interface User {
  isLoggedIn: boolean;
  userId?: number;
  email?: string;
  firstname?: string;
  lastname?: string;
  organisation?: OrganisationMembership;
  hasCompletedOnboarding?: boolean | null;
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
    // 1) Fetch the “whoami”
    fetch("/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then((u: User) => setUser(u))
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
