import styles from "./EmptyState.module.css";

export function EmptyState() {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>🌱</div>
      <h2 className={styles.heading}>Every giant starts small.</h2>
      <p className={styles.body}>
        Log your first small win above — a workout, a song riff, a kind word.<br />
        Watch your momentum build, one day at a time.
      </p>
      <div className={styles.examples}>
        {[
          "finished a workout",
          "wrote a song riff",
          "cleaned my workspace",
          "helped a friend",
          "read 10 pages",
          "shipped a feature",
        ].map((ex) => (
          <span key={ex} className={styles.example}>✓ {ex}</span>
        ))}
      </div>
    </div>
  );
}
