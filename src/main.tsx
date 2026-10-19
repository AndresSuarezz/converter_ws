import "@fontsource-variable/bricolage-grotesque/wght.css";
import "@fontsource-variable/instrument-sans/wght.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
