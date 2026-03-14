import type { WinCategory } from "../../types";
import styles from "./CategoryBadge.module.css";

const LABELS: Record<WinCategory, string> = {
  fitness:  "💪 Fitness",
  creative: "🎨 Creative",
  social:   "🤝 Social",
  learning: "📚 Learning",
  health:   "🌿 Health",
  work:     "⚡ Work",
  home:     "🏠 Home",
  other:    "✨ Other",
};

interface Props {
  category: WinCategory;
  small?: boolean;
  onClick?: () => void;
  active?: boolean;
}

export function CategoryBadge({ category, small, onClick, active }: Props) {
  return (
    <span
      className={[
        styles.badge,
        styles[category],
        small ? styles.small : "",
        onClick ? styles.clickable : "",
        active ? styles.active : "",
      ].join(" ")}
      data-category={category}
      onClick={onClick}
    >
      {LABELS[category]}
    </span>
  );
}

export const CATEGORIES: WinCategory[] = [
  "fitness","creative","social","learning","health","work","home","other",
];
