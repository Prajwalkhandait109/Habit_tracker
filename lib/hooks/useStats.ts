import { useQuery } from "@tanstack/react-query";
import { calculateStreak, calculateBestStreak, calculateWinterArcProgress } from "@/lib/utils";

interface Stats {
  totalHabits: number;
  todayCompletion: number;
  currentStreak: number;
  bestStreak: number;
  totalCompleted: number;
  totalPossible: number;
  winterArcProgress: number;
  daysRemaining: number;
  daysCompleted: number;
  winterArcScore: number;
  monthlyStats: {
    month: string;
    completion: number;
    totalDays: number;
  }[];
  habitStats: {
    habitId: number;
    habitName: string;
    completion: number;
    streak: number;
  }[];
}

export function useStats(year?: number) {
  return useQuery<Stats>({
    queryKey: ["stats", year],
    queryFn: async () => {
      const currentYear = year || new Date().getFullYear();
      const response = await fetch(`/api/stats?year=${currentYear}`);
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      return response.json();
    },
  });
}
