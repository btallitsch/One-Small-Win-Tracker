import type { Win, StreakInfo, DailyCount } from "../types";
import { getTodayString, getPreviousDay } from "./dateUtils";

export function computeStreak(wins: Win[]): StreakInfo {
  if (wins.length === 0) return { current: 0, best: 0, lastWinDate: null };

  const dateCounts = new Map<string, number>();
  for (const win of wins) {
    dateCounts.set(win.date, (dateCounts.get(win.date) ?? 0) + 1);
  }

  const sortedDates = Array.from(dateCounts.keys()).sort();
  const today = getTodayString();
  const yesterday = getPreviousDay(today);

  // Compute best streak
  let best = 0;
  let running = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      running = 1;
    } else {
      const prev = getPreviousDay(sortedDates[i]);
      running = prev === sortedDates[i - 1] ? running + 1 : 1;
    }
    if (running > best) best = running;
  }

  // Compute current streak (must include today or yesterday to be "alive")
  const lastDate = sortedDates[sortedDates.length - 1];
  let current = 0;

  if (lastDate === today || lastDate === yesterday) {
    current = 1;
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const expected = getPreviousDay(sortedDates[i + 1]);
      if (sortedDates[i] === expected) {
        current++;
      } else {
        break;
      }
    }
  }

  return { current, best, lastWinDate: lastDate };
}

export function buildDailyCounts(wins: Win[], dates: string[]): DailyCount[] {
  const dateCounts = new Map<string, number>();
  for (const win of wins) {
    dateCounts.set(win.date, (dateCounts.get(win.date) ?? 0) + 1);
  }
  return dates.map((date) => ({ date, count: dateCounts.get(date) ?? 0 }));
}

export function computeMonthlySummary(
  wins: Win[],
  year: number,
  month: number
): { totalWins: number; activeDays: number; daysInMonth: number } {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  const monthWins = wins.filter((w) => w.date.startsWith(prefix));
  const activeDays = new Set(monthWins.map((w) => w.date)).size;
  const daysInMonth = new Date(year, month, 0).getDate();
  return { totalWins: monthWins.length, activeDays, daysInMonth };
}
