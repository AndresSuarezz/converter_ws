import { motion } from "motion/react";
import { useState } from "react";
import { KeyCombo } from "../components/Keys";
import { REPO_URL, type RepoInfo } from "../lib/github";

const SHARE_TEXT = "Converter: selecciona un archivo, pulsa Ctrl + Alt + Espacio y elige el formato. Gratis, de código abierto y sin que tus archivos salgan del equipo.";

export function Footer({ info }: { info: RepoInfo }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window === "undefined" ? REPO_URL : window.location.href.split("#")[0];
  const enc = encodeURIComponent;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* sin portapapeles */
    }
  };

  return (
    <footer className="footer" id="final">
      <div className="wrap">
        <div className="closing">
          <motion.div className="closing-keys" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.8 }}>
            <KeyCombo keys={["Ctrl", "Alt", "Espacio"]} size="lg" />
          </motion.div>
          <h2>Selecciona. Pulsa. Convierte.</h2>
          <p>Y si algo falla, o falta, cuéntalo: un issue bien escrito ayuda tanto como un PR.</p>
          <div className="cta-row">
            <a className="btn btn-primary" href={REPO_URL} target="_blank" rel="noreferrer">
              {info.stars !== null ? `Dar una estrella (${info.stars.toLocaleString("es")})` : "Dar una estrella en GitHub"}
            </a>
            <a className="btn btn-ghost" href={`${REPO_URL}/issues/new`} target="_blank" rel="noreferrer">
              Reportar un error
            </a>
            <a className="btn btn-ghost" href="#contribuir">
              Elegir una tarea
            </a>
          </div>
          <div className="share">
            <span>Cuéntaselo a quien convierta archivos a mano:</span>
            <a href={`https://twitter.com/intent/tweet?text=${enc(SHARE_TEXT)}&url=${enc(url)}`} target="_blank" rel="noreferrer">
              X
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <button type="button" className="link-button" onClick={copy}>
              {copied ? "Enlace copiado" : "Copiar enlace"}
            </button>
          </div>
        </div>

        <div className="legal">
          <p>
            Licencia <a href={`${REPO_URL}/blob/main/LICENSE-MIT`}>MIT</a> o <a href={`${REPO_URL}/blob/main/LICENSE-APACHE`}>Apache-2.0</a>, a tu elección. pdfium (BSD-3) y LibreOffice (MPL-2.0) conservan sus licencias.
          </p>
          <p>Esta página no usa cookies ni analítica. Solo pide a la API pública de GitHub las estrellas, la última versión y las personas que contribuyen.</p>
        </div>
      </div>
    </footer>
  );
}
