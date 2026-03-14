import { useState } from "react";
import type { Win } from "../../types";
import { getMonthDays, formatMonthLabel, formatDate } from "../../utils/dateUtils";
import styles from "./MonthHeatmap.module.css";

interface Props {
  wins: Win[];
}

function getIntensityClass(count: number): string {
  if (count === 0) return styles.i0;
  if (count === 1) return styles.i1;
  if (count === 2) return styles.i2;
  if (count <= 4) return styles.i3;
  return styles.i4;
}

export function MonthHeatmap({ wins }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [tooltip, setTooltip] = useState<{ date: string; count: number } | null>(null);

  const dateCounts = new Map<string, number>();
  for (const w of wins) {
    dateCounts.set(w.date, (dateCounts.get(w.date) ?? 0) + 1);
  }

  const days = getMonthDays(year, month);
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const totalWins = days.reduce((sum, d) => sum + (dateCounts.get(d) ?? 0), 0);
  const activeDays = days.filter((d) => (dateCounts.get(d) ?? 0) > 0).length;

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    const n = new Date();
    if (year > n.getFullYear() || (year === n.getFullYear() && month >= n.getMonth() + 1)) return;
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Monthly overview</h3>
        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={prevMonth} aria-label="Previous month">‹</button>
          <span className={styles.monthLabel}>{formatMonthLabel(year, month)}</span>
          <button
            className={styles.navBtn}
            onClick={nextMonth}
            disabled={isCurrentMonth}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.stats}>
        <span className={styles.stat}>
          <span className={styles.statVal}>{totalWins}</span>
          <span className={styles.statLabel}>wins</span>
        </span>
        <span className={styles.statDiv} />
        <span className={styles.stat}>
          <span className={styles.statVal}>{activeDays}</span>
          <span className={styles.statLabel}>active days</span>
        </span>
        <span className={styles.statDiv} />
        <span className={styles.stat}>
          <span className={styles.statVal}>
            {days.length > 0 ? Math.round((activeDays / days.length) * 100) : 0}%
          </span>
          <span className={styles.statLabel}>consistency</span>
        </span>
      </div>

      <div className={styles.gridWrap}>
        {/* Day-of-week headers */}
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
          <div key={d} className={styles.dayHeader}>{d}</div>
        ))}
        {/* Empty cells before first day */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className={styles.emptyCell} />
        ))}
        {/* Day cells */}
        {days.map((date) => {
          const count = dateCounts.get(date) ?? 0;
          const isToday = date === now.toISOString().split("T")[0];
          return (
            <div
              key={date}
              className={[
                styles.cell,
                getIntensityClass(count),
                isToday ? styles.today : "",
              ].join(" ")}
              onMouseEnter={() => setTooltip({ date, count })}
              onMouseLeave={() => setTooltip(null)}
              title={`${formatDate(date)}: ${count} win${count !== 1 ? "s" : ""}`}
            >
              <span className={styles.dayNum}>{parseInt(date.split("-")[2])}</span>
            </div>
          );
        })}
      </div>

      {tooltip && (
        <div className={styles.tooltip}>
          <span className={styles.tooltipDate}>{formatDate(tooltip.date)}</span>
          <span className={styles.tooltipCount}>
            {tooltip.count} win{tooltip.count !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
