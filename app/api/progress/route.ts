import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dailyProgress, habits } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getRequestUser } from "@/lib/auth";

// GET /api/progress - Get progress for a date range
export async function GET(request: NextRequest) {
  try {
    const user = await getRequestUser(request);
    if (!user) return NextResponse.json({ error: "Choose a username first" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start and end dates are required" },
        { status: 400 }
      );
    }

    const progress = await db
      .select({
        id: dailyProgress.id,
        habitId: dailyProgress.habitId,
        date: dailyProgress.date,
        completed: dailyProgress.completed,
        createdAt: dailyProgress.createdAt,
        updatedAt: dailyProgress.updatedAt,
      })
      .from(dailyProgress)
      .innerJoin(habits, eq(dailyProgress.habitId, habits.id))
      .where(and(
        eq(habits.userId, user.id),
        eq(dailyProgress.completed, true),
      ));

    // Filter by date range in memory since we need to compare dates
    const filteredProgress = progress.filter(p => {
      const progressDate = new Date(p.date);
      return progressDate >= new Date(startDate) && progressDate <= new Date(endDate);
    });

    return NextResponse.json({ progress: filteredProgress });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

// POST /api/progress - Update or create progress for a habit on a date
export async function POST(request: NextRequest) {
  try {
    const user = await getRequestUser(request);
    if (!user) return NextResponse.json({ error: "Choose a username first" }, { status: 401 });

    const body = await request.json();
    const { habitId, date, completed } = body;

    if (!habitId || !date) {
      return NextResponse.json(
        { error: "Habit ID and date are required" },
        { status: 400 }
      );
    }

    const ownedHabit = await db.query.habits.findFirst({
      where: and(eq(habits.id, habitId), eq(habits.userId, user.id)),
    });
    if (!ownedHabit) return NextResponse.json({ error: "Habit not found" }, { status: 404 });

    // Check if progress already exists
    const existing = await db.query.dailyProgress.findFirst({
      where: and(
        eq(dailyProgress.habitId, habitId),
        eq(dailyProgress.date, date)
      ),
    });

    if (existing) {
      // Update existing progress
      const updated = await db
        .update(dailyProgress)
        .set({
          completed,
          updatedAt: new Date(),
        })
        .where(eq(dailyProgress.id, existing.id))
        .returning();

      return NextResponse.json(updated[0]);
    } else {
      // Create new progress
      const created = await db
        .insert(dailyProgress)
        .values({
          habitId,
          date,
          completed,
        })
        .returning();

      return NextResponse.json(created[0], { status: 201 });
    }
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

// DELETE /api/progress - Delete progress for a habit on a date
export async function DELETE(request: NextRequest) {
  try {
    const user = await getRequestUser(request);
    if (!user) return NextResponse.json({ error: "Choose a username first" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const habitId = parseInt(searchParams.get("habitId") || "");
    const date = searchParams.get("date");

    if (!habitId || !date) {
      return NextResponse.json(
        { error: "Habit ID and date are required" },
        { status: 400 }
      );
    }

    const ownedHabit = await db.query.habits.findFirst({
      where: and(eq(habits.id, habitId), eq(habits.userId, user.id)),
    });
    if (!ownedHabit) return NextResponse.json({ error: "Habit not found" }, { status: 404 });

    await db
      .delete(dailyProgress)
      .where(
        and(
          eq(dailyProgress.habitId, habitId),
          eq(dailyProgress.date, date)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting progress:", error);
    return NextResponse.json(
      { error: "Failed to delete progress" },
      { status: 500 }
    );
  }
}
