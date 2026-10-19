import { motion } from "motion/react";
import { REPO_URL, RELEASES_URL, type RepoInfo } from "../lib/github";
import { Demo } from "./Demo";

const HEADLINE = ["Convertir", "un", "archivo", "no", "debería", "ser", "un", "trámite."];

const word = {
  hidden: { opacity: 0, y: "0.45em", filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

/** Ocho pétalos de contorno que giran muy despacio detrás de la demo. */
function Halo() {
  return (
    <motion.svg className="halo" viewBox="-250 -250 500 500" aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 140, ease: "linear", repeat: Infinity }}>
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} transform={`rotate(${i * 45})`} d="M-62 -236A246 246 0 0 1 62 -236L44 -122A130 130 0 0 0 -44 -122Z" />
      ))}
    </motion.svg>
  );
}

export function Hero({ info }: { info: RepoInfo }) {
  const noRelease = info.release === "none";
  const windows = info.downloads?.windows ?? null;
  return (
    <section className="hero" id="top">
      <Halo />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.h1 initial="hidden" animate="show" transition={{ staggerChildren: 0.06, delayChildren: 0.1 }} aria-label={HEADLINE.join(" ")}>
            {HEADLINE.map((w, i) => (
              <motion.span key={i} className="h1-word" variants={word} transition={{ type: "spring", stiffness: 260, damping: 26 }} aria-hidden="true">
                {w}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p className="lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}>
            Selecciona un archivo, pulsa <b>Ctrl + Alt + Espacio</b> y elige el formato en una paleta que aparece junto al cursor. El resultado queda al lado del original y no se sobrescribe nada.
          </motion.p>
          <motion.div className="cta-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85, duration: 0.5 }}>
            {windows ? (
              <a className="btn btn-primary" href={windows.url}>
                Descargar para Windows
                <small>
                  {info.downloads!.version}, {windows.sizeMb} MB
                </small>
              </a>
            ) : (
              <a className="btn btn-primary" href={REPO_URL} target="_blank" rel="noreferrer">
                Ver el código en GitHub
              </a>
            )}
            <a className="btn btn-ghost" href="#video">
              Míralo en 69 segundos
            </a>
          </motion.div>
          {windows && (
            <p className="note">
              Como el instalador aún no está firmado, Windows SmartScreen puede avisar: pulsa <em>Más información</em> y <em>Ejecutar de todas formas</em>. También hay paquetes para Linux y macOS, todavía sin probar: <a href="#estado">mira el estado</a>.
            </p>
          )}
          {noRelease && (
            <p className="note">
              El instalador todavía no está en <a href={RELEASES_URL}>Releases</a>. Mientras tanto se compila desde el código, con las instrucciones de <a href="#contribuir">más abajo</a>.
            </p>
          )}
          <motion.p className="trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }}>
            Gratis y de código abierto (MIT o Apache-2.0). Sin cuentas, sin telemetría y sin internet para convertir. Hoy funciona en Windows 11.
          </motion.p>
        </div>
        <Demo />
      </div>
    </section>
  );
}
