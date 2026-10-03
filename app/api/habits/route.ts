import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { habits, dailyProgress } from "@/db/schema";
import { eq, asc, and, desc } from "drizzle-orm";
import { getRequestUser } from "@/lib/auth";

// GET /api/habits - Get all habits with their progress
export async function GET(request: NextRequest) {
  try {
    const user = await getRequestUser(request);
    if (!user) return NextResponse.json({ error: "Choose a username first" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
    
    // Get all active habits
    const allHabits = await db.query.habits.findMany({
      where: and(eq(habits.userId, user.id), eq(habits.isActive, true)),
      orderBy: [asc(habits.order)],
    });

    // Calculate date range for Winter Arc
    const startDate = new Date(year, 9, 1); // October 1
    const endDate = new Date(year + 1, 1, year % 4 === 0 ? 29 : 28); // Feb 28/29

    // Get all progress for this period
    const progress = await db
      .select({ habitId: dailyProgress.habitId, date: dailyProgress.date })
      .from(dailyProgress)
      .innerJoin(habits, eq(dailyProgress.habitId, habits.id))
      .where(and(
        eq(habits.userId, user.id),
        eq(dailyProgress.completed, true),
      ));

    // Organize progress by habit and date
    const progressMap = new Map();
    progress.forEach(p => {
      const key = `${p.habitId}-${p.date}`;
      progressMap.set(key, true);
    });

    return NextResponse.json({
      habits: allHabits,
      progress: Array.from(progressMap.entries()),
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json(
      { error: "Failed to fetch habits" },
      { status: 500 }
    );
  }
}

// POST /api/habits - Create a new habit
export async function POST(request: NextRequest) {
  try {
    const user = await getRequestUser(request);
    if (!user) return NextResponse.json({ error: "Choose a username first" }, { status: 401 });

    const body = await request.json();
    const { name, color, icon } = body;

    // Get the max order
    const maxOrder = await db
      .select({ maxOrder: habits.order })
      .from(habits)
      .where(eq(habits.userId, user.id))
      .orderBy(desc(habits.order))
      .limit(1);

    const newOrder = (maxOrder[0]?.maxOrder ?? -1) + 1;

    const newHabit = await db
      .insert(habits)
      .values({
        userId: user.id,
        name,
        color: color || "#22d3ee",
        icon: icon || "circle",
        order: newOrder,
        isActive: true,
      })
      .returning();

    return NextResponse.json(newHabit[0], { status: 201 });
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json(
      { error: "Failed to create habit" },
      { status: 500 }
    );
  }
}
