import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth");
  if (!auth) {
    return NextResponse.json({ isLoggedIn: false });
  }

  try {
    const user = JSON.parse(auth.value);
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ isLoggedIn: false });
  }
}
