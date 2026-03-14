import { useMemo } from "react";
import { useAuth } from "./context/AuthContext";
import { useWins } from "./hooks/useWins";
import { AuthGate } from "./components/AuthGate/AuthGate";
import { WinLogger } from "./components/WinLogger/WinLogger";
import { StreakDisplay } from "./components/StreakDisplay/StreakDisplay";
import { PositivityGraph } from "./components/PositivityGraph/PositivityGraph";
import { MonthHeatmap } from "./components/MonthHeatmap/MonthHeatmap";
import { WinFeed } from "./components/WinFeed/WinFeed";
import { EmptyState } from "./components/EmptyState/EmptyState";
import { computeStreak, buildDailyCounts } from "./utils/streakUtils";
import { getPast30Days } from "./utils/dateUtils";
import styles from "./App.module.css";

export default function App() {
  const { user, loading, signOut } = useAuth();
  const { wins, addWin, deleteWin, todaysWins, syncing } = useWins(user?.uid ?? null);

  const streak      = useMemo(() => computeStreak(wins), [wins]);
  const past30      = useMemo(() => getPast30Days(), []);
  const dailyCounts = useMemo(() => buildDailyCounts(wins, past30), [wins, past30]);
  const hasAnyWins  = wins.length > 0;

  // ── Full-page loading splash (checking auth state on mount) ──
  if (loading) {
    return (
      <div className={styles.splash}>
        <span className={styles.splashIcon}>◆</span>
      </div>
    );
  }

  // ── Not authenticated → show auth gate ──
  if (!user) return <AuthGate />;

  // ── Authenticated app ────────────────────────────────────────
  const initials = user.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className={styles.app}>
      <div className={styles.bgGlow} aria-hidden />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* Left: logo */}
          <div className={styles.logoWrap}>
            <span className={styles.logoIcon}>◆</span>
            <h1 className={styles.logo}>one small win</h1>
          </div>

          {/* Right: sync indicator + user chip */}
          <div className={styles.headerRight}>
            {syncing && <span className={styles.syncDot} title="Syncing..." />}
            <div className={styles.userChip}>
              <span className={styles.avatar}>{initials}</span>
              <span className={styles.userName}>
                {user.displayName ?? user.email}
              </span>
              <button className={styles.signOutBtn} onClick={signOut}>
                Sign out
              </button>
            </div>
          </div>
        </div>
        <p className={styles.tagline}>small victories, compounding daily.</p>
      </header>

      <main className={styles.main}>
        <section className={styles.topRow}>
          <div className={styles.loggerCol}>
            <WinLogger onAdd={addWin} todayCount={todaysWins.length} />
          </div>
          <div className={styles.streakCol}>
            <StreakDisplay streak={streak} />
          </div>
        </section>

        {hasAnyWins && (
          <>
            <PositivityGraph data={dailyCounts} />
            <MonthHeatmap wins={wins} />
          </>
        )}

        {hasAnyWins ? (
          <WinFeed wins={wins} onDelete={deleteWin} />
        ) : (
          <EmptyState />
        )}
      </main>

      <footer className={styles.footer}>
        <span>one small win — built for momentum</span>
      </footer>
    </div>
  );
}
