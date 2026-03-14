import { useState } from "react";
import type { Win, WinCategory } from "../../types";
import { CategoryBadge, CATEGORIES } from "../CategoryBadge/CategoryBadge";
import { formatTimeAgo, formatDate } from "../../utils/dateUtils";
import styles from "./WinFeed.module.css";

interface Props {
  wins: Win[];
  onDelete: (id: string) => void;
}

export function WinFeed({ wins, onDelete }: Props) {
  const [filterCat, setFilterCat] = useState<WinCategory | "all">("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = filterCat === "all"
    ? wins
    : wins.filter((w) => w.category === filterCat);

  // Group by date
  const groups = new Map<string, Win[]>();
  for (const win of filtered) {
    const existing = groups.get(win.date) ?? [];
    groups.set(win.date, [...existing, win]);
  }
  const sortedDates = Array.from(groups.keys()).sort((a, b) => b.localeCompare(a));

  function handleDelete(id: string) {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  }

  return (
    <div className={styles.feed}>
      <div className={styles.header}>
        <h3 className={styles.title}>Your wins</h3>
        <span className={styles.total}>{wins.length} total</span>
      </div>

      {/* Filter pills */}
      <div className={styles.filters}>
        <button
          className={[styles.filterAll, filterCat === "all" ? styles.filterActive : ""].join(" ")}
          onClick={() => setFilterCat("all")}
        >
          All
        </button>
        {CATEGORIES.map((cat) => {
          const count = wins.filter((w) => w.category === cat).length;
          if (count === 0) return null;
          return (
            <CategoryBadge
              key={cat}
              category={cat}
              small
              onClick={() => setFilterCat(filterCat === cat ? "all" : cat)}
              active={filterCat === cat}
            />
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className={styles.empty}>No wins in this category yet.</p>
      )}

      <div className={styles.groups}>
        {sortedDates.map((date) => {
          const dayWins = groups.get(date)!;
          const isToday = date === new Date().toISOString().split("T")[0];
          return (
            <div key={date} className={styles.group}>
              <div className={styles.dateLabel}>
                {isToday ? "Today" : formatDate(date)}
                <span className={styles.dateCount}>{dayWins.length}</span>
              </div>
              <div className={styles.winList}>
                {dayWins.map((win) => (
                  <div key={win.id} className={styles.winItem}>
                    <div className={styles.winContent}>
                      <span className={styles.winText}>{win.text}</span>
                      <div className={styles.winMeta}>
                        <CategoryBadge category={win.category} small />
                        <span className={styles.timeAgo}>{formatTimeAgo(win.timestamp)}</span>
                      </div>
                    </div>
                    <button
                      className={[
                        styles.deleteBtn,
                        confirmDelete === win.id ? styles.confirmDel : "",
                      ].join(" ")}
                      onClick={() => handleDelete(win.id)}
                      aria-label={confirmDelete === win.id ? "Confirm delete" : "Delete win"}
                    >
                      {confirmDelete === win.id ? "confirm?" : "×"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
