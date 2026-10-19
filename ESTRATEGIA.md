# Estrategia para dar a conocer Converter y atraer contribuciones

Documento de trabajo. Los datos de partida salen del README y de la API pública de GitHub (19 de octubre de 2026). Los objetivos numéricos son hipótesis para ajustar, no promesas.

## 1. Punto de partida, sin maquillar

| Dato | Hoy |
|---|---|
| Versión | 0.1.1, fase inicial |
| Estrellas | 2 |
| Releases publicados | 2 (v0.1.0 y v0.1.1), marcados como pre-release, con instalador de Windows, `.deb`, `.rpm`, AppImage, dos `.dmg` y `SHA256SUMS.txt` |
| Sistemas que funcionan | Windows 11, probado a mano en dos equipos |
| Linux y macOS | Compilan y se empaquetan; sin atajo, sin selección en Linux, sin abrir nunca en un Mac |
| Instalador | Sin firmar: SmartScreen avisa |
| Personas | Una (autor, revisor y aprobador) |

Esto condiciona la estrategia. El producto tiene un gancho muy bueno (un gesto, una paleta, cero trámites) y un hueco honesto (faltan manos para Mac y Linux). Conviene vender el gancho y reclutar con el hueco, sin esconderlo.

## 2. Antes de difundir nada

Sin esto, cada visita que llegue se pierde.

1. **Releases: hecho.** La web detecta sola el release de mayor versión y muestra "Descargar para Windows" y, en la sección de estado, los paquetes de Linux y macOS. Dos cosas por pulir: las notas del release deben explicar SmartScreen (la portada ya lo hace) y conviene decidir si se quita la marca de pre-release cuando la 0.2 sea estable.
2. **Preparar el repositorio.**
   - Descripción de una línea (ver sección 6) y la URL de la web en el campo *Website*.
   - Topics: `rust`, `tauri`, `file-converter`, `windows`, `open-source`, `pdf`, `image-converter`.
   - Imagen social: `public/og.jpg` de esta web ya mide 1200 × 630.
   - Un GIF o WebM de 8 segundos al principio del README (selecciona, atajo, paleta, resultado). El vídeo ya tiene ese plano.
3. **Convertir la hoja de ruta en issues.** Las siete tareas de la sección "Contribuir" de la web existen en el README pero no como issues. Crear uno por tarea, con etiquetas `help wanted`, `good first issue` (donde aplique), `sin código`, `macOS`, `linux`. La web enlaza a `/issues`; si no hay nada ahí, la invitación se queda en el aire.
4. **Una plantilla de issue "Informe de prueba en macOS / Linux"** con tres preguntas: qué sistema, qué pasó al abrir, qué pasó al convertir. Baja la barrera de entrada de la primera tarea, que no necesita código.
5. **Activar Discussions** y crear un `CONTRIBUTING.md` corto. Basta con mover allí la sección "Contribuir" del README y añadir los cuatro comandos del primer PR que ya están en la web.
6. **Desplegar la web** (Vercel o GitHub Pages) y poner el enlace en el README.
7. **Solicitar la firma de SignPath** (el flujo está listo según `docs/FIRMA.md`). Hasta entonces, el anuncio debe explicar cómo pasar SmartScreen: *Más información, Ejecutar de todas formas*.

## 3. Posicionamiento

**Frase:** Converter convierte archivos con un atajo: seleccionas, pulsas Ctrl + Alt + Espacio y eliges el formato en una paleta junto al cursor.

**A quién le hablas, en este orden:**

1. Quien convierte archivos en webs con anuncios: estudiantes, oficina, diseño. Compran la rapidez y la privacidad.
2. Desarrolladores de Rust y Tauri. Compran un proyecto pequeño, con reglas claras (un test con archivo real por conversión, sin `unwrap`, sin GPL) y trabajo real por hacer.
3. Quien tiene un Mac o un Linux. Compran ser la primera persona que lo abre.

**Cuatro mensajes, cada uno con una prueba que se puede enseñar:**

| Mensaje | Prueba |
|---|---|
| Un gesto, sin buscar nada | La demostración de la portada: archivo, atajo, `foto.webp` al lado |
| Tus archivos no salen de tu equipo | El registro con "0 conexiones"; el README lo respalda |
| No promete lo que no hace | 55 conversiones con test; estado por sistema operativo |
| Aquí hay trabajo para ti | Siete tareas con ruta del código y la primera sin código |

## 4. Embudo de contribución

Nadie pasa de visitante a mantenedor de golpe. La web y los issues deben ofrecer un peldaño en cada nivel.

