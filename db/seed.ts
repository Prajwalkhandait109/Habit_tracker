import { db } from "./index";
import { habits, users } from "./schema";
import { eq } from "drizzle-orm";

const defaultHabits = [
  { name: "Wake up early", color: "#fbbf24", icon: "sun", order: 0 },
  { name: "Workout", color: "#f87171", icon: "dumbbell", order: 1 },
  { name: "Study / Learn", color: "#a78bfa", icon: "book", order: 2 },
  { name: "Coding", color: "#60a5fa", icon: "code", order: 3 },
  { name: "Read", color: "#34d399", icon: "book-open", order: 4 },
  { name: "Meditation", color: "#f472b6", icon: "sparkles", order: 5 },
  { name: "Drink enough water", color: "#22d3ee", icon: "droplet", order: 6 },
  { name: "No junk food", color: "#a3e635", icon: "apple", order: 7 },
  { name: "Sleep on time", color: "#818cf8", icon: "moon", order: 8 },
  { name: "No unnecessary scrolling", color: "#fb923c", icon: "smartphone", order: 9 },
];

export async function seedHabits() {
  console.log("Seeding default habits...");

  await db.insert(users).values({ username: "default" }).onConflictDoNothing();
  const user = await db.query.users.findFirst({ where: eq(users.username, "default") });
  if (!user) throw new Error("Could not find default user");
  
  for (const habit of defaultHabits) {
    try {
      await db.insert(habits).values({ ...habit, userId: user.id }).onConflictDoNothing();
    } catch (error) {
      console.error(`Failed to seed habit "${habit.name}":`, error);
    }
  }
  
  console.log("Seeding complete!");
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedHabits().then(() => process.exit(0));
}
