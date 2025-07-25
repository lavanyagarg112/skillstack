import { ReactNode } from "react";

export default function UsersLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-4xl font-bold text-purple-600 mb-8">Users</h1>
      {children}
    </div>
  );
}
