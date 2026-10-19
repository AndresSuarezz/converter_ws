import { useEffect, useState } from "react";

export const REPO = "AndresSuarezz/konverter";
export const REPO_URL = `https://github.com/${REPO}`;
export const RELEASES_URL = `${REPO_URL}/releases`;
export const ISSUES_URL = `${REPO_URL}/issues`;

export type Asset = { label: string; name: string; url: string; sizeMb: number };

export type Downloads = {
  version: string;
  pageUrl: string;
  windows: Asset | null;
  linux: Asset[];
  macos: Asset[];
  sums: Asset | null;
};

export type RepoInfo = {
  stars: number | null;
  /**
   * `ok`: hay un release con instaladores. `none`: GitHub respondió y no hay ninguno.
   * `unknown`: no se pudo consultar (sin red, límite de la API...): no se afirma nada.
   */
  release: "ok" | "none" | "unknown";
  downloads: Downloads | null;
  contributors: { login: string; avatar: string; url: string }[];
};

const EMPTY: RepoInfo = { stars: null, release: "unknown", downloads: null, contributors: [] };
const CACHE_KEY = "converter-web:repo-info:v3";
const CACHE_MS = 10 * 60 * 1000;

const readCache = (): RepoInfo | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw) as { at: number; data: RepoInfo };
    return Date.now() - at < CACHE_MS ? data : null;
  } catch {
    return null;
  }
};

const writeCache = (data: RepoInfo) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
};

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, { headers: { Accept: "application/vnd.github+json" } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

type ApiAsset = { name: string; browser_download_url: string; size: number };
type ApiRelease = { tag_name: string; html_url: string; draft: boolean; assets: ApiAsset[] };
type ApiRepo = { stargazers_count: number };
type ApiContributor = { login: string; avatar_url: string; html_url: string; type: string };

/** `v0.1.1` -> [0, 1, 1]. Se ordena por versión, no por fecha: GitHub ordena por creación. */
const versionOf = (tag: string): number[] => (tag.match(/\d+/g) ?? []).map(Number);
const newerFirst = (a: ApiRelease, b: ApiRelease): number => {
  const [x, y] = [versionOf(a.tag_name), versionOf(b.tag_name)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (y[i] ?? 0) - (x[i] ?? 0);
  return 0;
};

const asset = (label: string, a: ApiAsset): Asset => ({ label, name: a.name, url: a.browser_download_url, sizeMb: Math.round(a.size / 1_048_576) });

/** Reparte los archivos de un release por sistema operativo. Devuelve null si no hay ningún instalador. */
function toDownloads(release: ApiRelease): Downloads | null {
  const downloads: Downloads = { version: release.tag_name, pageUrl: release.html_url, windows: null, linux: [], macos: [], sums: null };
  for (const a of release.assets) {
    const n = a.name;
    if (/sha256sums/i.test(n)) downloads.sums = asset("SHA256SUMS", a);
    // El instalador normal de Windows, no la variante con LibreOffice dentro (155 MB).
    else if (/\.exe$/i.test(n) && !/libreoffice/i.test(n)) downloads.windows = asset("Instalador de Windows", a);
    else if (/\.deb$/i.test(n)) downloads.linux.push(asset("Debian y Ubuntu (.deb)", a));
    else if (/\.rpm$/i.test(n)) downloads.linux.push(asset("Fedora (.rpm)", a));
    else if (/\.appimage$/i.test(n)) downloads.linux.push(asset("AppImage", a));
    else if (/\.dmg$/i.test(n)) downloads.macos.push(asset(/aarch64|arm64/i.test(n) ? "Apple silicon (.dmg)" : "Intel (.dmg)", a));
  }
  // Orden fijo y no el de GitHub (alfabético): lo más habitual primero.
  const rank = (a: Asset) => ["Debian", "Fedora", "AppImage"].findIndex((p) => a.label.startsWith(p));
  downloads.linux.sort((a, b) => rank(a) - rank(b));
  downloads.macos.sort((a, b) => a.label.localeCompare(b.label));
  return downloads.windows || downloads.linux.length || downloads.macos.length ? downloads : null;
}

/** Datos públicos del repositorio. Todo es opcional: la página funciona igual sin ellos. */
export function useRepoInfo(): RepoInfo {
  const [info, setInfo] = useState<RepoInfo>(() => readCache() ?? EMPTY);

  useEffect(() => {
    if (readCache()) return;
    let alive = true;
    (async () => {
      const [repo, releases, people] = await Promise.all([
        getJson<ApiRepo>(""),
        // La lista incluye los pre-releases (la app está en fase inicial) y no los borradores.
        getJson<ApiRelease[]>("/releases?per_page=10"),
        getJson<ApiContributor[]>("/contributors?per_page=12"),
      ]);
      const downloads = (releases ?? [])
        .filter((r) => !r.draft)
        .sort(newerFirst)
        .map(toDownloads)
        .find((d) => d !== null) ?? null;
      const data: RepoInfo = {
        stars: repo?.stargazers_count ?? null,
        release: releases === null ? "unknown" : downloads ? "ok" : "none",
        downloads,
        contributors: (people ?? []).filter((p) => p.type === "User").map((p) => ({ login: p.login, avatar: p.avatar_url, url: p.html_url })),
      };
      if (alive) {
        setInfo(data);
        // Solo se guarda una respuesta completa: un fallo parcial no debe durar 10 minutos.
        if (repo && releases) writeCache(data);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return info;
}
