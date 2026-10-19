import { AnimatePresence, motion } from "motion/react";
import { FILL_ORDER, SETTINGS_SLOT, type FormatId, type Target, formatOf } from "../data/formats";
import { MID_R, WHEEL, gearPath, polar, sectorPath, slotAngle } from "../lib/geometry";

export type WheelPhase = "idle" | "busy" | "done";

type Props = {
  source: { id: FormatId; name: string };
  targets: Target[];
  phase: WheelPhase;
  /** Formato al que se está convirtiendo o al que se acaba de convertir. */
  chosen: FormatId | null;
  /** Nombre del archivo resultante (se muestra al terminar). */
  resultName: string | null;
  /** Pétalo resaltado como si el cursor estuviera encima (lo usa la demostración automática). */
  hot: FormatId | null;
  onPick: (target: Target) => void;
};

const { c } = WHEEL;

const centerSwap = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.16 } };

/** Posición de cada formato en la rueda (en el viewBox de 460): se usa también para mover el cursor. */
export const petalCenter = (slot: number): [number, number] => polar(c, MID_R, slotAngle(slot));

export const slotOfTarget = (index: number): number => FILL_ORDER[index];

export function Wheel({ source, targets, phase, chosen, resultName, hot, onPick }: Props) {
  const slots: (Target | null)[] = Array.from({ length: 8 }, () => null);
  targets.slice(0, FILL_ORDER.length).forEach((t, i) => (slots[FILL_ORDER[i]] = t));
  const busy = phase !== "idle";

  return (
    <svg className={`wheel${busy ? " is-busy" : ""}`} viewBox="0 0 460 460" role="group" aria-label={`Paleta de formatos para ${source.name}`}>
      {slots.map((target, slot) => {
        if (slot !== SETTINGS_SLOT && !target) return null;
        const [mx, my] = petalCenter(slot);
        const [kx, ky] = polar(c, WHEEL.rOut - 20, slotAngle(slot));
        const key = target ? targets.indexOf(target) + 1 : 0;
        const isChosen = !!target && target.id === chosen && busy;
        const isGear = slot === SETTINGS_SLOT;
        return (
          <motion.g
            key={slot}
            className={`petal${isGear ? " gear" : ""}${target && hot === target.id ? " is-hot" : ""}${isChosen ? " is-chosen" : ""}`}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ opacity: 0, scale: 0.78 }}
            animate={{ opacity: busy && !isChosen && !isGear ? 0.3 : 1, scale: isChosen ? 1.05 : 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
            transition={{ type: "spring", stiffness: 520, damping: 32, delay: busy ? 0 : slot * 0.028 }}
            role="button"
            tabIndex={isGear || busy ? -1 : 0}
            aria-label={isGear ? "Ajustes (no disponible en la demostración)" : `Convertir a ${target!.label}, tecla ${key}`}
            aria-disabled={isGear || busy}
            onClick={() => target && !busy && onPick(target)}
            onKeyDown={(e) => {
              if (target && !busy && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onPick(target);
              }
            }}
          >
            <path className="shape" d={sectorPath(slot)} />
            <path className="edge" d={sectorPath(slot)} />
            {isGear ? (
              <path className="gear-icon" d={gearPath(mx, my, 17)} fillRule="evenodd" />
            ) : (
              target && (
                <>
                  <text className="label" x={mx} y={my}>
                    {target.label}
                  </text>
                  <text className="hint" x={kx} y={ky}>
                    {key}
                  </text>
                  {target.fidelity === "lossy" && (
                    <text className="lossy" x={mx + (c - mx) * 0.14} y={my + 17}>
                      con pérdida
                    </text>
                  )}
                </>
              )
            )}
          </motion.g>
        );
      })}

      <circle className="center" cx={c} cy={c} r={94} />
      <AnimatePresence mode="wait" initial={false}>
        {phase === "idle" && (
          <motion.g key="idle" {...centerSwap}>
            <text className="src-label" x={c} y={c - 14}>
              {formatOf(source.id).label}
            </text>
            <text className="src-name" x={c} y={c + 18}>
              {source.name}
            </text>
          </motion.g>
        )}
        {phase === "busy" && (
          <motion.g key="busy" {...centerSwap}>
            <circle className="spin-track" cx={c} cy={c - 34} r={12} />
            <g className="spin" style={{ transformOrigin: `${c}px ${c - 34}px` }}>
              <path className="spin-arc" d={`M${c} ${c - 46}A12 12 0 0 1 ${c + 12} ${c - 34}`} />
            </g>
            <text className="src-label small" x={c} y={c - 2}>
              Convirtiendo
            </text>
            <text className="src-name" x={c} y={c + 22}>
              {`a ${chosen ? formatOf(chosen).label : ""}`}
            </text>
          </motion.g>
        )}
        {phase === "done" && (
          <motion.g key="done" {...centerSwap}>
            <path className="check" d={`M${c - 11} ${c - 30}l8 8 15-17`} />
            <text className="src-label small" x={c} y={c - 2}>
              Listo
            </text>
            <text className="src-name ok" x={c} y={c + 22}>
              {resultName}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}
