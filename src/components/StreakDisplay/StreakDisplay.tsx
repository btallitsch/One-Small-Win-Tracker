import type { StreakInfo } from "../../types";
import styles from "./StreakDisplay.module.css";

interface Props {
  streak: StreakInfo;
}

function FlameIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 28C16 28 6 22 6 13C6 8 10 4 14 4C13 7 14 9 16 10C16 10 14 7 18 5C18 5 22 9 22 14C22 18 20 20 20 20C20 20 22 16 19 14C19 14 20 20 16 28Z"
        fill="url(#flame)"
        opacity="0.95"
      />
      <path
        d="M16 25C16 25 11 21 11 16C11 13 13 11 15 10C14.5 12 15 13.5 16 14C16 14 15 12 17.5 11C17.5 11 19.5 13.5 19.5 16C19.5 19 18 21 16 25Z"
        fill="url(#flame2)"
        opacity="0.8"
      />
      <defs>
        <linearGradient id="flame" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59B1E" />
          <stop offset="60%" stopColor="#E8786A" />
          <stop offset="100%" stopColor="#C17A10" />
        </linearGradient>
        <linearGradient id="flame2" x1="16" y1="10" x2="16" y2="25" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59B1E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function StreakDisplay({ streak }: Props) {
  const isActive = streak.current > 0;
  const isHot = streak.current >= 7;

  return (
    <div className={[styles.card, isHot ? styles.hot : ""].join(" ")}>
      {isHot && <div className={styles.hotGlow} />}

      <div className={styles.main}>
        <div className={[styles.flameWrap, isActive ? styles.active : ""].join(" ")}>
          <FlameIcon size={40} />
          {isHot && <div className={styles.pulseRing} />}
        </div>

        <div className={styles.streakNum}>
          <span className={styles.num}>{streak.current}</span>
          <span className={styles.label}>day streak</span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaVal}>{streak.best}</span>
          <span className={styles.metaLabel}>best ever</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaVal}>
            {streak.current === 0 ? "—" : `${streak.current}d`}
          </span>
          <span className={styles.metaLabel}>running</span>
        </div>
      </div>

      {!isActive && (
        <p className={styles.nudge}>Log a win today to start your streak 🌱</p>
      )}
      {isActive && streak.current < 7 && (
        <p className={styles.nudge}>Keep it going! {7 - streak.current} days to a week streak 🔥</p>
      )}
      {isHot && (
        <p className={styles.nudge}>You're on fire! Week+ streak 🏆</p>
      )}
    </div>
  );
}
