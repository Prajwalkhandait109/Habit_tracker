import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";

export const USER_COOKIE = "winter_arc_user";

export async function getRequestUser(request: NextRequest) {
  const userId = Number(request.cookies.get(USER_COOKIE)?.value);
  if (!Number.isSafeInteger(userId) || userId < 1) return null;

  return db.query.users.findFirst({ where: eq(users.id, userId) });
}