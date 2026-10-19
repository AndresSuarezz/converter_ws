import { motion, useInView } from "motion/react";
import { useRef } from "react";

const LOG: { k: string; v: string; ok?: boolean }[] = [
  { k: "leer", v: "foto.jpg, desde tu carpeta" },
  { k: "motor", v: "libwebp, dentro de la app" },
  { k: "escribir", v: "foto.webp, junto al original" },
  { k: "red", v: "0 conexiones", ok: true },
];

const FACTS = [
  { h: "Sin cuentas ni telemetría", p: "No hay registro, ni analítica, ni nada que enviar. Convertir no necesita internet." },
  { h: "Nada se sobrescribe", p: "El resultado se escribe de una vez junto al original. Si foto.webp ya existe, se crea foto (1).webp." },
  { h: "El motor viaja dentro", p: "pdfium y WordCraft vienen en el instalador, que pesa unos 16 MB. Solo PDF a Word necesita LibreOffice, y la app ofrece descargarlo una vez (374 MB), con tamaño y huella SHA-256 verificados." },
  { h: "Código abierto y sin GPL", p: "Escrito en Rust, con licencia MIT o Apache-2.0 a tu elección. cargo deny vigila que no entre ninguna dependencia GPL." },
];

export function Privacy() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });

  return (
    <section className="section privacy" id="privacidad">
      <div className="wrap privacy-grid">
        <div className="privacy-copy">
          <h2>Tus archivos no salen de tu equipo</h2>
          <dl className="facts">
            {FACTS.map((f) => (
              <div key={f.h}>
                <dt>{f.h}</dt>
                <dd>{f.p}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="log" ref={ref} role="img" aria-label="Registro de una conversión: lee, convierte y escribe en tu equipo, con cero conexiones de red">
          <div className="log-bar">
            <span className="window-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>foto.jpg a WEBP</span>
          </div>
          <div className="log-body" aria-hidden="true">
            {LOG.map((line, i) => (
              <motion.p
                key={line.k}
                className={line.ok ? "log-line is-ok" : "log-line"}
                initial={{ opacity: 0, x: -8 }}
                animate={seen ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.25 + i * 0.42, duration: 0.3, ease: [0.2, 0, 0, 1] }}
              >
                <span className="log-k">{line.k}</span>
                <span className="log-v">{line.v}</span>
              </motion.p>
            ))}
            <motion.span className="caret" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.1, repeat: Infinity }} />
          </div>
        </div>
      </div>
    </section>
  );
}
