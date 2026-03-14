import { useState, useCallback, useMemo, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Win, WinCategory } from "../types";
import { getTodayString } from "../utils/dateUtils";

/**
 * Returns the Firestore collection ref for a given user's wins.
 * Path: users/{uid}/wins
 */
function winsCol(uid: string) {
  return collection(db, "users", uid, "wins");
}

export function useWins(uid: string | null) {
  const [wins, setWins]       = useState<Win[]>([]);
  const [syncing, setSyncing] = useState(false);

  // Real-time listener — resets when uid changes (login / logout)
  useEffect(() => {
    if (!uid) {
      setWins([]);
      return;
    }
    setSyncing(true);
    const q = query(winsCol(uid), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const loaded: Win[] = snap.docs.map((d) => ({
        id:        d.id,
        text:      d.data().text as string,
        category:  d.data().category as WinCategory,
        timestamp: (d.data().timestamp?.toMillis?.() as number) ?? Date.now(),
        date:      d.data().date as string,
      }));
      setWins(loaded);
      setSyncing(false);
    });
    return unsub;
  }, [uid]);

  const addWin = useCallback(async (text: string, category: WinCategory) => {
    if (!uid) return;
    await addDoc(winsCol(uid), {
      text:      text.trim(),
      category,
      timestamp: serverTimestamp(),
      date:      getTodayString(),
    });
  }, [uid]);

  const deleteWin = useCallback(async (id: string) => {
    if (!uid) return;
    await deleteDoc(doc(db, "users", uid, "wins", id));
  }, [uid]);

  const todaysWins = useMemo(() => {
    const today = getTodayString();
    return wins.filter((w) => w.date === today);
  }, [wins]);

  return { wins, addWin, deleteWin, todaysWins, syncing };
}
