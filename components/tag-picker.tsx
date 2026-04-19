"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, X } from "lucide-react"
import type { Lap, TagDefinition } from "@/lib/stopwatch-utils"

interface TagPickerProps {
  lap: Lap
  tagDefs: TagDefinition[]
  onUpdateTags: (id: number, tags: string[]) => void
  onAddTag: (name: string) => TagDefinition
}

const FALLBACK_COLOR = "#888"

export function TagPicker({ lap, tagDefs, onUpdateTags, onAddTag }: TagPickerProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  function toggleTag(name: string) {
    const next = lap.tags.includes(name)
      ? lap.tags.filter((t) => t !== name)
      : [...lap.tags, name]
    onUpdateTags(lap.id, next)
  }

  function createTag() {
    const name = input.trim()
    if (!name) return
    onAddTag(name)
    if (!lap.tags.includes(name)) onUpdateTags(lap.id, [...lap.tags, name])
    setInput("")
  }

  const filtered = tagDefs.filter(
    (t) => input.trim() === "" || t.name.toLowerCase().includes(input.toLowerCase())
  )
  const inputMatchesExisting = tagDefs.some(
    (t) => t.name.toLowerCase() === input.toLowerCase()
  )

  return (
    <div className="relative" ref={ref}>
      <div className="flex flex-wrap items-center gap-1">
        {lap.tags.map((name) => {
          const color = tagDefs.find((t) => t.name === name)?.color ?? FALLBACK_COLOR
          return (
            <span
              key={name}
              className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: color }}
            >
              {name}
              <button
                type="button"
                onClick={() => toggleTag(name)}
                className="ml-0.5 opacity-70 hover:opacity-100"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )
        })}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border/50 text-muted-foreground/50 transition-colors hover:border-border hover:text-foreground"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      {open && (
        <div className="absolute left-0 top-7 z-50 w-48 rounded-xl border border-border bg-background shadow-lg">
          <div className="p-2">
            <input
              autoFocus
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createTag()
                if (e.key === "Escape") setOpen(false)
              }}
              placeholder="New or search tag…"
              className="w-full rounded-lg border border-border/50 bg-secondary/50 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="max-h-40 overflow-y-auto px-1 pb-1">
            {filtered.map((def) => (
              <button
                key={def.name}
                type="button"
                onClick={() => toggleTag(def.name)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-secondary"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: def.color }} />
                <span className="flex-1 text-left text-foreground">{def.name}</span>
                {lap.tags.includes(def.name) && (
                  <span className="text-[10px] text-muted-foreground">✓</span>
                )}
              </button>
            ))}
            {input.trim() !== "" && !inputMatchesExisting && (
              <button
                type="button"
                onClick={createTag}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Plus className="h-3 w-3" />
                Create "{input.trim()}"
              </button>
            )}
            {filtered.length === 0 && input.trim() === "" && (
              <p className="px-2 py-2 text-[11px] text-muted-foreground/50">
                No tags yet. Type to create one.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
