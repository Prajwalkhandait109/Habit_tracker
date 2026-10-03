"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Snowflake, 
  Calendar, 
  Flame, 
  Target, 
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useHabits } from "@/lib/hooks/useHabits";
import { useStats } from "@/lib/hooks/useStats";
import { getWinterArcDates, getMotivationalQuote, formatShortDate } from "@/lib/utils";
import { StatsCard } from "@/components/stats-card";
import { ProgressBar } from "@/components/progress-bar";
import { HabitTracker } from "@/components/habit-tracker";
import { HabitManager } from "@/components/habit-manager";
import { Heatmap } from "@/components/heatmap";
import { Button } from "@/components/ui/button";
import { UsernameLogin } from "@/components/username-login";
import { useLogout, useSession } from "@/lib/hooks/useSession";

export default function WinterArcPage() {
  const { data: user, isPending, isError } = useSession();

  if (isPending) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-white/50">Loading profile...</div>;
  }
  if (isError) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-rose-300">Could not load profile. Refresh to try again.</div>;
  }
  if (!user) return <UsernameLogin />;

  return <WinterArcDashboard username={user.username} />;
}

function WinterArcDashboard({ username }: { username: string }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const logout = useLogout();
  
  const { data: habitsData, isLoading: habitsLoading } = useHabits(selectedYear);
  const { data: stats, isLoading: statsLoading } = useStats(selectedYear);
  
  const { start: winterStart, end: winterEnd } = useMemo(
    () => getWinterArcDates(selectedYear),
    [selectedYear]
  );

  const quote = useMemo(() => getMotivationalQuote(), []);

  const isLoading = habitsLoading || statsLoading;

  const navigateYear = (direction: "prev" | "next") => {
    setSelectedYear(prev => direction === "prev" ? prev - 1 : prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/5 to-transparent" />
        
        {/* Animated snowflakes */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${(i * 47 + 13) % 100}%`,
              top: `-10px`,
            }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, ((i * 17) % 50) - 25],
            }}
            transition={{
              duration: 10 + (i * 7) % 10,
              repeat: Infinity,
              ease: "linear",
              delay: (i * 3) % 10,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/winter-arc-mark.svg"
                alt="Winter Arc logo"
                width={48}
                height={48}
                priority
              />
              <div>
                <h1 className="text-2xl font-bold text-gradient">Winter Arc</h1>
                <p className="text-sm text-white/50">October → February</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-white/60 sm:inline">{username}</span>
              <Button
                variant="ghost"
                size="icon"
                title="Switch username"
                aria-label="Switch username"
                className="h-8 w-8 text-white/60 hover:bg-white/10 hover:text-white"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                <LogOut className="h-4 w-4" />
              </Button>
              {/* Year Navigator */}
              <div className="flex items-center gap-2 glass rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => navigateYear("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-white px-2 min-w-[80px] text-center">
                  {selectedYear}-{selectedYear + 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => navigateYear("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <HabitManager />
            </div>
          </div>

          {/* Motivational Quote */}
          <motion.p
            key={quote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-lg text-cyan-300/80 font-medium"
          >
            "{quote}"
          </motion.p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Overview */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 glass rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Winter Arc Progress"
                value={`${Math.round(stats?.winterArcProgress || 0)}%`}
                description={`${stats?.daysRemaining || 0} days remaining`}
                icon={<Target className="w-5 h-5" />}
                trend="neutral"
              />
              <StatsCard
                title="Today's Completion"
                value={`${Math.round(stats?.todayCompletion || 0)}%`}
                description={`${Math.round((stats?.todayCompletion || 0) / 100 * (stats?.totalHabits || 0))}/${stats?.totalHabits || 0} habits`}
                icon={<TrendingUp className="w-5 h-5" />}
                trend={stats?.todayCompletion === 100 ? "up" : "neutral"}
              />
              <StatsCard
                title="Current Streak"
                value={`${stats?.currentStreak || 0}`}
                description={`Best: ${stats?.bestStreak || 0} days`}
                icon={<Flame className="w-5 h-5" />}
                trend={(stats?.currentStreak ?? 0) > 0 ? "up" : "neutral"}
              />
              <StatsCard
                title="Winter Arc Score"
                value={`${stats?.winterArcScore || 0}`}
                description={`${stats?.totalCompleted || 0}/${stats?.totalPossible || 0} total`}
                icon={<Snowflake className="w-5 h-5" />}
                trend={(stats?.winterArcScore ?? 0) > 50 ? "up" : "neutral"}
              />
            </div>
          )}

          {/* Progress Bar */}
          {!isLoading && stats && (
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">Winter Arc Journey</h3>
                <span className="text-sm text-cyan-400">
                  {formatShortDate(winterStart)} → {formatShortDate(winterEnd)}
                </span>
              </div>
              <ProgressBar 
                value={stats.winterArcProgress} 
                markers={[
                  { position: 0, label: "Oct" },
                  { position: 20, label: "Nov" },
                  { position: 40, label: "Dec" },
                  { position: 60, label: "Jan" },
                  { position: 80, label: "Feb" },
                ]}
              />
            </div>
          )}

          {/* Habit Tracker */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                Daily Tracker
              </h2>
            </div>
            <HabitTracker year={selectedYear} />
          </div>

          {/* Heatmap */}
          {!isLoading && stats && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                Activity Heatmap
              </h2>
              <Heatmap 
                data={stats.habitStats.flatMap(h => 
                  // This would be populated with actual daily data
                  []
                )} 
                year={selectedYear}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
