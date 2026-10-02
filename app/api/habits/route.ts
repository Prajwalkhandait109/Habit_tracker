import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { habits, dailyProgress } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";

// GET /api/habits - Get all habits with their progress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
    
    // Get all active habits
    const allHabits = await db.query.habits.findMany({
      where: eq(habits.isActive, true),
      orderBy: [asc(habits.order)],
    });

    // Calculate date range for Winter Arc
    const startDate = new Date(year, 9, 1); // October 1
    const endDate = new Date(year + 1, 1, year % 4 === 0 ? 29 : 28); // Feb 28/29

    // Get all progress for this period
    const progress = await db.query.dailyProgress.findMany({
      where: and(
        eq(dailyProgress.completed, true),
      ),
    });

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
    const body = await request.json();
    const { name, color, icon } = body;

    // Get the max order
    const maxOrder = await db
      .select({ maxOrder: habits.order })
      .from(habits)
      .orderBy(habits.order)
      .limit(1);

    const newOrder = (maxOrder[0]?.maxOrder ?? -1) + 1;

    const newHabit = await db
      .insert(habits)
      .values({
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
