// Geometría de la paleta radial, portada de crates/palette-app/ui/palette.js.

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export type Pt = [number, number];

export const polar = (c: number, r: number, a: number): Pt => [c + r * Math.cos(rad(a)), c + r * Math.sin(rad(a))];

/** Ángulo central del pétalo `i` (0 = arriba, sentido horario). */
export const slotAngle = (i: number): number => -90 + i * 45;

/** Medidas de la paleta real (viewBox 460). */
export const WHEEL = { c: 230, rOut: 212, rIn: 104, gap: 4, inset: 5 } as const;
export const MID_R = (WHEEL.rOut + WHEEL.rIn) / 2;

/** Sector anular del pétalo `i`. */
export function sectorPath(i: number): string {
  const { c, rOut, rIn, gap, inset } = WHEEL;
  const mid = slotAngle(i);
  const start = mid - 22.5 + gap / 2;
  const end = mid + 22.5 - gap / 2;
  const ro = rOut - inset;
  const ri = rIn + inset;
  const dOut = deg(inset / ro);
  const dIn = deg(inset / ri);
  const [x0, y0] = polar(c, ro, start + dOut);
  const [x1, y1] = polar(c, ro, end - dOut);
  const [x2, y2] = polar(c, ri, end - dIn);
  const [x3, y3] = polar(c, ri, start + dIn);
  return `M${x0} ${y0}A${ro} ${ro} 0 0 1 ${x1} ${y1}L${x2} ${y2}A${ri} ${ri} 0 0 0 ${x3} ${y3}Z`;
}

/** Contorno de una rueda dentada con agujero (icono de la tuerca). */
export function gearPath(cx: number, cy: number, radius: number, teeth = 8): string {
  const step = 360 / teeth;
  const inner = radius * 0.78;
  const point = (r: number, a: number): Pt => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
  const pts: Pt[] = [];
  for (let k = 0; k < teeth; k++) {
    const a = k * step - 90;
    pts.push(point(inner, a - step * 0.3), point(radius, a - step * 0.17), point(radius, a + step * 0.17), point(inner, a + step * 0.3));
  }
  const hole = radius * 0.38;
  const outline = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z";
  return `${outline}M${cx + hole} ${cy}A${hole} ${hole} 0 1 0 ${cx - hole} ${cy}A${hole} ${hole} 0 1 0 ${cx + hole} ${cy}Z`;
}