| Peldaño | Qué hace la persona | Cómo se lo facilitas |
|---|---|---|
| 1. Estrella | Un clic | Botón en la navegación y en el cierre de la web |
| 2. Prueba | Descarga el instalador, el `.dmg` o el paquete de Linux y lo usa | Descargas en la web y en Releases; plantilla de informe |
| 3. Informe | Abre un issue con lo que vio | Tarea "Primera apertura en un Mac", marcada *Sin código* |
| 4. Primer PR pequeño | Añade un fixture, un test o corrige un texto | Issues `good first issue`; los cuatro comandos del primer PR |
| 5. Tarea de la hoja de ruta | Linux, OCR, varias imágenes a PDF... | Cada tarea indica los directorios por donde empezar |
| 6. Revisión y mantenimiento | Revisa PRs de otros | Se invita a quien lleve tres PRs aceptados |

**Reconocimiento, que es lo que más retiene:**

- La fila de avatares de la web se alimenta de la API de contributors: al aceptar un primer PR, la persona aparece sola.
- En las notas de cada release, una línea con el nombre de quien aportó cada cosa.
- **Primer informe desde macOS** y **primer informe desde Linux**: nombrarlos en el README y en las notas del release. Son hitos que solo pasan una vez, y eso los hace valiosos.

**Responder rápido.** Para un proyecto con una sola persona, contestar en menos de 48 horas pesa más que cualquier campaña. Un primer PR sin respuesta casi nunca vuelve.

## 5. Calendario de cuatro semanas

**Semana 0, preparación.** Todo lo de la sección 2. No se anuncia nada hasta tener release, issues y web desplegada.

**Semana 1, lanzamiento suave.** Comunidades pequeñas y cercanas, donde un mensaje honesto recibe respuesta: grupos de Rust y de desarrollo en español, el círculo personal. Objetivo: encontrar los primeros fallos y la primera persona con Mac. Corregir lo que salga antes de la semana 2.

**Semana 2, lanzamiento grande.** Un solo día, publicando por la mañana (hora del este de EE. UU.):

- Show HN (texto en la sección 6).
- Comunidad de Rust (por ejemplo r/rust, en la categoría de proyectos).
- Un hilo en español en X, Bluesky o LinkedIn.

Antes de publicar en cada sitio, lee sus reglas de autopromoción. Contesta todos los comentarios del primer día.

**Semana 3, contenido técnico.** Atrae a quien programa. Tres temas que salen del propio proyecto:

1. *Cómo ordena la paleta los destinos*: la tabla de probabilidades a priori de `ranking.rs`.
2. *Una conversión solo existe si tiene un archivo real*: el test que recorre el grafo y falla si falta un fixture.
3. *Leer la selección del Explorador con COM, incluso con pestañas*: el arreglo de la 0.1.1.

**Semana 4, cierre y agradecimientos.** Publicar la 0.2 con los nombres de quienes aportaron, enseñar qué se arregló gracias al lanzamiento y abrir la siguiente tanda de issues.

## 6. Textos listos para pegar

### Descripción corta del repositorio

> Convierte archivos con un atajo: selecciona, pulsa Ctrl+Alt+Espacio y elige el formato en una paleta radial. Rust + Tauri, sin cuentas ni internet.

### Show HN

**Título:** `Show HN: Converter, a radial palette to convert files with a hotkey (Rust, Tauri)`

> I got tired of searching for a web converter every time I needed a .webp as .jpg or a .docx as PDF. Converter lives in the tray: select files in Explorer, press Ctrl+Alt+Space, and a radial palette appears at the cursor with up to 7 target formats, ordered by how likely you are to want them. One click and the result lands next to the original (`foto.webp`, or `foto (1).webp` if it exists; it never overwrites).
>
> It does 55 conversions across images, CSV/XLSX/JSON, PDF and Word/Markdown. A conversion only ships if it has a test with a real file. Everything runs locally, with no accounts, no telemetry and no network during normal use.
>
> Honest status: it is 0.1.1 and only works end to end on Windows 11. There are .deb, .rpm, AppImage and .dmg packages in the release, but nobody has opened the app on a Mac yet, and Linux still lacks the global shortcut and reading the file manager selection. The installer is unsigned, so SmartScreen will warn.
>
> I am looking for people with a Mac or a Linux box to try it, and for Rust contributors. The roadmap and where to start in the code are in the repo.
>
> Repo: https://github.com/AndresSuarezz/konverter

### Hilo en español (X, Bluesky, LinkedIn)

1. Convertir un archivo no debería ser un trámite. Hice Converter: seleccionas, pulsas Ctrl + Alt + Espacio y eliges el formato en una paleta junto al cursor.
2. [GIF de 8 s: archivo, atajo, paleta, `foto.webp` al lado]
3. 55 conversiones: imágenes, CSV/Excel/JSON, PDF, Word y Markdown. Cada una tiene un test con un archivo real.
4. Tus archivos no salen de tu equipo. Sin cuentas, sin telemetría, sin internet para convertir. Nada se sobrescribe: si `foto.webp` existe, crea `foto (1).webp`.
5. Está en 0.1.1 y hoy solo funciona de punta a punta en Windows 11. En Mac, nadie lo ha abierto todavía. ¿Tienes un Mac? Eres la persona que falta.
6. Código abierto, en Rust. Hay siete tareas abiertas, la primera sin escribir código: [enlace a la web]

