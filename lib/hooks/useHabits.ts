import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Habit, DailyProgress } from "@/db/schema";

interface HabitsData {
  habits: Habit[];
  progress: [string, boolean][];
  dateRange: {
    start: string;
    end: string;
  };
}

// Fetch all habits with progress
export function useHabits(year?: number) {
  return useQuery<HabitsData>({
    queryKey: ["habits", year],
    queryFn: async () => {
      const response = await fetch(`/api/habits?year=${year || new Date().getFullYear()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch habits");
      }
      return response.json();
    },
  });
}

// Create a new habit
export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (habit: { name: string; color?: string; icon?: string }) => {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habit),
      });
      if (!response.ok) {
        throw new Error("Failed to create habit");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// Update a habit
export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Habit> }) => {
      const response = await fetch(`/api/habits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error("Failed to update habit");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// Delete a habit (soft delete)
export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/habits/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete habit");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// Reorder habits
export function useReorderHabits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (habitIds: number[]) => {
      // Update each habit's order
      const updates = habitIds.map((id, index) =>
        fetch(`/api/habits/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: index }),
        })
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}
