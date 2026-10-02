import { pgTable, serial, varchar, integer, boolean, date, timestamp, text, index } from "drizzle-orm/pg-core";

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  color: varchar("color", { length: 7 }).default("#22d3ee"),
  icon: varchar("icon", { length: 50 }).default("circle"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  orderIdx: index("habits_order_idx").on(table.order),
  activeIdx: index("habits_active_idx").on(table.isActive),
}));

export const dailyProgress = pgTable("daily_progress", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").references(() => habits.id, { onDelete: "cascade" }).notNull(),
  date: date("date").notNull(),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  habitDateIdx: index("daily_progress_habit_date_idx").on(table.habitId, table.date),
  dateIdx: index("daily_progress_date_idx").on(table.date),
}));

export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;
export type DailyProgress = typeof dailyProgress.$inferSelect;
export type NewDailyProgress = typeof dailyProgress.$inferInsert;