### Mensaje corto para Telegram o Discord

> Hice una app para convertir archivos sin abrir ninguna web: seleccionas, pulsas Ctrl + Alt + Espacio y eliges el formato. Es gratis y los archivos no salen de tu PC. Por ahora, solo Windows. [enlace]

## 7. Guion de vídeo corto vertical (30 s)

El vídeo de 69 s de `konverter` sirve para la web y YouTube. Para Reels, Shorts y TikTok hace falta un corte vertical que empiece por el resultado. Todo sale de las escenas que ya existen.

| Tiempo | Imagen | Texto en pantalla | Locución |
|---|---|---|---|
| 0:00 a 0:03 | Los cinco pasos de siempre tachándose uno a uno | "Convertir un archivo: 5 pasos" | "Convertir un archivo no debería llevar cinco pasos." |
| 0:03 a 0:06 | Las tres teclas hundiéndose | "Ctrl + Alt + Espacio" | "Selecciona, pulsa el atajo." |
| 0:06 a 0:15 | La paleta floreciendo junto al cursor, clic en WEBP, aparece `foto.webp` | "Un clic" | "Elige el formato en la paleta. El resultado queda junto al original." |
| 0:15 a 0:21 | El registro con "red: 0 conexiones" | "0 conexiones" | "Tus archivos no salen de tu equipo. Sin cuentas ni telemetría." |
| 0:21 a 0:27 | Las tarjetas de Windows (hecho), Linux y macOS (faltan) | "¿Tienes un Mac?" | "Hoy funciona en Windows. En Mac, nadie lo ha abierto todavía. Si tienes uno, ayúdanos a probarlo." |
| 0:27 a 0:30 | Icono y enlace | "github.com/AndresSuarezz/konverter" | "Converter. Gratis y de código abierto." |

**Versión de 15 s:** los tramos 0:03 a 0:15 y el cierre, sin la parte de plataformas. Sirve como anuncio de la descarga una vez publicado el release.

**Audio:** el vídeo actual no tiene sonido. La locución de `GUION.md` está lista para grabarse.

## 8. Qué medir

Sin analítica en la web (a propósito, coherente con lo que promete), las señales salen de GitHub.

| Señal | Dónde mirarla | Punto de partida |
|---|---|---|
| Estrellas | Página del repositorio | 2 |
| Descargas de cada archivo | Releases (cada archivo muestra su contador) | Recién publicado, sin dato |
| Visitas y referencias | Insights, Traffic | Sin dato |
| Informes de prueba en Mac o Linux | Issues con la etiqueta correspondiente | 0 |
| PRs de personas ajenas | Pull requests | 0 |
| Tiempo hasta la primera respuesta | Issues y PRs | Meta: menos de 48 horas |

**Objetivos para los 30 primeros días (hipótesis para ajustar):** al menos un informe desde Mac, uno desde Linux, tres issues abiertos por personas ajenas y un primer PR externo aceptado.

## 9. Qué evitar

- **Prometer Mac o Linux.** El anuncio dice lo que funciona hoy. La invitación a probarlos ya es parte del mensaje.
- **Esconder SmartScreen.** Mejor explicarlo en el primer párrafo de las notas del release que perder la confianza de quien lo ve.
- **Comprar estrellas, o pedirlas en masa.** Una estrella de una persona que lo usó vale más que cincuenta que no lo abrieron.
- **Publicar en cinco sitios a la vez sin poder contestar.** Mejor menos sitios y respuesta rápida.
- **Cambiar el mensaje cada semana.** Selecciona, pulsa, convierte. Es corto, es de un gesto y ya está en el vídeo.

## 10. Qué contiene la web para sostener esto

| Sección | Qué trabaja |
|---|---|
| Portada con demostración | Gancho: el producto funcionando en los primeros segundos, interactiva y con el atajo real |
| El camino de siempre | Contraste de cinco pasos contra tres |
| Vídeo | Para quien prefiere mirar a leer |
| 55 conversiones | Confianza: lo que hace y con qué fidelidad |
| Privacidad | Confianza: registro con 0 conexiones |
| Estado por sistema | Honestidad, y el origen del hueco que se pide llenar |
| Contribuir | Siete tareas con ruta del código, primer PR en cuatro comandos, reglas, fila de avatares |
| Cierre | Estrella, reportar un error, elegir una tarea, compartir |
