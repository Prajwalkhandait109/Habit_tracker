"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  markers?: { position: number; label: string }[];
  className?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  markers = [],
  className,
  showPercentage = false,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {/* Progress track */}
      <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden">
        {/* Animated progress fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </motion.div>

        {/* Markers */}
        {markers.map((marker, index) => (
          <div
            key={index}
            className="absolute top-0 h-full w-0.5 bg-white/20"
            style={{ left: `${marker.position}%` }}
          />
        ))}
      </div>

      {/* Labels */}
      {markers.length > 0 && (
        <div className="relative mt-2 h-6">
          {markers.map((marker, index) => (
            <span
              key={index}
              className="absolute text-xs text-white/50 transform -translate-x-1/2"
              style={{ left: `${marker.position}%` }}
            >
              {marker.label}
            </span>
          ))}
        </div>
      )}

      {/* Percentage display */}
      {showPercentage && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-white/40">0%</span>
          <span className="text-xs font-medium text-cyan-400">
            {Math.round(percentage)}%
          </span>
          <span className="text-xs text-white/40">100%</span>
        </div>
      )}
    </div>
  );
}
