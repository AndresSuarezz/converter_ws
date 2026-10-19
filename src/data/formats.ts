// Reglas de conversión portadas de converter-core (supports() de cada conversor y ranking.rs).
// La demo de la portada y la matriz de formatos salen de esta misma tabla.

export type FormatId = "jpg" | "png" | "webp" | "bmp" | "tiff" | "gif" | "csv" | "xlsx" | "json" | "doc" | "docx" | "md" | "txt" | "pdf";

export type Family = "image" | "data" | "doc" | "text" | "pdf";
export type Fidelity = "lossless" | "lossy";

type FormatInfo = { id: FormatId; label: string; family: Family };

/** Orden de la matriz: imágenes, datos, documentos, texto y PDF. */
export const FORMATS: FormatInfo[] = [
  { id: "jpg", label: "JPG", family: "image" },
  { id: "png", label: "PNG", family: "image" },
  { id: "webp", label: "WEBP", family: "image" },
  { id: "bmp", label: "BMP", family: "image" },
  { id: "tiff", label: "TIFF", family: "image" },
  { id: "gif", label: "GIF", family: "image" },
  { id: "csv", label: "CSV", family: "data" },
  { id: "xlsx", label: "XLSX", family: "data" },
  { id: "json", label: "JSON", family: "data" },
  { id: "doc", label: "DOC", family: "doc" },
  { id: "docx", label: "DOCX", family: "doc" },
  { id: "md", label: "MD", family: "text" },
  { id: "txt", label: "TXT", family: "text" },
  { id: "pdf", label: "PDF", family: "pdf" },
];

export const FAMILY_NAME: Record<Family, string> = {
  image: "Imágenes",
  data: "Datos",
  doc: "Word",
  text: "Texto",
  pdf: "PDF",
};

const BY_ID = new Map(FORMATS.map((f) => [f.id, f]));
export const formatOf = (id: FormatId): FormatInfo => BY_ID.get(id)!;

const isImage = (f: FormatId) => formatOf(f).family === "image";

/** Qué sabe hacer el motor entre dos formatos y con qué fidelidad (null = no se ofrece). */
export function supports(from: FormatId, to: FormatId): Fidelity | null {
  if (from === to) return null;
  if (isImage(from) && isImage(to)) {
    return to === "jpg" || to === "gif" || (from === "jpg" && to === "webp") ? "lossy" : "lossless";
  }
  if (isImage(from) && to === "pdf") return "lossless";
  if (from === "pdf") {
    if (to === "jpg" || to === "txt" || to === "md" || to === "docx") return "lossy";
    if (to === "png" || to === "webp" || to === "tiff") return "lossless";
    return null;
  }
  if ((from === "docx" || from === "doc" || from === "md") && to === "pdf") return "lossless";
  if (from === "doc" && to === "docx") return "lossless";
  if (from === "md" && to === "docx") return "lossless";
  if (from === "docx" && to === "txt") return "lossy";
  if ((from === "csv" && (to === "xlsx" || to === "json")) || (from === "json" && (to === "csv" || to === "xlsx"))) return "lossless";
  if (from === "xlsx" && (to === "csv" || to === "json")) return "lossy";
  return null;
}

/** Probabilidad a priori de que alguien quiera pasar de `from` a `to` (ranking.rs). */
const POPULARITY: Partial<Record<`${FormatId}>${FormatId}`, number>> = {
  "jpg>webp": 95, "jpg>png": 85, "jpg>tiff": 35, "jpg>bmp": 40, "jpg>gif": 20,
  "png>webp": 95, "png>jpg": 90, "png>bmp": 40, "png>tiff": 35, "png>gif": 25,
  "webp>png": 95, "webp>jpg": 90, "webp>bmp": 35, "webp>tiff": 30, "webp>gif": 25,
  "bmp>png": 95, "bmp>jpg": 90, "bmp>webp": 85, "bmp>tiff": 30, "bmp>gif": 20,
  "tiff>png": 95, "tiff>jpg": 90, "tiff>webp": 80, "tiff>bmp": 40, "tiff>gif": 20,
  "gif>png": 95, "gif>webp": 90, "gif>jpg": 70, "gif>bmp": 30, "gif>tiff": 30,
  "csv>xlsx": 95, "csv>json": 70, "xlsx>csv": 95, "xlsx>json": 60, "json>csv": 90, "json>xlsx": 70,
  "jpg>pdf": 75, "tiff>pdf": 75, "png>pdf": 70, "webp>pdf": 55, "bmp>pdf": 55, "gif>pdf": 30,
  "docx>pdf": 95, "doc>pdf": 95, "doc>docx": 90, "docx>txt": 60, "pdf>docx": 95,
  "md>pdf": 95, "md>docx": 75, "pdf>md": 80,
  "pdf>png": 90, "pdf>jpg": 85, "pdf>txt": 70, "pdf>webp": 45, "pdf>tiff": 30,
};

export const popularity = (from: FormatId, to: FormatId): number => POPULARITY[`${from}>${to}`] ?? 50;

export type Target = { id: FormatId; label: string; fidelity: Fidelity; score: number };

/** Destinos de `from`, del más al menos coherente (engine.rs::targets). */
export function targetsOf(from: FormatId): Target[] {
  return FORMATS.flatMap((f, order) => {
    const fidelity = supports(from, f.id);
    return fidelity ? [{ id: f.id, label: f.label, fidelity, score: popularity(from, f.id), order }] : [];
  })
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map(({ order: _order, ...target }) => target);
}

/** Todas las conversiones que ofrece el motor. */
export const ALL_PAIRS = FORMATS.flatMap((from) =>
  FORMATS.flatMap((to) => {
    const fidelity = supports(from.id, to.id);
    return fidelity ? [{ from: from.id, to: to.id, fidelity }] : [];
  }),
);

/** Los 7 pétalos se reparten en estas posiciones; la 3 es la tuerca de ajustes. */
export const FILL_ORDER = [0, 1, 2, 4, 5, 6, 7] as const;
export const SETTINGS_SLOT = 3;
