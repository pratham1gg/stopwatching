"use client"

import { useState, useEffect, useRef } from "react"
import { Globe, Plus, X, ChevronLeft } from "lucide-react"

const STORAGE_KEY = "stopwatch-world-clocks"
const SIDEBAR_STATE_KEY = "stopwatch-sidebar-open"

const COMMON_TIMEZONES: { id: string; label: string; gmt: string }[] = [
  { id: "Pacific/Honolulu", label: "Honolulu", gmt: "GMT-10" },
  { id: "America/Anchorage", label: "Anchorage", gmt: "GMT-9" },
  { id: "America/Los_Angeles", label: "Los Angeles", gmt: "GMT-8" },
  { id: "America/Denver", label: "Denver", gmt: "GMT-7" },
  { id: "America/Chicago", label: "Chicago", gmt: "GMT-6" },
  { id: "America/Mexico_City", label: "Mexico City", gmt: "GMT-6" },
  { id: "America/New_York", label: "New York", gmt: "GMT-5" },
  { id: "America/Toronto", label: "Toronto", gmt: "GMT-5" },
  { id: "America/Argentina/Buenos_Aires", label: "Buenos Aires", gmt: "GMT-3" },
  { id: "America/Sao_Paulo", label: "São Paulo", gmt: "GMT-3" },
  { id: "Atlantic/Reykjavik", label: "Reykjavik", gmt: "GMT+0" },
  { id: "Europe/London", label: "London", gmt: "GMT+0" },
  { id: "Europe/Paris", label: "Paris", gmt: "GMT+1" },
  { id: "Europe/Berlin", label: "Berlin", gmt: "GMT+1" },
  { id: "Europe/Madrid", label: "Madrid", gmt: "GMT+1" },
  { id: "Europe/Rome", label: "Rome", gmt: "GMT+1" },
  { id: "Europe/Amsterdam", label: "Amsterdam", gmt: "GMT+1" },
  { id: "Europe/Zurich", label: "Zurich", gmt: "GMT+1" },
  { id: "Europe/Stockholm", label: "Stockholm", gmt: "GMT+1" },
  { id: "Europe/Istanbul", label: "Istanbul", gmt: "GMT+3" },
  { id: "Europe/Moscow", label: "Moscow", gmt: "GMT+3" },
  { id: "Africa/Lagos", label: "Lagos", gmt: "GMT+1" },
  { id: "Africa/Cairo", label: "Cairo", gmt: "GMT+2" },
  { id: "Africa/Johannesburg", label: "Johannesburg", gmt: "GMT+2" },
  { id: "Asia/Dubai", label: "Dubai", gmt: "GMT+4" },
  { id: "Asia/Karachi", label: "Karachi", gmt: "GMT+5" },
  { id: "Asia/Kolkata", label: "Kolkata", gmt: "GMT+5:30" },
  { id: "Asia/Dhaka", label: "Dhaka", gmt: "GMT+6" },
  { id: "Asia/Bangkok", label: "Bangkok", gmt: "GMT+7" },
  { id: "Asia/Singapore", label: "Singapore", gmt: "GMT+8" },
  { id: "Asia/Hong_Kong", label: "Hong Kong", gmt: "GMT+8" },
  { id: "Asia/Shanghai", label: "Shanghai", gmt: "GMT+8" },
  { id: "Asia/Seoul", label: "Seoul", gmt: "GMT+9" },
  { id: "Asia/Tokyo", label: "Tokyo", gmt: "GMT+9" },
  { id: "Australia/Sydney", label: "Sydney", gmt: "GMT+11" },
  { id: "Australia/Melbourne", label: "Melbourne", gmt: "GMT+11" },
  { id: "Pacific/Auckland", label: "Auckland", gmt: "GMT+12" },
]

function getDefaultTimezones(): string[] {
  const local = Intl.DateTimeFormat().resolvedOptions().timeZone
  const defaults = [local, "America/New_York", "Europe/London", "Asia/Tokyo"]
  return [...new Set(defaults)]
}

function loadTimezones(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return getDefaultTimezones()
}

