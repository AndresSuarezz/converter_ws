import { REPO_URL, type RepoInfo } from "../lib/github";

const LINKS = [
  { href: "#formatos", label: "Formatos" },
  { href: "#privacidad", label: "Privacidad" },
  { href: "#estado", label: "Estado" },
  { href: "#contribuir", label: "Contribuir" },
];

export function Nav({ info }: { info: RepoInfo }) {
  return (
    <header className="nav">
      <div className="wrap nav-row">
        <a className="brand" href="#top" aria-label="Converter, inicio">
          <img src="/icon.png" alt="" width="30" height="30" />
          <span>Converter</span>
        </a>
        <nav className="nav-links" aria-label="Secciones">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="btn btn-ghost btn-sm" href={REPO_URL} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
            <path d="M8 .6l2.2 4.6 5 .7-3.6 3.5.9 5L8 12l-4.5 2.4.9-5L.8 5.9l5-.7z" fill="currentColor" />
          </svg>
          <span>GitHub</span>
          {info.stars !== null && <span className="nav-count">{info.stars.toLocaleString("es")}</span>}
        </a>
      </div>
    </header>
  );
}
