import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type FormatId, type Target, formatOf, targetsOf } from "../data/formats";
import { KeyCombo } from "./Keys";
import { Wheel, petalCenter, slotOfTarget, type WheelPhase } from "./Wheel";

type FileItem = { id: string; name: string; fmt: FormatId; size: string; fresh?: boolean; born?: number };

/** Con más filas la ventana crecería sin fin y la paleta quedaría lejos del centro. */
const MAX_FILES = 12;

const SEED: FileItem[] = [
  { id: "foto", name: "foto.jpg", fmt: "jpg", size: "2,4 MB" },
  { id: "informe", name: "informe.docx", fmt: "docx", size: "86 KB" },
  { id: "ventas", name: "ventas 2026.csv", fmt: "csv", size: "12 KB" },
  { id: "factura", name: "factura.pdf", fmt: "pdf", size: "240 KB" },
  { id: "notas", name: "notas.md", fmt: "md", size: "3 KB" },
  { id: "captura", name: "captura.png", fmt: "png", size: "640 KB" },
];

const SHORTCUT = ["Ctrl", "Alt", "Espacio"];
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const splitName = (name: string) => {
  const dot = name.lastIndexOf(".");
  return { base: name.slice(0, dot), ext: name.slice(dot + 1) };
};

/** `foto.webp`, y si ya existe, `foto (1).webp`: la app nunca sobrescribe. */
function uniqueName(source: string, ext: string, taken: Set<string>): string {
  const { base } = splitName(source);
  let name = `${base}.${ext}`;
  for (let n = 1; taken.has(name); n++) name = `${base} (${n}).${ext}`;
  return name;
}

function FileBadge({ fmt }: { fmt: FormatId }) {
  const { family, label } = formatOf(fmt);
  return (
    <span className="badge" data-family={family} aria-hidden="true">
      {label}
    </span>
  );
}

