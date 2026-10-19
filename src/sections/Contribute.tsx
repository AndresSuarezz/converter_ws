import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CopyBlock } from "../components/CopyBlock";
import { ISSUES_URL, REPO_URL, type RepoInfo } from "../lib/github";

type Task = { id: string; title: string; tags: string[]; why: string; where: string[] };

const TASKS: Task[] = [
  {
    id: "mac",
    title: "Abrir Converter por primera vez en un Mac",
    tags: ["Sin código", "macOS"],
    why: "Nadie ha ejecutado la aplicación en un Mac. Descarga el .dmg de Releases (Apple silicon o Intel), ábrelo y cuenta en un issue qué pasa: si Gatekeeper lo bloquea, si aparece la paleta, qué falla. Un informe de una página desbloquea todo lo demás.",
    where: ["crates/palette-app/tauri.bundle.macos.conf.json", "docs/DISTRIBUCION.md"],
  },
  {
    id: "linux",
    title: "Atajo global y lectura de la selección en Linux",
    tags: ["Rust", "Linux"],
    why: "La paleta ya se abre con archivos pasados como argumento. Falta leer lo que seleccionas en el gestor de archivos y registrar el atajo global, con Wayland como parte difícil.",
    where: ["crates/os-shell", "crates/palette-app"],
  },
  {
    id: "ocr",
    title: "OCR local con Tesseract, descargado bajo demanda",
    tags: ["Rust"],
    why: "Hoy un PDF escaneado responde «necesita OCR». El interruptor «con OCR» de la paleta ya está previsto y falta el motor, que se descargaría solo cuando se pida, como LibreOffice.",
    where: ["crates/components", "crates/converter-core/src/pdf.rs"],
  },
  {
    id: "pdf",
    title: "Varias imágenes en un solo PDF, y HEIC",
    tags: ["Rust"],
    why: "Falta poder juntar varias imágenes seleccionadas en un único PDF. HEIC cubriría las fotos de iPhone, que hoy la paleta no reconoce.",
    where: ["crates/converter-core/src/image_conv.rs", "crates/converter-core/src/pdf_write.rs"],
  },
  {
    id: "menu",
    title: "Menú contextual del Explorador y arranque con Windows",
    tags: ["Rust", "Windows"],
    why: "Hoy se llega con el atajo, la bandeja del sistema o la línea de comandos. Falta el clic derecho sobre el archivo y que Converter arranque con Windows.",
    where: ["crates/os-shell", "crates/palette-app/nsis"],
  },
  {
    id: "docs",
    title: "Más formatos de documento: ODT, RTF, HTML y DOCX a Markdown",
    tags: ["Rust"],
    why: "WordCraft abre la puerta a estos formatos (el análisis está en docs/REFERENCIAS-CRAFT.md). Cada par nuevo necesita su conversor y su fixture con un archivo real.",
    where: ["crates/converter-core/src/office.rs", "docs/REFERENCIAS-CRAFT.md"],
  },
  {
    id: "sign",
    title: "Firma de código y auto-actualización",
    tags: ["Windows", "CI"],
    why: "El flujo de SignPath está listo y falta enviar la solicitud. Mientras tanto, SmartScreen puede avisar al abrir el instalador.",
    where: ["docs/FIRMA.md", ".github/workflows/release.yml"],
  },
];

const RULES = [
  "Una conversión solo se publica si tiene un test con un archivo real.",
  "El núcleo no entra en pánico con archivos malformados: errores como tipos, sin unwrap sobre datos del usuario.",
  "Ninguna dependencia GPL. cargo deny check lo vigila.",
  "Antes de abrir el PR: cargo fmt --all, clippy con -D warnings y cargo test --workspace. Si tocas algo visible, anótalo en docs/BITACORA.md.",
];

const COMMANDS = {
  windows: ["git clone https://github.com/AndresSuarezz/konverter.git", "cd konverter", "powershell -File scripts/fetch-pdfium.ps1", "cargo test --workspace"],
  unix: ["git clone https://github.com/AndresSuarezz/konverter.git", "cd konverter", "bash scripts/fetch-pdfium.sh", "cargo test --workspace"],
};

