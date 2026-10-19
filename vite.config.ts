import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Las redes sociales exigen una URL absoluta en og:image. Al construir con SITE_URL
// (por ejemplo SITE_URL=https://converter.example pnpm build) se reescribe; sin ella se deja la ruta relativa.
export default defineConfig(({ mode }) => {
  const site = loadEnv(mode, ".", "").SITE_URL?.replace(/\/$/, "");
  return {
    plugins: [
      react(),
      {
        name: "absolute-social-urls",
        transformIndexHtml: (html: string) =>
          site
            ? html
                .replace('content="/og.jpg"', `content="${site}/og.jpg"`)
                .replace("</head>", `    <link rel="canonical" href="${site}/" />\n    <meta property="og:url" content="${site}/" />\n  </head>`)
            : html,
      },
    ],
  };
});
