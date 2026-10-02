"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useHabits, useCreateHabit, useUpdateHabit, useDeleteHabit } from "@/lib/hooks/useHabits";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DEFAULT_COLORS = [
  "#22d3ee", "#34d399", "#f472b6", "#a78bfa", 
  "#fbbf24", "#f87171", "#60a5fa", "#a3e635",
];

export function HabitManager() {
  const { data: habitsData } = useHabits();
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const deleteHabit = useDeleteHabit();

  const [isOpen, setIsOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", color: DEFAULT_COLORS[0] });

  const habits = habitsData?.habits || [];

  const handleOpen = () => {
    setEditingHabit(null);
    setFormData({ name: "", color: DEFAULT_COLORS[0] });
    setIsOpen(true);
  };

  const handleEdit = (habit: any) => {
    setEditingHabit(habit);
    setFormData({ name: habit.name, color: habit.color || DEFAULT_COLORS[0] });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHabit) {
      await updateHabit.mutateAsync({ id: editingHabit.id, updates: formData });
    } else {
      await createHabit.mutateAsync(formData);
    }
    setIsOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this habit?")) {
      await deleteHabit.mutateAsync(id);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} variant="frost" size="sm" className="gap-2">
        <Plus className="w-4 h-4" />
        Manage Habits
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingHabit ? "Edit Habit" : "New Habit"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="e.g., Read 30 min"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Color</label>
              <div className="flex gap-2 flex-wrap">
                {DEFAULT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all",
                      formData.color === color
                        ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110"
                        : "hover:scale-110"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-white/70 hover:text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button type="submit" variant="winter" className="flex-1">
                {editingHabit ? "Save" : "Create"}
              </Button>
            </div>
          </form>

          {/* Existing Habits */}
          {!editingHabit && habits.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-sm font-medium text-white/70 mb-4">Your Habits</h4>
              <div className="space-y-2">
                {habits.map((habit: any) => (
                  <motion.div
                    key={habit.id}
                    layout
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                      <span className="text-sm text-white/90">{habit.name}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(habit)}
                        className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(habit.id)}
                        className="p-1.5 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
