"use client"

import { useState } from "react"
import { X } from "lucide-react"

type ModalKey = "about" | "how-to-use" | "privacy" | null

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
            onClick={() => setOpen("about")}
            className="transition-colors hover:text-foreground"
          >
            About
          </button>
          <span className="select-none">·</span>
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
        <p className="mt-3 text-center text-[11px] text-muted-foreground/40">
          Made by{" "}
          <a
            href="https://github.com/pratham1gg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/60 underline underline-offset-2 transition-colors hover:text-foreground"
          >
            pratham1gg
          </a>
        </p>
      </footer>

      {open === "about" && (
        <Modal title="About Stopwatching" onClose={() => setOpen(null)}>
          <div className="space-y-3">
            <p>
              <strong className="text-foreground">Stopwatching</strong> is a time-awareness tool designed around one simple idea: start it when you open your laptop, and let it track how you spend your day.
            </p>
            <p>
              Every time you switch tasks — from studying to a break, from deep work to a meeting — hit <strong className="text-foreground">Lap</strong> and tag what you just did. By the end of the day, you have a clear, honest log of where your hours went.
            </p>
            <p className="text-foreground font-medium">Who is it for?</p>
            <ul className="space-y-1.5 list-none">
              <li className="flex gap-2">
                <span className="text-foreground">-</span>
                <span><strong className="text-foreground">Students</strong> preparing for competitive exams — track study sessions, breaks, and revision across subjects.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-foreground">-</span>
                <span><strong className="text-foreground">Professionals</strong> who want to understand how their workday actually breaks down across tasks, meetings, and focus time.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-foreground">-</span>
                <span><strong className="text-foreground">Anyone</strong> building better habits — seeing where time goes is the first step to spending it better.</span>
              </li>
            </ul>
            <p>
              At the end of the day, export your session as a Markdown file. Use it as a daily journal, a timesheet, or just a personal log you can look back on. Everything stays on your device — no accounts, no cloud, no tracking.
            </p>
          </div>
        </Modal>
      )}

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
              <span>Press <strong className="text-foreground">Stop</strong> to pause — a final lap is recorded automatically. Press Start again to resume.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground">4</span>
              <span>Use <strong className="text-foreground">Tags</strong> to categorize laps — click the <strong className="text-foreground">+</strong> on any lap to create or apply tags. The <strong className="text-foreground">Tag Summary</strong> below the table shows total time per tag.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground">5</span>
              <span>Click any <strong className="text-foreground">Note</strong> field to annotate a lap. Notes expand to fit long text.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground">6</span>
              <span>Use <strong className="text-foreground">Save session</strong> to download a Markdown file, or <strong className="text-foreground">Push to GitHub</strong> to commit it directly to a repo.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground">7</span>
              <span>Press <strong className="text-foreground">Reset</strong> to clear the timer, laps, and tags — start fresh.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground">8</span>
              <span>Click the <strong className="text-foreground">globe icon</strong> (top-left) to toggle the <strong className="text-foreground">World Clock</strong> sidebar. Add or remove timezones by searching city names or GMT offsets.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground">9</span>
              <span>Use the <strong className="text-foreground">moon/sun icon</strong> (top-right) to switch between light and dark mode.</span>
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
