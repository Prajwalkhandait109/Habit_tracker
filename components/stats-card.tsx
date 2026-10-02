"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-slate-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative overflow-hidden rounded-xl glass p-5 group",
        "hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300",
        className
      )}
    >
      {/* Glow effect */}
      <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/60">{title}</p>
            <motion.h3
              key={value}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-white mt-1"
            >
              {value}
            </motion.h3>
            <p className="text-xs text-white/40 mt-1">{description}</p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              "bg-gradient-to-br from-cyan-500/20 to-blue-500/20",
              "text-cyan-400"
            )}>
              {icon}
            </div>
            <TrendIcon className={cn("w-4 h-4", trendColor)} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
