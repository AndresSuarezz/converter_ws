import { motion } from "motion/react";

type Props = {
  keys: string[];
  /** Qué teclas se muestran hundidas (mismo orden que `keys`). */
  pressed?: boolean[];
  size?: "md" | "lg";
};

export function KeyCombo({ keys, pressed = [], size = "md" }: Props) {
  return (
    <span className={`keys keys-${size}`} aria-label={keys.join(" + ")}>
      {keys.map((k, i) => (
        <span className="keys-item" key={k}>
          {i > 0 && (
            <span className="keys-plus" aria-hidden="true">
              +
            </span>
          )}
          <motion.kbd
            className="key"
            animate={pressed[i] ? { y: 3, scale: 0.96 } : { y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 700, damping: 28 }}
            data-pressed={pressed[i] ? "" : undefined}
          >
            {k}
          </motion.kbd>
        </span>
      ))}
    </span>
  );
}
