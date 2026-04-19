"use client"

import { useState } from "react"
import { X } from "lucide-react"

type ModalKey = "how-to-use" | "privacy" | null

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  )
}

export function Footer() {
  const [open, setOpen] = useState<ModalKey>(null)

  return (
    <>
      <footer className="w-full border-t border-border/30 py-5">
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground/60">
          <button
            type="button"
            onClick={() => setOpen("how-to-use")}
            className="transition-colors hover:text-foreground"
          >
            How to use
          </button>
          <span className="select-none">·</span>
          <button
            type="button"
            onClick={() => setOpen("privacy")}
            className="transition-colors hover:text-foreground"
          >
            Privacy
          </button>
          <span className="select-none">·</span>
          <a
            href="https://github.com/pratham1gg/stopwatching"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </footer>

      {open === "how-to-use" && (
        <Modal title="How to use" onClose={() => setOpen(null)}>
          <ol className="space-y-3 list-none">
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground">1</span>
              <span>Press <strong className="text-foreground">Start</strong> to begin timing. The counter starts immediately.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground">2</span>
              <span>Press <strong className="text-foreground">Lap</strong> while running to record a split. Each lap captures its own split time and a running total.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground">3</span>
              <span>Press <strong className="text-foreground">Stop</strong> to pause. Press Start again to resume from where you left off.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground">4</span>
              <span>Click any <strong className="text-foreground">Note</strong> field in the lap table to annotate that lap.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground">5</span>
              <span>Use <strong className="text-foreground">Save session</strong> to download a Markdown file, or <strong className="text-foreground">Push to GitHub</strong> to commit it directly to a repo.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground">6</span>
              <span>Press <strong className="text-foreground">Reset</strong> to clear everything and start fresh.</span>
            </li>
          </ol>
        </Modal>
      )}

      {open === "privacy" && (
        <Modal title="Privacy" onClose={() => setOpen(null)}>
          <div className="space-y-3">
            <p>
              This app collects <strong className="text-foreground">no data</strong> about you. There are no analytics, no tracking scripts, and no third-party services beyond loading the DSEG7 font from jsDelivr CDN.
            </p>
            <p>
              Lap data is saved in your browser's <strong className="text-foreground">localStorage</strong> so your session survives a page refresh. It never leaves your device unless you explicitly export it or push it to GitHub yourself.
            </p>
            <p>
              Your GitHub token (if used) is never stored — it is only held in memory for the duration of the push operation.
            </p>
          </div>
        </Modal>
      )}
    </>
  )
}
