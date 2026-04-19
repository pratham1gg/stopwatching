"use client"

import { useState, useEffect } from "react"
import { Download, Github } from "lucide-react"
import { TimerDisplay } from "@/components/timer-display"
import { LapTable } from "@/components/lap-table"
import { GitHubModal } from "@/components/github-modal"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTimer } from "@/hooks/use-timer"
import {
  saveLaps, loadLaps, exportSession, getSessionFileName,
  saveTagDefs, loadTagDefs, TAG_COLORS,
} from "@/lib/stopwatch-utils"
import type { Lap, TagDefinition } from "@/lib/stopwatch-utils"

export function Stopwatch() {
  const { elapsed, isRunning, start, stop, reset: resetTimer } = useTimer()
  const [laps, setLaps] = useState<Lap[]>([])
  const [tagDefs, setTagDefs] = useState<TagDefinition[]>([])
  const [showGitHub, setShowGitHub] = useState(false)

  useEffect(() => {
    setLaps(loadLaps())
    setTagDefs(loadTagDefs())
  }, [])

  useEffect(() => {
    if (laps.length > 0) saveLaps(laps)
  }, [laps])

  useEffect(() => {
    saveTagDefs(tagDefs)
  }, [tagDefs])

  function recordLap(currentElapsed: number) {
    setLaps((prev) => {
      const prevTotal = prev.length > 0 ? prev[prev.length - 1].totalMs : 0
      return [...prev, { id: prev.length + 1, splitMs: currentElapsed - prevTotal, totalMs: currentElapsed, note: "", tags: [] }]
    })
  }

  function handleStartStop() {
    if (isRunning) {
      const { finalElapsed } = stop()
      recordLap(finalElapsed)
    } else {
      start()
    }
  }

  function handleLap() {
    recordLap(elapsed)
  }

  function handleReset() {
    resetTimer()
    setLaps([])
    saveLaps([])
  }

  function handleUpdateNote(id: number, note: string) {
    setLaps((prev) => prev.map((l) => (l.id === id ? { ...l, note } : l)))
  }

  function handleUpdateTags(id: number, tags: string[]) {
    setLaps((prev) => prev.map((l) => (l.id === id ? { ...l, tags } : l)))
  }

  function handleAddTag(name: string): TagDefinition {
    const existing = tagDefs.find((t) => t.name.toLowerCase() === name.toLowerCase())
    if (existing) return existing
    const def: TagDefinition = { name: name.trim(), color: TAG_COLORS[tagDefs.length % TAG_COLORS.length] }
    setTagDefs((prev) => [...prev, def])
    return def
  }

  function handleSaveSession() {
    const exportedAt = new Date()
    const blob = new Blob([exportSession(laps, exportedAt)], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = getSessionFileName(exportedAt)
    a.click()
    URL.revokeObjectURL(url)
  }

  const canReset = elapsed > 0 || laps.length > 0

  const btnBase = "h-14 w-36 rounded-2xl text-sm font-semibold tracking-wide shadow-md transition-all duration-150 active:scale-95 sm:h-16 sm:w-40 sm:text-base"
  const btnSecondary = `${btnBase} bg-secondary text-secondary-foreground ring-1 ring-border/60 hover:bg-secondary/70`
  const btnGreen = `${btnBase} bg-[#4caf78] text-white hover:bg-[#3fa06a] dark:bg-[#3d9e65] dark:hover:bg-[#359059]`
  const btnRed   = `${btnBase} bg-[#d9534f] text-white hover:bg-[#c9403c] dark:bg-[#c0392b] dark:hover:bg-[#a93226]`

  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col items-center px-4 py-4 sm:py-6">

      <div className="w-full flex justify-end shrink-0">
        <ThemeToggle />
      </div>

      <div className="shrink-0">
        <TimerDisplay elapsed={elapsed} isRunning={isRunning} />
      </div>

      <div className="flex items-center gap-4 shrink-0 py-4">
        {isRunning ? (
          <>
            <button type="button" onClick={handleLap} className={btnSecondary}>Lap</button>
            <button type="button" onClick={handleStartStop} className={btnGreen}>Stop</button>
          </>
        ) : (
          <>
            <button type="button" onClick={handleReset} disabled={!canReset}
              className={`${btnSecondary} disabled:cursor-not-allowed disabled:opacity-25`}>
              Reset
            </button>
            <button type="button" onClick={handleStartStop} className={btnRed}>Start</button>
          </>
        )}
      </div>

      {/* Scrollable area for laps + actions */}
      <div className="mt-4 flex w-full min-h-0 flex-1 flex-col items-center gap-4 overflow-y-auto">
        <LapTable
        laps={laps}
        tagDefs={tagDefs}
        onUpdateNote={handleUpdateNote}
        onUpdateTags={handleUpdateTags}
        onAddTag={handleAddTag}
      />

      {laps.length > 0 && (
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleSaveSession}
            className="flex items-center gap-2 rounded-full border border-border/40 bg-secondary/60 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            <Download className="h-3.5 w-3.5" />
            Save session
          </button>
          <button type="button" onClick={() => setShowGitHub(true)}
            className="flex items-center gap-2 rounded-full border border-border/40 bg-secondary/60 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            <Github className="h-3.5 w-3.5" />
            Push to GitHub
          </button>
        </div>
      )}
      </div>

      <GitHubModal open={showGitHub} onClose={() => setShowGitHub(false)} sessionMarkdown={exportSession(laps)} />
    </div>
  )
}