const SLOTS = 8;

function TaskRow({ task, open, onToggle }: { task: Task; open: boolean; onToggle: () => void }) {
  return (
    <li className="task" data-open={open || undefined}>
      <h3>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={`task-${task.id}`}>
          <span className="task-title">{task.title}</span>
          <span className="task-tags">
            {task.tags.map((t) => (
              <span key={t} data-tag={t}>
                {t}
              </span>
            ))}
          </span>
          <motion.svg viewBox="0 0 16 16" width="16" height="16" className="chev" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} aria-hidden="true">
            <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={`task-${task.id}`} className="task-body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}>
            <div className="task-inner">
              <p>{task.why}</p>
              <p className="where">
                Por dónde empezar:{" "}
                {task.where.map((w) => (
                  <code key={w}>{w}</code>
                ))}
              </p>
              <a className="btn btn-ghost btn-sm" href={`${REPO_URL}/issues/new`} target="_blank" rel="noreferrer">
                Avisar de que me la quedo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Contribute({ info }: { info: RepoInfo }) {
  const [open, setOpen] = useState<string | null>("mac");
  const [shell, setShell] = useState<"windows" | "unix">("windows");
  const people = info.contributors.slice(0, SLOTS);

  return (
    <section className="section contribute" id="contribuir">
      <div className="wrap">
        <div className="contribute-head">
          <h2>Hay trabajo para que lo hagas tú</h2>
          <p>
            Hoy Converter lo mantiene una sola persona y lo ha probado en dos equipos. Esto es lo que sigue, en orden aproximado de valor, y la primera tarea no necesita escribir una línea de código.
          </p>
        </div>

        <div className="contribute-grid">
          <ul className="tasks">
            {TASKS.map((t) => (
              <TaskRow key={t.id} task={t} open={open === t.id} onToggle={() => setOpen(open === t.id ? null : t.id)} />
            ))}
          </ul>

          <aside className="first-pr">
            <h3>Tu primer PR, en cuatro comandos</h3>
            <div className="seg" role="tablist" aria-label="Sistema operativo">
              <button type="button" role="tab" aria-selected={shell === "windows"} onClick={() => setShell("windows")}>
                Windows
              </button>
              <button type="button" role="tab" aria-selected={shell === "unix"} onClick={() => setShell("unix")}>
                Linux y macOS
              </button>
            </div>
            <CopyBlock lines={COMMANDS[shell]} title={shell === "windows" ? "PowerShell" : "bash"} label={`Comandos para clonar y probar en ${shell === "windows" ? "Windows" : "Linux y macOS"}`} />
            <p className="fineprint">Necesitas Rust 1.88 o superior y un compilador de C. Si la prueba pasa, ya puedes tocar código.</p>

            <h3>Reglas de la casa</h3>
            <ul className="rules">
              {RULES.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="wall">
          <div className="wall-copy">
            <h3>Quien contribuye aparece aquí</h3>
            <p>Cuando se acepte tu primer PR, tu avatar entrará en esta fila.</p>
          </div>
          <ul className="avatars" aria-label="Personas que han contribuido">
            {Array.from({ length: SLOTS }, (_, i) => {
              const p = people[i];
              return (
                <motion.li key={i} initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, amount: 1 }} transition={{ type: "spring", stiffness: 420, damping: 22, delay: i * 0.06 }}>
                  {p ? (
                    <a href={p.url} target="_blank" rel="noreferrer" title={p.login}>
                      <img src={p.avatar} alt={p.login} width="48" height="48" loading="lazy" />
                    </a>
                  ) : (
                    <a className="empty" href={ISSUES_URL} target="_blank" rel="noreferrer" aria-label="Lugar libre: busca una tarea en los issues">
                      <span aria-hidden="true">+</span>
                    </a>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
