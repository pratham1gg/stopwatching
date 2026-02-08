"use client"

import { useState } from "react"
import { X, Github } from "lucide-react"
import { getSessionFileName } from "@/lib/stopwatch-utils"

interface GitHubModalProps {
  open: boolean
  onClose: () => void
  sessionMarkdown: string
}

export function GitHubModal({ open, onClose, sessionMarkdown }: GitHubModalProps) {
  const [token, setToken] = useState("")
  const [repoUrl, setRepoUrl] = useState("")
  const [status, setStatus] = useState<"idle" | "pushing" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  if (!open) return null

  async function handlePush() {
    if (!token.trim() || !repoUrl.trim()) return
    setStatus("pushing")
    setErrorMsg("")

    try {
      // Parse owner/repo from URL like https://github.com/owner/repo or owner/repo
      const match = repoUrl.match(/(?:github\.com\/)?([^/]+)\/([^/\s]+)/)
      if (!match) throw new Error("Invalid repo URL. Use format: owner/repo or https://github.com/owner/repo")

      const [, owner, repo] = match
      const cleanRepo = repo.replace(/\.git$/, "")
      const fileName = getSessionFileName()
      const content = btoa(unescape(encodeURIComponent(sessionMarkdown)))

      const res = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contents/${fileName}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add stopwatch session ${fileName}`,
          content,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || `GitHub API returned ${res.status}`)
      }

      setStatus("success")
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Unknown error")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl border border-border/50 bg-card p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <Github className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Push to GitHub</h2>
            <p className="text-xs text-muted-foreground">Upload your session as a Markdown file</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="gh-token" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Personal Access Token
            </label>
            <input
              id="gh-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
              className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="gh-repo" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Repository
            </label>
            <input
              id="gh-repo"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="owner/repo"
              className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {status === "error" && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-red-400">{errorMsg}</p>
          )}
          {status === "success" && (
            <p className="rounded-md bg-[#5cb85c]/10 px-3 py-2 text-xs text-[#5cb85c]">
              Session pushed successfully!
            </p>
          )}

          <button
            type="button"
            onClick={handlePush}
            disabled={!token.trim() || !repoUrl.trim() || status === "pushing"}
            className="flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === "pushing" ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                Pushing...
              </>
            ) : (
              <>
                <Github className="h-4 w-4" />
                Push Session
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
