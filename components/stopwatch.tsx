"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Play, Pause, RotateCcw, Flag, Download, Github } from "lucide-react"
import { TimerDisplay } from "@/components/timer-display"
import { LapTable } from "@/components/lap-table"
import { GitHubModal } from "@/components/github-modal"
import { saveLaps, loadLaps, exportSession, getSessionFileName } from "@/lib/stopwatch-utils"
import type { Lap } from "@/lib/stopwatch-utils"

export function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<Lap[]>([])
  const [showGitHub, setShowGitHub] = useState(false)

  // Refs for drift-free timing
  const startTimeRef = useRef(0)
  const accumulatedRef = useRef(0)
  const rafRef = useRef<number>(0)

  // Load laps from localStorage on mount
  useEffect(() => {
    setLaps(loadLaps())
  }, [])

  // Persist laps whenever they change
  useEffect(() => {
    if (laps.length > 0) {
      saveLaps(laps)
    }
  }, [laps])

  const tick = useCallback(() => {
    const now = Date.now()
    const current = accumulatedRef.current + (now - startTimeRef.current)
    setElapsed(current)
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  function handleStartPause() {
    if (isRunning) {
      // Pause
      cancelAnimationFrame(rafRef.current)
      accumulatedRef.current += Date.now() - startTimeRef.current
      setIsRunning(false)
    } else {
      // Start
      startTimeRef.current = Date.now()
      setIsRunning(true)
      rafRef.current = requestAnimationFrame(tick)
    }
  }

  function handleReset() {
    cancelAnimationFrame(rafRef.current)
    setIsRunning(false)
    setElapsed(0)
    accumulatedRef.current = 0
    startTimeRef.current = 0
    setLaps([])
    saveLaps([])
  }

  function handleLap() {
    const currentElapsed = isRunning
      ? accumulatedRef.current + (Date.now() - startTimeRef.current)
      : elapsed

    const prevTotal = laps.length > 0 ? laps[laps.length - 1].totalMs : 0
    const split = currentElapsed - prevTotal

    setLaps((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        splitMs: split,
        totalMs: currentElapsed,
        note: "",
      },
    ])
  }

  function handleUpdateNote(id: number, note: string) {
    setLaps((prev) => prev.map((l) => (l.id === id ? { ...l, note } : l)))
  }

  function handleSaveSession() {
    const exportedAt = new Date()
    const markdown = exportSession(laps, exportedAt)
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = getSessionFileName(exportedAt)
    a.click()
    URL.revokeObjectURL(url)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 px-4 py-12 sm:py-16">
      {/* Header */}
      <header className="flex flex-col items-center gap-1">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Precision Stopwatch</h1>
        <p className="text-xs text-muted-foreground">High-precision timing with lap tracking</p>
      </header>

      {/* Timer Display */}
      <TimerDisplay elapsed={elapsed} isRunning={isRunning} />

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        {/* Start / Pause */}
        <button
          type="button"
          onClick={handleStartPause}
          className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
            isRunning
              ? "bg-[#5cb85c]/15 text-[#5cb85c] hover:bg-[#5cb85c]/25 border border-[#5cb85c]/30"
              : "bg-[#5cb85c] text-[#0a0a0f] hover:bg-[#5cb85c]/90"
          }`}
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? "Pause" : "Start"}
        </button>

        {/* Reset - disabled while running */}
        <button
          type="button"
          onClick={handleReset}
          disabled={isRunning}
          className="flex items-center gap-2 rounded-lg border border-[#f0ad4e]/30 bg-[#f0ad4e]/10 px-5 py-2.5 text-sm font-medium text-[#f0ad4e] transition-all hover:bg-[#f0ad4e]/20 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>

        {/* Lap */}
        <button
          type="button"
          onClick={handleLap}
          disabled={elapsed === 0}
          className="flex items-center gap-2 rounded-lg border border-[#5bc0de]/30 bg-[#5bc0de]/10 px-5 py-2.5 text-sm font-medium text-[#5bc0de] transition-all hover:bg-[#5bc0de]/20 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Flag className="h-4 w-4" />
          Lap
        </button>
      </div>

      {/* Lap Table */}
      <LapTable laps={laps} onUpdateNote={handleUpdateNote} />

      {/* Session Actions */}
      {laps.length > 0 && (
        <div className="flex w-full flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Session Actions</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveSession}
              className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/70"
            >
              <Download className="h-3.5 w-3.5" />
              Save Session
            </button>
            <button
              type="button"
              onClick={() => setShowGitHub(true)}
              className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/70"
            >
              <Github className="h-3.5 w-3.5" />
              Push to GitHub
            </button>
          </div>
        </div>
      )}

      {/* GitHub Modal */}
      <GitHubModal
        open={showGitHub}
        onClose={() => setShowGitHub(false)}
        sessionMarkdown={exportSession(laps)}
      />

      {/* Footer */}
      <footer className="mt-4 text-center text-[11px] text-muted-foreground/50">
        Timer uses Date.now() delta for drift-free precision
      </footer>
    </div>
  )
}
