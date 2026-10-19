import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { ALL_PAIRS, FAMILY_NAME, FORMATS, supports, targetsOf, type Family, type FormatId } from "../data/formats";

const FAMILIES: Family[] = ["image", "data", "doc", "text", "pdf"];
/** Posiciones tras las que se abre un hueco para separar familias. */
const GAPS = new Set([5, 8, 10, 12]);
const gapBefore = (i: number) => (GAPS.has(i - 1) ? " gap" : "");

export function Matrix() {
  const grid = useRef<HTMLDivElement>(null);
  const seen = useInView(grid, { once: true, amount: 0.35 });
  const [source, setSource] = useState<FormatId>("jpg");
  const targets = targetsOf(source);

  return (
    <section className="section matrix" id="formatos">
      <div className="wrap matrix-grid">
        <div className="matrix-head">
          <h2>{ALL_PAIRS.length} conversiones, cada una con su prueba</h2>
          <p>Un par de formatos solo aparece en la paleta si tiene tests con archivos reales. Elige una fila para ver sus destinos en el orden en que la paleta los ofrece: del 1 al 7 son también las teclas.</p>
        </div>

        <div className="matrix-body">
          <div className="mx" ref={grid} role="group" aria-label="Matriz de conversiones: filas de origen, columnas de destino">
            <div className="mx-head" aria-hidden="true">
              <span />
              {FORMATS.map((f, c) => (
                <span key={f.id} className={`mx-col${gapBefore(c)}`}>
                  {f.label}
                </span>
              ))}
            </div>
            {FORMATS.map((row, r) => (
              <div className={`mx-row${row.id === source ? " is-on" : ""}${gapBefore(r)}`} key={row.id}>
                <button type="button" className="mx-label" data-family={row.family} aria-pressed={row.id === source} onClick={() => setSource(row.id)} onMouseEnter={() => setSource(row.id)} onFocus={() => setSource(row.id)}>
                  {row.label}
                </button>
                {FORMATS.map((col, c) => {
                  const fidelity = supports(row.id, col.id);
                  const gap = gapBefore(c);
                  if (row.id === col.id) return <span key={col.id} className={`cell self${gap}`} aria-hidden="true" />;
                  if (!fidelity) return <span key={col.id} className={`cell none${gap}`} aria-hidden="true" />;
                  return (
                    <span key={col.id} className={`cell${gap}`} aria-hidden="true">
                      <motion.i
                        data-family={row.family}
                        data-fidelity={fidelity}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={seen ? { scale: 1, opacity: 1 } : {}}
                        transition={{ type: "spring", stiffness: 420, damping: 22, delay: Math.abs(r - c) * 0.04 }}
                      />
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="readout" aria-live="polite">
            <h3>
              Desde <span className="mono">{FORMATS.find((f) => f.id === source)!.label}</span>
            </h3>
            <ol>
              <AnimatePresence mode="popLayout" initial={false}>
                {targets.map((t, i) => (
                  <motion.li
                    key={`${source}-${t.id}`}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.08 } }}
                    transition={{ type: "spring", stiffness: 520, damping: 34, delay: i * 0.03 }}
                  >
                    <kbd>{i + 1}</kbd>
                    <span className="mono">{t.label}</span>
                    {t.fidelity === "lossy" && <em>con pérdida</em>}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
            <p className="legend-text">
              Hasta 7 destinos por archivo. Con varios archivos seleccionados, la paleta ofrece solo los que sirven para todos.
            </p>
          </div>
        </div>

        <ul className="legend">
          {FAMILIES.map((f) => (
            <li key={f}>
              <i data-family={f} data-fidelity="lossless" aria-hidden="true" />
              {FAMILY_NAME[f]}
            </li>
          ))}
          <li>
            <i data-family="image" data-fidelity="lossy" aria-hidden="true" />
            Hueco: con pérdida o aproximado
          </li>
        </ul>
        <p className="fineprint">Todavía no hay OCR (un PDF escaneado da un mensaje claro), HEIC, AVIF ni varias imágenes en un solo PDF.</p>
      </div>
    </section>
  );
}
