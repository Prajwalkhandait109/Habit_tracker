import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { USER_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";

    if (!/^[a-z0-9_-]{1,32}$/.test(username)) {
      return NextResponse.json(
        { error: "Use 1–32 letters, numbers, underscores, or hyphens" },
        { status: 400 }
      );
    }

    await db.insert(users).values({ username }).onConflictDoNothing();
    const user = await db.query.users.findFirst({ where: eq(users.username, username) });
    if (!user) throw new Error("Unable to load user profile");

    const response = NextResponse.json({ id: user.id, username: user.username });
    response.cookies.set(USER_COOKIE, String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ error: "Unable to open profile" }, { status: 500 });
  }
}