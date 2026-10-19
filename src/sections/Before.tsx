import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { KeyCombo } from "../components/Keys";

const OLD = ["Buscar un conversor en internet", "Subir tu archivo a un servidor ajeno", "Esperar a que termine", "Cerrar los anuncios", "Descargar el resultado"];
const NEW = ["Selecciona el archivo en el Explorador", "Pulsa el atajo", "Elige el formato en la paleta"];

function Struck({ text, progress, index, still }: { text: string; progress: MotionValue<number>; index: number; still: boolean }) {
  const from = 0.12 + index * 0.1;
  const line = useTransform(progress, [from, from + 0.09], [0, 1]);
  const fade = useTransform(progress, [from, from + 0.09], [1, 0.5]);
  return (
    <motion.li style={{ opacity: still ? 0.5 : fade }}>
      <span className="struck">
        {text}
        <motion.i className="strike" style={{ scaleX: still ? 1 : line }} aria-hidden="true" />
      </span>
    </motion.li>
  );
}

function Fresh({ text, progress, index, still }: { text: string; progress: MotionValue<number>; index: number; still: boolean }) {
  const from = 0.58 + index * 0.1;
  const lit = useTransform(progress, [from, from + 0.1], [0.22, 1]);
  const shift = useTransform(progress, [from, from + 0.1], [10, 0]);
  return (
    <motion.li style={{ opacity: still ? 1 : lit, x: still ? 0 : shift }}>
      <span className="step-n" aria-hidden="true">
        {index + 1}
      </span>
      <span>{text}</span>
    </motion.li>
  );
}

export function Before() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 78%", "center 42%"] });
  const keysDown = useTransform(scrollYProgress, [0.84, 0.9], [0, 1]);

  return (
    <section className="section before" id="como" ref={ref}>
      <div className="wrap before-grid">
        <div className="before-head">
          <h2>El camino de siempre tiene cinco pasos</h2>
          <p>Convertir un .webp en .jpg, un .docx en PDF o un .csv en Excel suele empezar buscando una web que lo haga. Converter lo deja en tres, sin salir de la carpeta donde ya estás.</p>
        </div>
        <ul className="old-steps">
          {OLD.map((t, i) => (
            <Struck key={t} text={t} progress={scrollYProgress} index={i} still={reduced} />
          ))}
        </ul>
        <div className="new-steps">
          <h3>Con Converter</h3>
          <ol>
            {NEW.map((t, i) => (
              <Fresh key={t} text={t} progress={scrollYProgress} index={i} still={reduced} />
            ))}
          </ol>
          <motion.div className="new-keys" style={{ opacity: reduced ? 1 : keysDown }}>
            <KeyCombo keys={["Ctrl", "Alt", "Espacio"]} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
