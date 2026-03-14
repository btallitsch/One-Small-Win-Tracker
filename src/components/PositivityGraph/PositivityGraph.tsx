import type { DailyCount } from "../../types";
import { formatShortDate } from "../../utils/dateUtils";
import styles from "./PositivityGraph.module.css";

interface Props {
  data: DailyCount[];
}

const W = 600;
const H = 120;
const BAR_GAP = 2;
const LABEL_EVERY = 7;

export function PositivityGraph({ data }: Props) {
  if (data.length === 0) return null;

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const barWidth = (W - BAR_GAP * (data.length - 1)) / data.length;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>30-day momentum</h3>
        <span className={styles.sub}>
          {data.filter((d) => d.count > 0).length} active days
        </span>
      </div>

      <div className={styles.chartWrap}>
        <svg
          viewBox={`0 0 ${W} ${H + 24}`}
          preserveAspectRatio="none"
          className={styles.svg}
          aria-label="30-day wins bar chart"
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((frac) => (
            <line
              key={frac}
              x1={0}
              y1={H - H * frac}
              x2={W}
              y2={H - H * frac}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          ))}

          {data.map((d, i) => {
            const x = i * (barWidth + BAR_GAP);
            const barH = d.count > 0 ? Math.max((d.count / maxCount) * H, 8) : 2;
            const y = H - barH;
            const isToday = d.date === today;
            const hasWins = d.count > 0;

            return (
              <g key={d.date}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx={Math.min(barWidth / 2, 3)}
                  fill={
                    isToday
                      ? "var(--amber)"
                      : hasWins
                      ? "rgba(245,155,30,0.45)"
                      : "rgba(255,255,255,0.04)"
                  }
                  className={styles.bar}
                />
                {isToday && (
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.min(3, barH)}
                    rx={Math.min(barWidth / 2, 3)}
                    fill="var(--gold)"
                    opacity={0.9}
                  />
                )}
                {/* Date label every 7 days */}
                {i % LABEL_EVERY === 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={H + 18}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                  >
                    {formatShortDate(d.date)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.dotAmber} /> Today
        </span>
        <span className={styles.legendItem}>
          <span className={styles.dotDim} /> Past wins
        </span>
        <span className={styles.legendItem}>
          <span className={styles.dotEmpty} /> No wins
        </span>
      </div>
    </div>
  );
}
