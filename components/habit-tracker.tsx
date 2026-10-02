"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useHabits } from "@/lib/hooks/useHabits";
import { useUpdateProgress } from "@/lib/hooks/useProgress";
import { cn, getDayName, getMonthName, formatShortDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface HabitTrackerProps {
  year: number;
}

export function HabitTracker({ year }: HabitTrackerProps) {
  const [currentMonth, setCurrentMonth] = useState(9); // October (0-indexed)
  const { data: habitsData, isLoading } = useHabits(year);
  const updateProgress = useUpdateProgress();

  const habits = habitsData?.habits || [];
  const progressMap = useMemo(() => {
    const map = new Map<string, boolean>();
    habitsData?.progress?.forEach(([key, value]: [string, boolean]) => {
      map.set(key, value);
    });
    return map;
  }, [habitsData]);

  // Get days in current month
  const currentYear = currentMonth >= 9 ? year : year + 1;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = getMonthName(new Date(currentYear, currentMonth));

  // Generate days array
  const days = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(currentYear, currentMonth, i + 1);
      return {
        date,
        dateStr: date.toISOString().split("T")[0],
        dayName: getDayName(date),
        isToday: date.toDateString() === new Date().toDateString(),
      };
    });
  }, [currentYear, currentMonth, daysInMonth]);

  const handleCheck = async (habitId: number, dateStr: string, currentCompleted: boolean) => {
    await updateProgress.mutateAsync({
      habitId,
      date: dateStr,
      completed: !currentCompleted,
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth(prev => {
      if (direction === "prev") {
        return prev === 9 ? 1 : prev - 1;
      } else {
        return prev === 1 ? 9 : prev + 1;
      }
    });
  };

  if (isLoading) {
    return (
      <div className="glass rounded-xl p-6 animate-pulse">
        <div className="h-96 bg-white/5 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth("prev")}
          disabled={currentMonth === 9}
          className="text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <h3 className="text-lg font-semibold text-white">
          {monthName} {currentYear}
        </h3>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth("next")}
          disabled={currentMonth === 1}
          className="text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Tracker Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Header Row */}
          <div className="flex border-b border-white/5 bg-white/5">
            <div className="sticky left-0 z-10 w-40 p-3 font-medium text-white/80 bg-inherit border-r border-white/5">
              Habit
            </div>
            {days.map((day) => (
              <div
                key={day.dateStr}
                className={cn(
                  "w-10 p-2 text-center border-r border-white/5",
                  day.isToday && "bg-cyan-500/20"
                )}
              >
                <div className="text-[10px] text-white/50 uppercase">{day.dayName}</div>
                <div className={cn(
                  "text-xs font-medium",
                  day.isToday ? "text-cyan-400" : "text-white/80"
                )}>
                  {day.date.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Habit Rows */}
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex border-b border-white/5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="sticky left-0 z-10 w-40 p-3 flex items-center gap-2 bg-inherit border-r border-white/5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: habit.color ?? "#22d3ee" }}
                />
                <span className="text-sm font-medium text-white/90 truncate">
                  {habit.name}
                </span>
              </div>
              {days.map((day) => {
                const progressKey = `${habit.id}-${day.dateStr}`;
                const isCompleted = progressMap.get(progressKey) || false;
                
                return (
                  <div
                    key={`${habit.id}-${day.dateStr}`}
                    className={cn(
                      "w-10 p-2 flex items-center justify-center border-r border-white/5",
                      day.isToday && "bg-cyan-500/10"
                    )}
                  >
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleCheck(habit.id, day.dateStr, isCompleted)}
                      className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200",
                        isCompleted
                          ? "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/30"
                          : "bg-white/5 hover:bg-white/10 border border-white/10"
                      )}
                    >
                      {isCompleted && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                    </motion.button>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
