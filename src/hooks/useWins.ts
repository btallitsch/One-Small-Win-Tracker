import { useState, useCallback, useMemo } from "react";
import type { Win, WinCategory } from "../types";
import { getTodayString } from "../utils/dateUtils";

const STORAGE_KEY = "osw_wins";

function loadWins(): Win[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Win[]) : [];
  } catch {
    return [];
  }
}

function saveWins(wins: Win[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wins));
}

export function useWins() {
  const [wins, setWins] = useState<Win[]>(loadWins);

  const addWin = useCallback((text: string, category: WinCategory) => {
    const win: Win = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text: text.trim(),
      category,
      timestamp: Date.now(),
      date: getTodayString(),
    };
    setWins((prev) => {
      const updated = [win, ...prev];
      saveWins(updated);
      return updated;
    });
  }, []);

  const deleteWin = useCallback((id: string) => {
    setWins((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      saveWins(updated);
      return updated;
    });
  }, []);

  const todaysWins = useMemo(() => {
    const today = getTodayString();
    return wins.filter((w) => w.date === today);
  }, [wins]);

  return { wins, addWin, deleteWin, todaysWins };
}
