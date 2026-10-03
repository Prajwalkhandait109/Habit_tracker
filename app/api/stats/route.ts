import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { habits, dailyProgress } from "@/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { 
  calculateStreak, 
  calculateBestStreak, 
  calculateWinterArcProgress,
  getWinterArcDates 
} from "@/lib/utils";
import { getRequestUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getRequestUser(request);
    if (!user) return NextResponse.json({ error: "Choose a username first" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
    
    // Get Winter Arc date range
    const { start: winterStart, end: winterEnd } = getWinterArcDates(year);
    const today = new Date();
    
    // Get all active habits
    const allHabits = await db.query.habits.findMany({
      where: and(eq(habits.userId, user.id), eq(habits.isActive, true)),
    });
    
    // Get all progress for Winter Arc period
    const allProgress = await db
      .select({ habitId: dailyProgress.habitId, date: dailyProgress.date })
      .from(dailyProgress)
      .innerJoin(habits, eq(dailyProgress.habitId, habits.id))
      .where(and(
        eq(habits.userId, user.id),
        eq(dailyProgress.completed, true),
      ));
    
    // Filter progress by date range
    const winterProgress = allProgress.filter(p => {
      const date = new Date(p.date);
      return date >= winterStart && date <= winterEnd;
    });
    
    // Calculate total days in Winter Arc
    const totalDays = Math.ceil((winterEnd.getTime() - winterStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysCompleted = Math.ceil((Math.min(today.getTime(), winterEnd.getTime()) - winterStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, totalDays - daysCompleted);
    
    // Calculate winter arc progress
    const winterArcProgress = calculateWinterArcProgress(winterStart, winterEnd, today);
    
    // Calculate today's completion
    const todayStr = today.toISOString().split("T")[0];
    const todayProgress = winterProgress.filter(p => p.date === todayStr);
    const todayCompletion = allHabits.length > 0 ? (todayProgress.length / allHabits.length) * 100 : 0;
    
    // Calculate streaks
    const habitCompletionsByDate = new Map<string, number>();
    winterProgress.forEach(p => {
      const count = habitCompletionsByDate.get(p.date) || 0;
      habitCompletionsByDate.set(p.date, count + 1);
    });
    
    const sortedDates = Array.from(habitCompletionsByDate.keys()).sort();
    const allCompletedByDate = sortedDates.map(date => 
      (habitCompletionsByDate.get(date) || 0) === allHabits.length
    );
    
    const currentStreak = calculateStreak(allCompletedByDate);
    const bestStreak = calculateBestStreak(allCompletedByDate);
    
    // Calculate totals
    const totalCompleted = winterProgress.length;
    const totalPossible = allHabits.length * daysCompleted;
    
    // Calculate Winter Arc Score (0-100)
    const winterArcScore = totalPossible > 0 
      ? Math.round((totalCompleted / totalPossible) * 100)
      : 0;
    
    // Calculate monthly stats
    const monthlyStats = [];
    const months = ["October", "November", "December", "January", "February"];
    const monthIndices = [9, 10, 11, 0, 1]; // 0-indexed months
    
    for (let i = 0; i < months.length; i++) {
      const month = monthIndices[i];
      const yearForMonth = i < 3 ? year : year + 1;
      const daysInMonth = new Date(yearForMonth, month + 1, 0).getDate();
      const startDay = i === 0 ? 1 : 1;
      const endDay = i === 0 ? daysInMonth : daysInMonth;
      
      // Count completions for this month
      let monthCompletions = 0;
      winterProgress.forEach(p => {
        const pDate = new Date(p.date);
        if (pDate.getMonth() === month && pDate.getFullYear() === yearForMonth) {
          monthCompletions++;
        }
      });
      
      const possibleCompletions = allHabits.length * (endDay - startDay + 1);
      
      monthlyStats.push({
        month: months[i],
        completion: possibleCompletions > 0 ? (monthCompletions / possibleCompletions) * 100 : 0,
        totalDays: endDay - startDay + 1,
      });
    }
    
    // Calculate habit stats
    const habitStats = allHabits.map(habit => {
      const habitProgress = winterProgress.filter(p => p.habitId === habit.id);
      const completion = daysCompleted > 0 ? (habitProgress.length / daysCompleted) * 100 : 0;
      
      // Calculate streak for this habit
      const habitCompletions = sortedDates.map(date => 
        habitProgress.some(p => p.date === date)
      );
      const streak = calculateStreak(habitCompletions);
      
      return {
        habitId: habit.id,
        habitName: habit.name,
        completion,
        streak,
      };
    });
    
    return NextResponse.json({
      totalHabits: allHabits.length,
      todayCompletion,
      currentStreak,
      bestStreak,
      totalCompleted,
      totalPossible,
      winterArcProgress,
      daysRemaining,
      daysCompleted,
      winterArcScore,
      monthlyStats,
      habitStats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
