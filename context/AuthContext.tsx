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
  ai_enabled: boolean;
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
  loading: boolean;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User>({ isLoggedIn: false });

//   useEffect(() => {
//     // 1) Fetch the “whoami”
//     fetch("/api/me", { credentials: "include" })
//       .then((r) => r.json())
//       .then((u: User) => setUser(u))
//       .catch(() => {});
//   }, []);

//   async function logout() {
//     await fetch("/api/logout", { method: "POST", credentials: "include" });
//     setUser({ isLoggedIn: false });
//   }

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be inside AuthProvider");
//   return ctx;
// }

// add a loading flag in state
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({ isLoggedIn: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then((u: User) => setUser(u))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setUser({ isLoggedIn: false });
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
