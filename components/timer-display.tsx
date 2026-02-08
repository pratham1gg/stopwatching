"use client"

import { formatTime } from "@/lib/stopwatch-utils"

interface TimerDisplayProps {
  elapsed: number
  isRunning: boolean
}

export function TimerDisplay({ elapsed, isRunning }: TimerDisplayProps) {
  const formatted = formatTime(elapsed)

  return (
    <div className="relative flex flex-col items-center gap-3 py-8">
      {/* Ghost digits for the "unlit segment" effect */}
      <div className="relative select-none" aria-label={`Timer: ${formatted}`}>
        <span
          className="block font-segment text-[5rem] leading-none tracking-wider text-[hsl(240,4%,12%)] sm:text-[6.5rem]"
          aria-hidden="true"
        >
          88:88.88
        </span>
        <span
          className={`absolute inset-0 block font-segment text-[5rem] leading-none tracking-wider sm:text-[6.5rem] transition-colors duration-150 ${
            isRunning ? "text-[#5cb85c] drop-shadow-[0_0_20px_rgba(92,184,92,0.4)]" : "text-[#8bc9a3]"
          }`}
        >
          {formatted}
        </span>
      </div>
      {/* Running indicator dot */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-block h-2 w-2 rounded-full transition-colors duration-300 ${
            isRunning ? "bg-[#5cb85c] shadow-[0_0_6px_rgba(92,184,92,0.6)]" : "bg-muted-foreground/30"
          }`}
        />
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          {isRunning ? "Running" : elapsed > 0 ? "Paused" : "Ready"}
        </span>
      </div>
    </div>
  )
}
