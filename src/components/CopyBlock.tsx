import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

type Props = { lines: string[]; title: string; label: string };

export function CopyBlock({ lines, title, label }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(0);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* sin permiso de portapapeles: la persona puede seleccionar el texto */
    }
  };

  return (
    <div className="codeblock">
      <div className="codeblock-bar">
        <span>{title}</span>
        <button type="button" className="copy" onClick={copy}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={copied ? "ok" : "copy"} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.12 }}>
              {copied ? "Copiado" : "Copiar"}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <pre aria-label={label}>
        <code>
          {lines.map((l) => (
            <span key={l} className="code-line">
              {l}
            </span>
          ))}
        </code>
      </pre>
      <span className="sr-only" role="status">
        {copied ? "Comandos copiados al portapapeles" : ""}
      </span>
    </div>
  );
}
