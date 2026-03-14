import { useState, useRef } from "react";
import type { WinCategory } from "../../types";
import { CategoryBadge, CATEGORIES } from "../CategoryBadge/CategoryBadge";
import styles from "./WinLogger.module.css";

interface Props {
  onAdd: (text: string, category: WinCategory) => void;
  todayCount: number;
}

const PLACEHOLDERS = [
  "Finished a workout...",
  "Wrote a song riff...",
  "Cleaned my workspace...",
  "Helped a friend...",
  "Read 10 pages...",
  "Shipped a feature...",
  "Cooked a healthy meal...",
  "Took a cold shower...",
];

export function WinLogger({ onAdd, todayCount }: Props) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<WinCategory>("other");
  const [submitted, setSubmitted] = useState(false);
  const placeholder = PLACEHOLDERS[Math.floor(Date.now() / 86400000) % PLACEHOLDERS.length];
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    if (!text.trim()) return;
    onAdd(text, category);
    setText("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 1200);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className={styles.logger}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Log a win
        </h2>
        {todayCount > 0 && (
          <span className={styles.todayBadge}>
            {todayCount} today
          </span>
        )}
      </div>

      <textarea
        ref={inputRef}
        className={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={2}
        maxLength={280}
      />

      <div className={styles.controls}>
        <div className={styles.categories}>
          {CATEGORIES.map((cat) => (
            <CategoryBadge
              key={cat}
              category={cat}
              small
              onClick={() => setCategory(cat)}
              active={category === cat}
            />
          ))}
        </div>

        <button
          className={[styles.submit, submitted ? styles.success : ""].join(" ")}
          onClick={handleSubmit}
          disabled={!text.trim()}
        >
          {submitted ? "✓ Logged!" : "Log it →"}
        </button>
      </div>
    </div>
  );
}
