export interface Lap {
  id: number
  splitMs: number
  totalMs: number
  note: string
  tags: string[]
}

export interface TagDefinition {
  name: string
  color: string
}

export interface SessionData {
  laps: Lap[]
  exportedAt: string
}

export function formatTime(ms: number, forceHours = false): string {
  const { main, millis } = formatTimeParts(ms, forceHours)
  return `${main}.${millis}`
}

export function formatTimeParts(ms: number, forceHours = false): { main: string; millis: string } {
  const millis = ms % 1000
  const totalSeconds = Math.floor(ms / 1000)
  const seconds = totalSeconds % 60
  const totalMinutes = Math.floor(totalSeconds / 60)
  const minutes = totalMinutes % 60
  const hours = Math.floor(totalMinutes / 60)

  const mm = String(minutes).padStart(2, "0")
  const ss = String(seconds).padStart(2, "0")
  const mmm = String(millis).padStart(3, "0")

  if (hours > 0 || forceHours) {
    const hh = String(hours).padStart(2, "0")
    return { main: `${hh}:${mm}:${ss}`, millis: mmm }
  }
  return { main: `${mm}:${ss}`, millis: mmm }
}

const STORAGE_KEY = "stopwatch-laps"
const TAGS_STORAGE_KEY = "stopwatch-tags"

export function saveLaps(laps: Lap[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(laps))
  } catch {}
}

export function loadLaps(): Lap[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed.map((l: Lap) => ({ ...l, tags: l.tags ?? [] }))
    }
  } catch {}
  return []
}

export function saveTagDefs(tags: TagDefinition[]) {
  try {
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags))
  } catch {}
}

export function loadTagDefs(): TagDefinition[] {
  try {
    const raw = localStorage.getItem(TAGS_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

export const TAG_COLORS = [
  "#ef6c6c", // red
  "#f0a055",  // orange
  "#f5c842",  // yellow
  "#4caf78",  // green
  "#4a9edd",  // blue
  "#9b6ee8",  // purple
  "#e06cb0",  // pink
  "#5bbfbf",  // teal
]

export function computeTagTotals(laps: Lap[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const lap of laps) {
    for (const tag of lap.tags) {
      map.set(tag, (map.get(tag) ?? 0) + lap.splitMs)
    }
  }
  return map
}

function formatDateForFileName(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}

function formatDateForDisplay(date: Date): string {
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function escapeMarkdownTableCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ")
}

export function getSessionFileName(date = new Date()): string {
  return `${formatDateForFileName(date)}-stopwatch.md`
}

export function exportSession(laps: Lap[], exportedAt = new Date()): string {
  const exportedAtDisplay = formatDateForDisplay(exportedAt)

  const header = [
    "# Stopwatch Session",
    "",
    `- Date: ${exportedAtDisplay}`,
    `- Total Laps: ${laps.length}`,
    "",
  ]

  const lapSection = [
    "## Laps",
    "",
    "| Lap | Split | Total Time | Tags | Note |",
    "| --- | ----- | ---------- | ---- | ---- |",
    ...laps.map((lap) => {
      const note = lap.note.trim() ? escapeMarkdownTableCell(lap.note.trim()) : "-"
      const tags = lap.tags.length > 0 ? lap.tags.map((t) => `\`${t}\``).join(" ") : "-"
      return `| ${lap.id} | ${formatTime(lap.splitMs)} | ${formatTime(lap.totalMs)} | ${tags} | ${note} |`
    }),
    "",
  ]

  // Tag summary
  const tagMap = computeTagTotals(laps)

  const tagSection: string[] = ["## Tag Summary", ""]
  if (tagMap.size > 0) {
    tagSection.push("| Tag | Time Spent |", "| --- | ---------- |")
    for (const [tag, ms] of tagMap.entries()) {
      tagSection.push(`| ${tag} | ${formatTime(ms)} |`)
    }
  } else {
    tagSection.push("- No tags used.")
  }
  tagSection.push("")

  const notesSection = [
    "## Notes",
    "",
    ...laps
      .filter((lap) => lap.note.trim().length > 0)
      .map((lap) => `- Lap ${lap.id}: ${lap.note.trim()}`),
  ]
  if (notesSection.length === 2) notesSection.push("- No notes added.")
  notesSection.push("")

  return [...header, ...lapSection, ...tagSection, ...notesSection].join("\n")
}

export function exportSessionAsJson(laps: Lap[]): string {
  const data: SessionData = {
    laps: laps.map((l) => ({ id: l.id, splitMs: l.splitMs, totalMs: l.totalMs, note: l.note, tags: l.tags })),
    exportedAt: new Date().toISOString(),
  }
  return JSON.stringify(data, null, 2)
}
