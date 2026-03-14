import { useMemo } from "react";
import { useWins } from "./hooks/useWins";
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
  const { wins, addWin, deleteWin, todaysWins } = useWins();

  const streak = useMemo(() => computeStreak(wins), [wins]);
  const past30 = useMemo(() => getPast30Days(), []);
  const dailyCounts = useMemo(() => buildDailyCounts(wins, past30), [wins, past30]);

  const hasAnyWins = wins.length > 0;

  return (
    <div className={styles.app}>
      {/* Background ambient glow */}
      <div className={styles.bgGlow} aria-hidden />

      <header className={styles.header}>
        <div className={styles.logoWrap}>
          <span className={styles.logoIcon}>◆</span>
          <h1 className={styles.logo}>one small win</h1>
        </div>
        <p className={styles.tagline}>small victories, compounding daily.</p>
      </header>

      <main className={styles.main}>
        {/* Top: logger + streak side by side */}
        <section className={styles.topRow}>
          <div className={styles.loggerCol}>
            <WinLogger onAdd={addWin} todayCount={todaysWins.length} />
          </div>
          <div className={styles.streakCol}>
            <StreakDisplay streak={streak} />
          </div>
        </section>

        {/* Charts */}
        {hasAnyWins && (
          <>
            <PositivityGraph data={dailyCounts} />
            <MonthHeatmap wins={wins} />
          </>
        )}

        {/* Feed or empty state */}
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