export function Demo() {
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { once: true, amount: 0.5 });
  /** El atajo solo responde mientras la demo se ve: Ctrl + Alt + Espacio no debe abrir nada fuera de pantalla. */
  const visible = useInView(stage, { amount: 0.25 });
  const reduced = useReducedMotion();

  const [files, setFiles] = useState<FileItem[]>(SEED);
  const [selectedId, setSelectedId] = useState("foto");
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<WheelPhase>("idle");
  const [chosen, setChosen] = useState<FormatId | null>(null);
  const [resultName, setResultName] = useState<string | null>(null);
  const [hot, setHot] = useState<FormatId | null>(null);
  const [cursor, setCursor] = useState<number | "center" | null>(null);
  const [down, setDown] = useState<boolean[]>([false, false, false]);
  const [announce, setAnnounce] = useState("");
  const [touched, setTouched] = useState(false);

  // Cada acción nueva invalida las esperas pendientes de la anterior (demostración incluida).
  const run = useRef(0);
  const auto = useRef(false);
  /** Si la persona ya tocó algo antes de que arrancara la pasada automática, esta no se ejecuta. */
  const interacted = useRef(false);
  const filesRef = useRef(files);
  filesRef.current = files;

  const selected = files.find((f) => f.id === selectedId) ?? files[0];
  const targets = targetsOf(selected.fmt);

  const cancel = useCallback(() => {
    run.current++;
    setOpen(false);
    setPhase("idle");
    setChosen(null);
    setHot(null);
    setCursor(null);
    setDown([false, false, false]);
  }, []);

  const convert = useCallback(
    async (target: Target) => {
      const mine = ++run.current;
      const alive = () => run.current === mine;
      const source = filesRef.current.find((f) => f.id === selectedId) ?? filesRef.current[0];
      setChosen(target.id);
      setPhase("busy");
      await wait(720);
      if (!alive()) return;
      const name = uniqueName(source.name, target.id, new Set(filesRef.current.map((f) => f.name)));
      setResultName(name);
      setPhase("done");
      await wait(560);
      if (!alive()) return;
      const born = Date.now();
      const id = `${name}-${born}`;
      setFiles((prev) => {
        const at = prev.findIndex((f) => f.id === source.id) + 1;
        const next = [...prev];
        next.splice(at, 0, { id, name, fmt: target.id, size: "nuevo", fresh: true, born });
        if (next.length > MAX_FILES) {
          const oldest = next.filter((f) => f.born !== undefined && f.id !== id).sort((a, b) => a.born! - b.born!)[0];
          return oldest ? next.filter((f) => f.id !== oldest.id) : next;
        }
        return next;
      });
      setAnnounce(`${name} creado junto a ${source.name}`);
      setOpen(false);
      setPhase("idle");
      setChosen(null);
      setHot(null);
      setCursor(null);
      await wait(2600);
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, fresh: false } : f)));
    },
    [selectedId],
  );

  const summon = useCallback(async () => {
    const mine = ++run.current;
    setDown([true, true, true]);
    await wait(160);
    if (run.current !== mine) return;
    setDown([false, false, false]);
    setPhase("idle");
    setOpen(true);
  }, []);

  /** Atajo real: Ctrl + Alt + Espacio abre la paleta, Esc la cierra y 1 a 7 eligen un pétalo. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!visible) return;
      if (e.ctrlKey && e.altKey && e.code === "Space") {
        e.preventDefault();
        interacted.current = true;
        setTouched(true);
        if (open) cancel();
        else void summon();
      } else if (open && e.key === "Escape") {
        cancel();
      } else if (open && phase === "idle" && /^[1-7]$/.test(e.key)) {
        const target = targets[Number(e.key) - 1];
        if (target) void convert(target);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, open, phase, targets, cancel, summon, convert]);

  /** Una pasada automática la primera vez que la demo entra en pantalla: foto.jpg a WEBP. */
  useEffect(() => {
    if (!inView || reduced || interacted.current) return;
    const mine = ++run.current;
    const alive = () => run.current === mine;
    auto.current = true;
    (async () => {
      await wait(900);
      if (!alive()) return;
      for (let i = 0; i < 3; i++) {
        setDown((d) => d.map((_, j) => d[j] || j === i));
        await wait(140);
        if (!alive()) return;
      }
      await wait(220);
      if (!alive()) return;
      setDown([false, false, false]);
      setOpen(true);
      setCursor("center");
      await wait(1000);
      if (!alive()) return;
      const top = targetsOf("jpg")[0];
      setCursor(slotOfTarget(0));
      await wait(650);
      if (!alive()) return;
      setHot(top.id);
      await wait(520);
      if (!alive()) return;
      auto.current = false;
      await convert(top);
    })();
    return () => {
      run.current++;
    };
    // convert depende de selectedId, que no cambia durante la pasada automática
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced]);

  const choose = (id: string) => {
    if (open) return;
    interacted.current = true;
    setTouched(true);
    setSelectedId(id);
  };

  const reset = () => {
    cancel();
    setFiles(SEED);
    setSelectedId("foto");
    setAnnounce("Carpeta restablecida");
  };

  const sourceName = targets.length ? selected.name : "Sin conversiones";
  const hasResults = files.length > SEED.length;
  const cursorPos = cursor === "center" ? [230, 230] : cursor === null ? null : petalCenter(cursor);

  /** Tocar la demostración mientras se reproduce sola la detiene y deja el control a la persona. */
  const takeOver = () => {
    if (!auto.current) return;
    auto.current = false;
    setTouched(true);
    cancel();
  };

  return (
    <div className="demo" ref={stage} onPointerDownCapture={takeOver} onKeyDownCapture={takeOver}>
      <div className="stage" data-open={open || undefined}>
        <div className="window" aria-label="Carpeta de ejemplo">
          <div className="window-bar">
            <span className="window-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="window-title">Descargas</span>
          </div>
          <LayoutGroup>
            <motion.ul className="files" layout>
              <AnimatePresence initial={false}>
                {files.map((f) => (
                  <motion.li
                    key={f.id}
                    layout="position"
                    initial={{ opacity: 0, y: -10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    transition={{ type: "spring", stiffness: 480, damping: 34 }}
                  >
                    <button type="button" className="file" data-fresh={f.fresh || undefined} aria-pressed={f.id === selectedId} onClick={() => choose(f.id)}>
                      <FileBadge fmt={f.fmt} />
                      <span className="file-name">{f.name}</span>
                      <span className="file-size">{f.size}</span>
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </LayoutGroup>
          <div className="window-foot">
            <span>{files.length} elementos</span>
            {hasResults && (
              <button type="button" className="link-button" onClick={reset}>
                Restablecer carpeta
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="wheel-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.14 } }}
              onPointerDown={(e) => {
                // Mientras convierte no se cierra: se perdería el resultado.
                if (e.target === e.currentTarget && phase === "idle") cancel();
              }}
            >
              <motion.div
                className="wheel-box"
                initial={{ scale: 0.82 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.92, transition: { duration: 0.14 } }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
              >
                <Wheel
                  source={{ id: selected.fmt, name: sourceName }}
                  targets={targets}
                  phase={phase}
                  chosen={chosen}
                  resultName={resultName}
                  hot={hot}
                  onPick={(t) => {
                    interacted.current = true;
                    setTouched(true);
                    void convert(t);
                  }}
                />
                <AnimatePresence>
                  {cursorPos && (
                    <motion.svg
                      className="cursor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      initial={{ opacity: 0, left: "50%", top: "50%" }}
                      animate={{ opacity: 1, left: `${(cursorPos[0] / 460) * 100}%`, top: `${(cursorPos[1] / 460) * 100}%` }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 110, damping: 20 }}
                    >
                      <path d="M5 3l14 7.5-6.2 1.8L9.7 19z" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="demo-trigger">
        <button
          type="button"
          className="trigger"
          onClick={() => {
            interacted.current = true;
            setTouched(true);
            if (open) cancel();
            else void summon();
          }}
          aria-expanded={open}
        >
          <KeyCombo keys={SHORTCUT} pressed={down} size="lg" />
          <span className="trigger-text">{open ? "Pulsa Esc o elige un formato" : touched ? "Pulsa el atajo, o toca aquí" : "Ahora tú: elige un archivo y toca aquí"}</span>
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
