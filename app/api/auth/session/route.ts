import { NextRequest, NextResponse } from "next/server";
import { getRequestUser, USER_COOKIE } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getRequestUser(request);
    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error("Error loading session:", error);
    return NextResponse.json({ error: "Unable to load session" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(USER_COOKIE);
  return response;
}