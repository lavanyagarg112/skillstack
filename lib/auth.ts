// lib/auth.ts
import { cookies } from "next/headers";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth");
  if (!auth) return null;
  try {
    const user = JSON.parse(auth.value);
    return user.isLoggedIn ? user : null;
  } catch {
    return null;
  }
}
