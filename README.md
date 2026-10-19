# Web de Converter

Página de presentación de [Converter](../converter), con el vídeo de [konverter](../konverter) incrustado.
Vite, React 19, TypeScript y [Motion](https://motion.dev/docs/react) (`motion/react`). Todo se gestiona con **pnpm**.

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # comprueba tipos y genera dist/
pnpm preview
```

`dist/` es estático: sirve en Vercel, GitHub Pages o cualquier hosting.

**Al publicar, construye con la URL final** para que la vista previa al compartir en redes funcione (`og:image` exige una URL absoluta):

```bash
SITE_URL=https://tu-dominio.com pnpm build      # en PowerShell: $env:SITE_URL="https://tu-dominio.com"; pnpm build
```

La estrategia de difusión y los textos para anunciar el proyecto están en [ESTRATEGIA.md](ESTRATEGIA.md).

## Estructura

```
public/
  converter.mp4     Vídeo de 69 s (copiado de ../konverter/out)
  poster.jpg        Fotograma del vídeo
  og.jpg            Imagen para compartir en redes (1200 x 630)
  icon.png          Icono real de la aplicación
src/
  data/formats.ts   Reglas de conversión y ranking, portadas de converter-core
  lib/geometry.ts   Geometría de la paleta radial, portada de palette.js
  lib/github.ts     Estrellas, última versión y contributors desde la API pública
  components/       Demo (portada), Wheel, Keys, Nav, CopyBlock
  sections/         Before, VideoSection, Matrix, Privacy, Platforms, Contribute, Footer
  styles.css        Tokens (oscuro y claro) y estilos de cada sección
```

## Cosas que conviene saber

- **La demo y la matriz comparten datos.** `src/data/formats.ts` replica `supports()` de cada conversor y `ranking.rs`. Si cambia el motor (un formato nuevo, otra fidelidad), cambia también ahí: la demo, la matriz y la cifra "55 conversiones" se recalculan solas.
- **Las descargas son dinámicas.** `src/lib/github.ts` pide los releases a la API de GitHub (los pre-releases cuentan, los borradores no), elige el de mayor versión y reparte sus archivos por extensión: `.exe` (Windows, sin la variante con LibreOffice), `.deb`, `.rpm`, `.AppImage`, `.dmg` y `SHA256SUMS`. La portada ofrece el instalador de Windows y la sección de estado, los paquetes de cada sistema. Si no hay ninguno, la portada enlaza al repositorio y lo avisa; si la API no responde, no afirma nada.
- **Si cambia el estado de Linux o macOS**, edita `ROWS` en `src/sections/Platforms.tsx`. Las tareas abiertas están en `TASKS` de `src/sections/Contribute.tsx`.
- **Sin cookies ni analítica.** Las fuentes están autoalojadas (`@fontsource`). La única petición externa es a la API pública de GitHub, con caché de 10 minutos en `sessionStorage`.
- **Movimiento reducido.** `MotionConfig reducedMotion="user"` quita las transformaciones; la demostración automática no arranca y el tachado de "El camino de siempre" aparece ya hecho.
- **Atajo real.** En la demo, `Ctrl + Alt + Espacio` abre la paleta, `1` a `7` eligen un pétalo y `Esc` cierra.
