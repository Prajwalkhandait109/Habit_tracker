"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getWinterArcDates } from "@/lib/utils";

interface HeatmapData {
  date: string;
  value: number;
}

interface HeatmapProps {
  data: HeatmapData[];
  year: number;
}

export function Heatmap({ data, year }: HeatmapProps) {
  const { start, end } = useMemo(() => getWinterArcDates(year), [year]);
  
  // Generate all dates in Winter Arc
  const allDates = useMemo(() => {
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, [start, end]);

  // Group dates by month
  const months = useMemo(() => {
    const monthGroups: { month: number; dates: Date[] }[] = [];
    let currentMonth = -1;
    let currentGroup: Date[] = [];

    for (const date of allDates) {
      if (date.getMonth() !== currentMonth) {
        if (currentGroup.length > 0) {
          monthGroups.push({
            month: currentMonth,
            dates: currentGroup,
          });
        }
        currentMonth = date.getMonth();
        currentGroup = [];
      }
      currentGroup.push(date);
    }

    if (currentGroup.length > 0) {
      monthGroups.push({
        month: currentMonth,
        dates: currentGroup,
      });
    }

    return monthGroups;
  }, [allDates]);

  // Get intensity color based on value
  const getIntensityColor = (value: number) => {
    if (value === 0) return "bg-slate-800/50";
    if (value <= 25) return "bg-cyan-900/50";
    if (value <= 50) return "bg-cyan-700/50";
    if (value <= 75) return "bg-cyan-500/50";
    return "bg-cyan-400/50";
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="glass rounded-xl p-6 overflow-x-auto">
      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mb-4 text-xs text-white/60">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-slate-800/50" />
          <div className="w-3 h-3 rounded-sm bg-cyan-900/50" />
          <div className="w-3 h-3 rounded-sm bg-cyan-700/50" />
          <div className="w-3 h-3 rounded-sm bg-cyan-500/50" />
          <div className="w-3 h-3 rounded-sm bg-cyan-400/50" />
        </div>
        <span>More</span>
      </div>

      {/* Heatmap Grid */}
      <div className="flex gap-4">
        {/* Day labels */}
        <div className="flex flex-col gap-1 pt-8">
          {dayNames.map((day) => (
            <div key={day} className="h-3 text-[10px] text-white/40 leading-3">
              {day}
            </div>
          ))}
        </div>

        {/* Month columns */}
        <div className="flex gap-1">
          {months.map((monthGroup) => (
            <div key={monthGroup.month} className="flex flex-col gap-1">
              {/* Month label */}
              <div className="text-[10px] text-white/60 mb-1 text-center">
                {new Date(2000, monthGroup.month).toLocaleString("default", { month: "short" })}
              </div>
              
              {/* Weeks */}
              <div className="flex flex-col gap-1">
                {Array.from({ length: Math.ceil(monthGroup.dates.length / 7) }).map((_, weekIndex) => (
                  <div key={weekIndex} className="flex gap-1">
                    {monthGroup.dates
                      .slice(weekIndex * 7, (weekIndex + 1) * 7)
                      .map((date) => {
                        const dateStr = date.toISOString().split("T")[0];
                        // Calculate value based on completed habits for this date
                        const value = Math.floor(Math.random() * 100); // Placeholder
                        const isToday = date.toDateString() === new Date().toDateString();

                        return (
                          <motion.div
                            key={dateStr}
                            whileHover={{ scale: 1.2 }}
                            className={cn(
                              "w-3 h-3 rounded-sm cursor-pointer transition-colors",
                              getIntensityColor(value),
                              isToday && "ring-1 ring-cyan-400 ring-offset-1 ring-offset-slate-900"
                            )}
                            title={`${dateStr}: ${value}% completed`}
                          />
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
