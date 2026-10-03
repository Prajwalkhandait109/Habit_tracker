import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { habits, dailyProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getRequestUser } from "@/lib/auth";

// PATCH /api/habits/[id] - Update a habit
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getRequestUser(request);
    if (!user) return NextResponse.json({ error: "Choose a username first" }, { status: 401 });

    const id = parseInt(params.id);
    const body = await request.json();
    const { name, color, icon, order, isActive } = body;

    const updatedHabit = await db
      .update(habits)
      .set({
        ...(name !== undefined && { name }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      })
      .where(and(eq(habits.id, id), eq(habits.userId, user.id)))
      .returning();

    if (updatedHabit.length === 0) {
      return NextResponse.json(
        { error: "Habit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedHabit[0]);
  } catch (error) {
    console.error("Error updating habit:", error);
    return NextResponse.json(
      { error: "Failed to update habit" },
      { status: 500 }
    );
  }
}

// DELETE /api/habits/[id] - Soft delete a habit (set isActive to false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getRequestUser(request);
    if (!user) return NextResponse.json({ error: "Choose a username first" }, { status: 401 });

    const id = parseInt(params.id);

    // Soft delete by setting isActive to false
    const deleted = await db
      .update(habits)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(and(eq(habits.id, id), eq(habits.userId, user.id)))
      .returning({ id: habits.id });

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting habit:", error);
    return NextResponse.json(
      { error: "Failed to delete habit" },
      { status: 500 }
    );
  }
}
