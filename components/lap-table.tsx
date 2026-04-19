"use client"

import { formatTime, computeTagTotals } from "@/lib/stopwatch-utils"
import type { Lap, TagDefinition } from "@/lib/stopwatch-utils"
import { TagPicker } from "@/components/tag-picker"

interface LapTableProps {
  laps: Lap[]
  tagDefs: TagDefinition[]
  onUpdateNote: (id: number, note: string) => void
  onUpdateTags: (id: number, tags: string[]) => void
  onAddTag: (name: string) => TagDefinition
}

const FALLBACK_COLOR = "#888"

function TagSummary({ laps, tagDefs }: { laps: Lap[]; tagDefs: TagDefinition[] }) {
  const tagMap = computeTagTotals(laps)
  if (tagMap.size === 0) return null

  const entries = Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1])
  const total = entries.reduce((s, [, ms]) => s + ms, 0)

  return (
    <div className="w-full rounded-xl border border-border/40 bg-secondary/30 p-4">
      <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground/50">Tag summary</p>
      <div className="space-y-2">
        {entries.map(([name, ms]) => {
          const color = tagDefs.find((t) => t.name === name)?.color ?? FALLBACK_COLOR
          const pct = total > 0 ? (ms / total) * 100 : 0
          return (
            <div key={name} className="flex items-center gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
              <span className="w-24 truncate text-xs text-foreground">{name}</span>
              <div className="flex-1 overflow-hidden rounded-full bg-border/40" style={{ height: 4 }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
              <span className="w-20 text-right font-mono text-xs tabular-nums text-muted-foreground">
                {formatTime(ms)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function LapTable({ laps, tagDefs, onUpdateNote, onUpdateTags, onAddTag }: LapTableProps) {
  if (laps.length === 0) return null

  const sorted = [...laps].reverse()

  return (
    <div className="w-full space-y-4">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border/30 text-left text-[11px] uppercase tracking-[0.15em] text-muted-foreground/50">
            <th className="pb-2 pr-4 font-medium">Lap</th>
            <th className="pb-2 pr-4 font-medium">Split</th>
            <th className="pb-2 pr-4 font-medium">Total</th>
            <th className="pb-2 pr-4 font-medium">Tags</th>
            <th className="pb-2 font-medium">Note</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((lap, idx) => (
            <tr
              key={lap.id}
              className={`border-b border-border/20 transition-colors hover:bg-secondary/30 ${
                idx === 0 ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <td className="py-2.5 pr-4 font-mono text-xs">{lap.id}</td>
              <td className="py-2.5 pr-4 font-mono text-xs tabular-nums">{formatTime(lap.splitMs)}</td>
              <td className="py-2.5 pr-4 font-mono text-xs tabular-nums">{formatTime(lap.totalMs)}</td>
              <td className="py-2.5 pr-4">
                <TagPicker lap={lap} tagDefs={tagDefs} onUpdateTags={onUpdateTags} onAddTag={onAddTag} />
              </td>
              <td className="py-2.5 align-top">
                <textarea
                  value={lap.note}
                  onChange={(e) => {
                    onUpdateNote(lap.id, e.target.value)
                    e.target.style.height = "auto"
                    e.target.style.height = e.target.scrollHeight + "px"
                  }}
                  onFocus={(e) => {
                    e.target.style.height = "auto"
                    e.target.style.height = e.target.scrollHeight + "px"
                  }}
                  rows={1}
                  placeholder="note…"
                  className="w-full resize-none overflow-hidden bg-transparent text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TagSummary laps={laps} tagDefs={tagDefs} />
    </div>
  )
}
