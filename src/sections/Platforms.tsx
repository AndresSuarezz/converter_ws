import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { RELEASES_URL, type Asset, type Downloads, type RepoInfo } from "../lib/github";

const STEPS = ["Compila", "Se empaqueta", "Se abre en un equipo real", "Atajo y selección de archivos", "Probado a mano"] as const;

type Key = "windows" | "linux" | "macos";
type Row = { key: Key; os: string; headline: string; detail: string; done: [boolean, boolean, boolean, boolean, boolean] };

const ROWS: Row[] = [
  {
    key: "windows",
    os: "Windows 11",
    headline: "Funciona de extremo a extremo",
    detail: "Atajo global, selección del Explorador, paleta, conversión, instalador y desinstalación, probado a mano en dos equipos. Windows 10 sigue sin probar.",
    done: [true, true, true, true, true],
  },
  {
    key: "linux",
    os: "Linux",
    headline: "Compila y se empaqueta, sin atajo ni selección",
    detail: "148 tests pasan, clippy sale limpio y se generan .deb, .rpm y AppImage. Falta leer la selección del gestor de archivos, el atajo global y ver la ventana en un escritorio real.",
    done: [true, true, false, false, false],
  },
  {
    key: "macos",
    os: "macOS",
    headline: "Compila en la CI, nadie lo ha abierto",
    detail: "GitHub compila, pasa clippy y los tests, y construye el .dmg para Apple silicon e Intel. Nadie ha ejecutado la aplicación en un Mac, y sin firmar ni notarizar macOS la bloqueará.",
    done: [true, true, false, false, false],
  },
];

function Track({ done }: { done: Row["done"] }) {
  const ref = useRef<HTMLOListElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.8 });
  return (
    <ol className="track" ref={ref}>
      {STEPS.map((label, i) => (
        <li key={label} data-done={done[i] || undefined}>
          <motion.span
            className="dot"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={seen ? { scale: 1, opacity: 1 } : {}}
            transition={{ type: "spring", stiffness: 480, damping: 22, delay: i * 0.08 }}
            aria-hidden="true"
          />
          <span className="track-label">
            {label}
            <span className="sr-only">{done[i] ? ": hecho" : ": falta"}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

const assetsFor = (key: Key, d: Downloads): Asset[] => (key === "windows" ? (d.windows ? [d.windows] : []) : d[key]);

/** Descargas del último release para este sistema; si no se pudieron consultar, un enlace a Releases. */
function OsDownloads({ row, downloads }: { row: Row; downloads: Downloads | null }) {
  const assets = downloads ? assetsFor(row.key, downloads) : [];
  if (!assets.length) {
    return (
      <p className="downloads">
        <a className="btn btn-ghost btn-sm" href={RELEASES_URL} target="_blank" rel="noreferrer">
          Ver en Releases
        </a>
      </p>
    );
  }
  return (
    <p className="downloads">
      {assets.map((a) => (
        <a key={a.name} className="btn btn-ghost btn-sm" href={a.url}>
          {a.label}
          <small>{a.sizeMb} MB</small>
        </a>
      ))}
    </p>
  );
}

export function Platforms({ info }: { info: RepoInfo }) {
  const d = info.downloads;
  return (
    <section className="section platforms" id="estado">
      <div className="wrap">
        <div className="platforms-head">
          <h2>Funciona en Windows. Linux y macOS necesitan manos</h2>
          <p>
            {d ? `La última versión publicada es la ${d.version.replace(/^v/, "")}, en fase inicial.` : "Converter está en fase inicial."} Este es el estado de cada sistema, sin maquillar.
          </p>
        </div>
        <div className="os-list">
          {ROWS.map((r) => (
            <article className="os" key={r.os}>
              <div className="os-text">
                <h3>{r.os}</h3>
                <p className="os-headline">{r.headline}</p>
                <p>{r.detail}</p>
                <OsDownloads row={r} downloads={d} />
              </div>
              <Track done={r.done} />
            </article>
          ))}
        </div>
        {d?.sums && (
          <p className="fineprint">
            Cada release incluye <a href={d.sums.url}>SHA256SUMS.txt</a> para comprobar que la descarga no se corrompió.
          </p>
        )}
        <p className="platforms-cta">
          ¿Tienes un Mac o un Linux a mano? <a href="#contribuir">Eres la persona que falta.</a>
        </p>
      </div>
    </section>
  );
}
