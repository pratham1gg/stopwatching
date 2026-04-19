"use client"

import { formatTimeParts } from "@/lib/stopwatch-utils"

interface TimerDisplayProps {
  elapsed: number
  isRunning: boolean
}

export function TimerDisplay({ elapsed, isRunning }: TimerDisplayProps) {
  const showHours = elapsed >= 3_600_000
  const { main, millis } = formatTimeParts(elapsed)
  const ghostMain = showHours ? "88:88:88" : "88:88"
  const ghostMs = "888"

  const colorClass = isRunning
    ? "text-[#4caf78] drop-shadow-[0_0_20px_rgba(76,175,120,0.3)] dark:text-[#5dbb87] dark:drop-shadow-[0_0_24px_rgba(93,187,135,0.4)]"
    : elapsed > 0
    ? "text-[#d9534f]/80 dark:text-[#e87c76]"
    : "text-[#d9534f]/40 dark:text-[#e87c76]/50"

  const ghostColor = "text-black/[0.06] dark:text-[hsl(240,4%,11%)]"

  return (
    <div className="relative flex flex-col items-center gap-4 py-6">
      <div
        className="relative select-none flex items-baseline gap-0"
        aria-label={`Timer: ${main}.${millis}`}
      >
        {/* Main digits (MM:SS or HH:MM:SS) */}
        <div className="relative">
          <span
            className={`block font-segment text-[4.5rem] leading-none tracking-widest sm:text-[6rem] ${ghostColor}`}
            aria-hidden="true"
          >
            {ghostMain}
          </span>
          <span
            className={`absolute inset-0 block font-segment text-[4.5rem] leading-none tracking-widest sm:text-[6rem] transition-all duration-150 ${colorClass}`}
          >
            {main}
          </span>
        </div>

        {/* Milliseconds — smaller */}
        <div className="relative mb-1 sm:mb-1.5">
          <span
            className={`block font-segment text-[2rem] leading-none tracking-widest sm:text-[2.6rem] ${ghostColor}`}
            aria-hidden="true"
          >
            .{ghostMs}
          </span>
          <span
            className={`absolute inset-0 block font-segment text-[2rem] leading-none tracking-widest sm:text-[2.6rem] transition-all duration-150 ${colorClass}`}
          >
            .{millis}
          </span>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full transition-all duration-300 ${
            isRunning
              ? "bg-[#4caf78] shadow-[0_0_6px_rgba(76,175,120,0.6)] dark:bg-[#5dbb87] dark:shadow-[0_0_6px_rgba(93,187,135,0.7)]"
              : "bg-foreground/20"
          }`}
        />
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
          {isRunning ? "Running" : elapsed > 0 ? "Paused" : "Ready"}
        </span>
      </div>
    </div>
  )
}
