import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

export function VideoSection() {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const play = () => {
    setStarted(true);
    // Si el navegador rechaza la reproducción, los controles nativos ya están a la vista.
    video.current?.play().catch(() => undefined);
  };

  return (
    <section className="section video" id="video">
      <div className="wrap video-grid">
        <div className="video-copy">
          <h2>Míralo en 69 segundos</h2>
          <p>El vídeo recorre el atajo, la paleta, los formatos que convierte, qué pasa con tus archivos y en qué punto está cada sistema operativo. Va sin sonido.</p>
        </div>
        <div className="player">
          <video ref={video} src="/converter.mp4" poster="/poster.jpg" preload="none" controls={started} playsInline onPause={(e) => e.currentTarget.ended && setStarted(false)} />
          <AnimatePresence>
            {!started && (
              <motion.button
                type="button"
                className="play"
                onClick={play}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.08 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                </svg>
                Ver el vídeo, 1:09
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
