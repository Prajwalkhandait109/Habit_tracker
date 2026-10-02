# Winter Arc Tracker

A premium dark-themed habit tracking web application designed for the Winter Arc - October through February. Built with Next.js, TypeScript, Tailwind CSS, and Neon PostgreSQL.

## Features

- **Daily Habit Tracking**: Check/uncheck habits for each day with satisfying animations
- **Habit Management**: Add, edit, delete, and reorder habits
- **Dashboard Stats**: Winter Arc progress, streaks, completion percentages
- **Activity Heatmap**: GitHub-style visualization of your consistency
- **Dark Winter Theme**: Premium dark aesthetic with frost/glass effects
- **Auto-save**: Progress saved automatically via API

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Drizzle ORM
- Neon PostgreSQL
- Framer Motion
- TanStack Query (React Query)

## Getting Started

### Prerequisites

- Node.js 18+
- Neon PostgreSQL database

### Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Installation

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Seed default habits (optional)
# Add seed script if needed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Add environment variables:
   - `DATABASE_URL`: Your Neon database connection string
4. Deploy!

The `render.yaml` file is included for infrastructure-as-code deployment.

## Default Habits

The app comes with these pre-configured habits:

1. Wake up early
2. Workout
3. Study / Learn
4. Coding
5. Read
6. Meditation
7. Drink enough water
8. No junk food
9. Sleep on time
10. No unnecessary scrolling

## Winter Arc Period

**October 1 → February 28/29**

The tracker is designed specifically for the Winter Arc - the period when discipline matters most.

## License

MIT License - feel free to use this for your own tracking needs!

---

Built with discipline in mind. Keep the streak alive.
