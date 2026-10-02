import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DailyProgress } from "@/db/schema";

// Update progress for a habit on a specific date
export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      habitId,
      date,
      completed,
    }: {
      habitId: number;
      date: string;
      completed: boolean;
    }) => {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, date, completed }),
      });
      if (!response.ok) {
        throw new Error("Failed to update progress");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

// Toggle progress (convenience method)
export function useToggleProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      habitId,
      date,
      currentCompleted,
    }: {
      habitId: number;
      date: string;
      currentCompleted: boolean;
    }) => {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitId,
          date,
          completed: !currentCompleted,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to toggle progress");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

// Bulk update progress for multiple habits
export function useBulkUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      updates,
    }: {
      updates: { habitId: number; date: string; completed: boolean }[];
    }) => {
      const promises = updates.map(({ habitId, date, completed }) =>
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ habitId, date, completed }),
        })
      );
      const results = await Promise.all(promises);
      return results.map(r => r.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