function saveTimezones(tzs: string[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tzs)) } catch {}
}

function loadSidebarOpen(): boolean {
  try {
    const raw = localStorage.getItem(SIDEBAR_STATE_KEY)
    if (raw !== null) return raw === "true"
  } catch {}
  return false
}

function labelForTimezone(id: string): string {
  const found = COMMON_TIMEZONES.find((t) => t.id === id)
  if (found) return found.label
  const parts = id.split("/")
  return parts[parts.length - 1].replace(/_/g, " ")
}

function formatClockTime(tz: string, now: Date): { time: string; date: string } {
  const time = now.toLocaleTimeString("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
  const date = now.toLocaleDateString("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" })
  return { time, date }
}

function ClockCard({ tz, now, onRemove }: { tz: string; now: Date; onRemove: () => void }) {
  const { time, date } = formatClockTime(tz, now)
  const label = labelForTimezone(tz)

  return (
    <div className="group flex items-center justify-between rounded-xl bg-secondary/40 px-3 py-2.5">
      <div>
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="font-mono text-lg tabular-nums leading-tight text-foreground">{time}</p>
        <p className="text-[11px] text-muted-foreground/60">{date}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-1 text-muted-foreground/30 opacity-0 transition-all hover:bg-secondary hover:text-foreground group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function AddTimezone({ existing, onAdd }: { existing: string[]; onAdd: (tz: string) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  const filtered = COMMON_TIMEZONES.filter(
    (t) => !existing.includes(t.id) && (query === "" || t.label.toLowerCase().includes(query.toLowerCase()) || t.gmt.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border/50 py-2 text-xs text-muted-foreground/50 transition-colors hover:border-border hover:text-foreground"
      >
        <Plus className="h-3 w-3" />
        Add timezone
      </button>

      {open && (
        <div className="absolute bottom-10 left-0 z-50 w-full rounded-xl border border-border bg-background shadow-lg">
          <div className="p-2">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") setOpen(false) }}
              placeholder="Search city…"
              className="w-full rounded-lg border border-border/50 bg-secondary/50 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="max-h-48 overflow-y-auto px-1 pb-1">
            {filtered.map((tz) => (
              <button
                key={tz.id}
                type="button"
                onClick={() => { onAdd(tz.id); setQuery(""); setOpen(false) }}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-secondary"
              >
                <span className="text-foreground">{tz.label}</span>
                <span className="text-[10px] text-muted-foreground/50">{tz.gmt}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-2 py-2 text-[11px] text-muted-foreground/50">No results.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function WorldClockSidebar() {
  const [open, setOpen] = useState(false)
  const [timezones, setTimezones] = useState<string[]>([])
  const [now, setNow] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimezones(loadTimezones())
    setOpen(loadSidebarOpen())
    setMounted(true)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (mounted) saveTimezones(timezones)
  }, [timezones, mounted])

  useEffect(() => {
    if (mounted) {
      try { localStorage.setItem(SIDEBAR_STATE_KEY, String(open)) } catch {}
    }
  }, [open, mounted])

  function addTimezone(tz: string) {
    if (!timezones.includes(tz)) setTimezones((prev) => [...prev, tz])
  }

  function removeTimezone(tz: string) {
    setTimezones((prev) => prev.filter((t) => t !== tz))
  }

  return (
    <>
      {/* Toggle button — always visible */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle world clock"
        className="fixed left-4 top-4 z-40 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {open ? <ChevronLeft className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`shrink-0 h-full border-r border-border/30 bg-background transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "w-72" : "w-0"
        }`}
      >
        <div className="flex h-full w-72 flex-col px-4 pt-14 pb-4">
          <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground/50">World Clock</p>

          <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
            {timezones.map((tz) => (
              <ClockCard key={tz} tz={tz} now={now} onRemove={() => removeTimezone(tz)} />
            ))}
          </div>

          <div className="mt-3 shrink-0">
            <AddTimezone existing={timezones} onAdd={addTimezone} />
          </div>
        </div>
      </div>
    </>
  )
}
