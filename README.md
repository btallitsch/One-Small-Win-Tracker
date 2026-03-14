# ◆ One Small Win

> *Small victories, compounding daily.*

A psychologically motivating daily win tracker built with React + TypeScript + Vite. No accounts, no clutter — just you and your momentum.

---

## Features

- **Log small wins** with a category tag (Fitness, Creative, Social, Learning, Health, Work, Home, Other)
- **Streak tracker** — see your current and best daily streak with flame animation
- **30-day momentum bar chart** — visualize your win density over the past month
- **Monthly heatmap** — GitHub-style calendar view, navigable by month
- **Win feed** — filterable history grouped by date with delete support
- **Fully local** — all data stored in `localStorage`, zero backend required

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Styling | CSS Modules |
| State | `useState` + `localStorage` |
| Fonts | Fraunces, Cabinet Grotesk, DM Mono |

---

## Project Structure

```
src/
├── components/
│   ├── CategoryBadge/    # Colored category pill
│   ├── EmptyState/       # First-time welcome screen
│   ├── MonthHeatmap/     # Calendar heatmap by month
│   ├── PositivityGraph/  # 30-day SVG bar chart
│   ├── StreakDisplay/    # Flame + current/best streak
│   └── WinFeed/          # Filterable win history
├── hooks/
│   └── useWins.ts        # All win state + localStorage logic
├── types/
│   └── index.ts          # Shared TypeScript types
├── utils/
│   ├── dateUtils.ts      # Date formatting helpers
│   └── streakUtils.ts    # Streak & count computation
├── App.tsx
└── index.css             # Design tokens + global styles
```

---

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Vercel auto-detects Vite. No extra config needed.
