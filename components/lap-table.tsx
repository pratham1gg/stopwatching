"use client"

import { formatTime } from "@/lib/stopwatch-utils"
import type { Lap } from "@/lib/stopwatch-utils"

interface LapTableProps {
  laps: Lap[]
  onUpdateNote: (id: number, note: string) => void
}

export function LapTable({ laps, onUpdateNote }: LapTableProps) {
  if (laps.length === 0) return null

  // Reverse-chronological: newest at top
  const sorted = [...laps].reverse()

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border/50 bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-3 font-medium">Lap</th>
            <th className="px-4 py-3 font-medium">Time</th>
            <th className="px-4 py-3 font-medium">Total Time</th>
            <th className="px-4 py-3 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((lap, idx) => (
            <tr
              key={lap.id}
              className={`border-b border-border/30 transition-colors hover:bg-secondary/50 ${
                idx === 0 ? "bg-secondary/30" : ""
              }`}
            >
              <td className="px-4 py-3 font-mono text-muted-foreground">
                #{lap.id}
              </td>
              <td className="px-4 py-3 font-mono text-foreground">
                {formatTime(lap.splitMs)}
              </td>
              <td className="px-4 py-3 font-mono text-foreground">
                {formatTime(lap.totalMs)}
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={lap.note}
                  onChange={(e) => onUpdateNote(lap.id, e.target.value)}
                  placeholder="Add a note..."
                  className="w-full rounded-md border border-border/50 bg-background/50 px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
