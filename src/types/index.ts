export type WinCategory =
  | "fitness"
  | "creative"
  | "social"
  | "learning"
  | "health"
  | "work"
  | "home"
  | "other";

export interface Win {
  id: string;
  text: string;
  category: WinCategory;
  timestamp: number; // Unix ms
  date: string; // YYYY-MM-DD
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface StreakInfo {
  current: number;
  best: number;
  lastWinDate: string | null;
}
