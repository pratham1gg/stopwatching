export interface Lap {
  id: number
  splitMs: number
  totalMs: number
  note: string
}

export interface SessionData {
  laps: Lap[]
  exportedAt: string
}

/**
 * Formats milliseconds into MM:SS.cc (centiseconds)
 */
export function formatTime(ms: number): string {
  const totalCentiseconds = Math.floor(ms / 10)
  const centiseconds = totalCentiseconds % 100
  const totalSeconds = Math.floor(totalCentiseconds / 100)
  const seconds = totalSeconds % 60
  const minutes = Math.floor(totalSeconds / 60)

  const mm = String(minutes).padStart(2, "0")
  const ss = String(seconds).padStart(2, "0")
  const cc = String(centiseconds).padStart(2, "0")

  return `${mm}:${ss}.${cc}`
}

const STORAGE_KEY = "stopwatch-laps"

export function saveLaps(laps: Lap[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(laps))
  } catch {
    // Storage full or unavailable
  }
}

export function loadLaps(): Lap[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // Corrupted data
  }
  return []
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
  return `stopwatch-session-${formatDateForFileName(date)}.md`
}

export function exportSession(laps: Lap[], exportedAt = new Date()): string {
  const exportedAtIso = exportedAt.toISOString()
  const exportedAtDisplay = formatDateForDisplay(exportedAt)

  const header = [
    "# Stopwatch Session",
    "",
    `- Date: ${exportedAtDisplay}`,
    `- Exported At (ISO): ${exportedAtIso}`,
    `- Total Laps: ${laps.length}`,
    "",
  ]

  const lapSection = [
    "## Laps",
    "",
    "| Lap | Split Time | Total Time | Note |",
    "| --- | ---------- | ---------- | ---- |",
    ...laps.map((lap) => {
      const note = lap.note.trim() ? escapeMarkdownTableCell(lap.note.trim()) : "-"
      return `| ${lap.id} | ${formatTime(lap.splitMs)} | ${formatTime(lap.totalMs)} | ${note} |`
    }),
    "",
  ]

  const notesSection = [
    "## Notes",
    "",
    ...laps
      .filter((lap) => lap.note.trim().length > 0)
      .map((lap) => `- ${exportedAtDisplay} - Lap ${lap.id}: ${lap.note.trim()}`),
  ]

  if (notesSection.length === 2) {
    notesSection.push("- No notes added.")
  }

  notesSection.push("")

  return [...header, ...lapSection, ...notesSection].join("\n")
}

export function exportSessionAsJson(laps: Lap[]): string {
  const data: SessionData = {
    laps: laps.map((l) => ({
      id: l.id,
      splitMs: l.splitMs,
      totalMs: l.totalMs,
      note: l.note,
    })),
    exportedAt: new Date().toISOString(),
  }
  return JSON.stringify(data, null, 2)
}
