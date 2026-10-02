import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function getDayName(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
}

export function getMonthName(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getWinterArcDates(year: number): { start: Date; end: Date } {
  // Winter Arc: October 1 to February 28/29
  const start = new Date(year, 9, 1); // October 1
  const end = new Date(year + 1, 1, year % 4 === 0 ? 29 : 28); // Feb 28/29
  return { start, end };
}

export function calculateStreak(completedDays: boolean[]): number {
  let streak = 0;
  for (let i = completedDays.length - 1; i >= 0; i--) {
    if (completedDays[i]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function calculateBestStreak(completedDays: boolean[]): number {
  let maxStreak = 0;
  let currentStreak = 0;
  
  for (const completed of completedDays) {
    if (completed) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return maxStreak;
}

export function getMotivationalQuote(): string {
  const quotes = [
    "Discipline compounds.",
    "Small steps, every day.",
    "Consistency beats intensity.",
    "The future you is watching.",
    "One day at a time.",
    "Progress, not perfection.",
    "Keep the momentum.",
    "Trust the process.",
    "Every checkmark counts.",
    "You're building something great.",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function calculateWinterArcProgress(
  startDate: Date,
  endDate: Date,
  currentDate: Date = new Date()
): number {
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
}
