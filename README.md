# ◆ One Small Win

> *Small victories, compounding daily.*

A psychologically motivating daily win tracker — React + TypeScript + Vite, with Firebase Auth and Firestore for real-time cloud sync.

---

## Features

- **Log small wins** with a category tag (Fitness, Creative, Social, Learning, Health, Work, Home, Other)
- **Streak tracker** — current and best daily streak with flame animation
- **30-day momentum bar chart** — win density over the past month
- **Monthly heatmap** — GitHub-style calendar view, navigable by month
- **Win feed** — filterable history grouped by date with delete support
- **Firebase Auth** — email/password + Google OAuth sign-in
- **Firestore sync** — real-time, per-user data; works across tabs and devices

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | CSS Modules |
| Auth | Firebase Auth (email + Google) |
| Database | Firestore (real-time onSnapshot) |
| Hosting | Vercel (recommended) |

---

## Project Structure

```
src/
├── lib/
│   └── firebase.ts           # Firebase init (reads VITE_ env vars)
├── context/
│   └── AuthContext.tsx        # Auth provider + useAuth hook
├── components/
│   ├── AuthGate/              # Login / sign-up / Google screen
│   ├── CategoryBadge/         # Colored category pill
│   ├── EmptyState/            # First-time welcome screen
│   ├── MonthHeatmap/          # Calendar heatmap by month
│   ├── PositivityGraph/       # 30-day SVG bar chart
│   ├── StreakDisplay/         # Flame + current/best streak
│   └── WinFeed/               # Filterable win history
├── hooks/
│   └── useWins.ts             # Firestore real-time wins hook
├── types/
│   └── index.ts               # Shared TypeScript types
├── utils/
│   ├── dateUtils.ts           # Date formatting helpers
│   └── streakUtils.ts         # Streak & count computation
├── App.tsx                    # Root — auth gate → app layout
└── index.css                  # Design tokens + global styles
```

---

## Setup

### 1 — Firebase project

1. Go to https://console.firebase.google.com and create a project
2. Add a **Web app** to the project and copy the config values
3. Enable **Authentication** → Sign-in methods → Email/Password and Google
4. Enable **Firestore Database** (start in production mode)

### 2 — Firestore security rules

In Firestore → Rules, paste and publish:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/wins/{winId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### 3 — Local environment

```bash
cp .env.example .env.local
# Fill in your Firebase values
```

### 4 — Run

```bash
npm install
npm run dev
```

---

## Deploy to Vercel

```bash
npx vercel
```

Add all `VITE_FIREBASE_*` vars in Vercel → Settings → Environment Variables.
Then add your Vercel domain to Firebase → Authentication → Authorized domains.

---

## Firestore data model

```
users/{uid}/wins/{winId}
  text:      string
  category:  string   (fitness | creative | social | ...)
  timestamp: Timestamp
  date:      string   (YYYY-MM-DD)
```

Each user's wins are fully isolated by security rules.
