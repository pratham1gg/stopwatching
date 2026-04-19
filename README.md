# Stopwatch With Lap Notes

A high-precision digital stopwatch built with Next.js 16, React 19, and TypeScript. Features include lap tracking with per-lap notes and tags, tag-based time summaries, Markdown session export, and direct GitHub push.

## Features

- **Drift-free timing** using `Date.now()` delta with `requestAnimationFrame`
- **Lap tracking** with split and cumulative times (format: `MM:SS.mmm`, auto-expands to `HH:MM:SS.mmm`)
- **Tags** — create colored tags and apply them to laps to categorize work
- **Tag summary** — see total time per tag with proportional bars
- **Notes** — annotate any lap inline
- **Session export** — download a Markdown file or push directly to a GitHub repo
- **Light / dark mode** — toggle with persistence in `localStorage`
- **Responsive** — works on desktop and mobile

## Directory structure

```
├── app/                     Next.js App Router entry points
│   ├── layout.tsx           Root layout (fonts, metadata, viewport)
│   ├── page.tsx             Main page — renders Stopwatch + Footer
│   └── globals.css          Tailwind base + light/dark CSS variables
│
├── components/              React components
│   ├── stopwatch.tsx        Top-level orchestrator (state, handlers, buttons)
│   ├── timer-display.tsx    Seven-segment timer with ghost digits and glow
│   ├── lap-table.tsx        Lap rows + TagSummary bar chart
│   ├── tag-picker.tsx       Popover for creating and toggling tags per lap
│   ├── github-modal.tsx     Modal form to push session Markdown to GitHub
│   ├── footer.tsx           Footer links: How to use, Privacy, GitHub
│   └── theme-toggle.tsx     Light/dark toggle (persisted in localStorage)
│
├── hooks/                   Custom React hooks
│   └── use-timer.ts         Timer logic (start, stop, reset, elapsed)
│
├── lib/                     Shared utilities and types
│   └── stopwatch-utils.ts   Lap/Tag types, formatTime, localStorage,
│                            tag totals, Markdown/JSON export
│
├── Configuration
│   ├── package.json         Dependencies and scripts
│   ├── tsconfig.json        TypeScript config (strict mode, path aliases)
│   ├── tailwind.config.ts   Tailwind theme (DSEG7 font, HSL color system)
│   ├── postcss.config.mjs   PostCSS pipeline
│   └── next.config.mjs      Next.js config (standalone output)
│
├── Docker
│   ├── Dockerfile           Multi-stage production build (Node 20 Alpine)
│   ├── docker-compose.yml   Local container run
│   └── .dockerignore        Build context exclusions
│
└── .claude/skills/          LobeHub agent skills (dev tooling)
```

## Key files explained

| File | Purpose |
|------|---------|
| `hooks/use-timer.ts` | Encapsulates all timing: `start()`, `stop()` (returns `finalElapsed`), `reset()`. Uses RAF + `Date.now()` delta to avoid drift. |
| `lib/stopwatch-utils.ts` | Core data types (`Lap`, `TagDefinition`), `formatTime()` / `formatTimeParts()`, `localStorage` read/write, `computeTagTotals()`, and Markdown export. |
| `components/stopwatch.tsx` | Wires `useTimer` + lap/tag state. Handles lap recording, auto-lap on stop, tag creation, and session export. |
| `components/tag-picker.tsx` | Per-lap tag popover — search, toggle, or create new tags. Tags auto-cycle through an 8-color palette. |
| `components/lap-table.tsx` | Renders the lap table and the `TagSummary` section (time per tag with colored progress bars). |
| `components/timer-display.tsx` | Renders the seven-segment DSEG7 font display. Green when running, red when stopped. Milliseconds shown at ~40% of the main digit size. |
| `components/footer.tsx` | "How to use", "Privacy", and "GitHub" links. How-to and Privacy open as modal dialogs. |

## Getting started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Install and run

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

### Run with Docker

```bash
docker compose up --build
```

App will be available at [http://localhost:3000](http://localhost:3000).

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 (strict) |
| UI library | React 19 |
| Styling | Tailwind CSS 3.4 |
| Icons | Lucide React |
| Timer font | DSEG7Classic (CDN) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

## Notes

- `next.config.mjs` uses `output: "standalone"` for efficient Docker images.
- `typescript.ignoreBuildErrors` is currently `true` — set to `false` for stricter production builds.
- All data is stored in the browser's `localStorage`. Nothing leaves your device unless you explicitly export or push to GitHub.
