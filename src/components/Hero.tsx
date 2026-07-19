"use client";

import { useEffect, useRef, useState } from "react";
import { EchoTrigger } from "./ChatBot";

const LINES = [
  "Neprodávám AI.",
  "Ukazuju, co umí.",
  "Dává to smysl.",
];

const TYPE_SPEED = 80;
const PAUSE_AFTER_LINE = 2500;
const BLINK_COUNT = 4;
const BLINK_DURATION = 150;
const BLINK_GAP = 150;
const BLUR_FADE_DURATION = 1000;
const PAUSE_BEFORE_NEXT = 800;

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Refy — žádný state, žádný re-rendery
  const currentLineRef = useRef(0);
  const cancelledRef = useRef(false);
  const runningRef = useRef(false);

  // Spuštění animace pro aktuální řádek
  const startTyping = useRef<() => void>(() => {});

  startTyping.current = () => {
    if (runningRef.current) return;
    runningRef.current = true;
    cancelledRef.current = false;

    const line = LINES[currentLineRef.current];
    if (!line) {
      runningRef.current = false;
      return;
    }

    let pos = 0;

    // Fáze 1: Psaní
    const typeChar = () => {
      if (cancelledRef.current) return;
      if (pos < line.length) {
        pos++;
        setText(line.slice(0, pos));
        setTimeout(typeChar, TYPE_SPEED);
      } else {
        // Fáze 2: Pauza
        setTimeout(() => {
          if (cancelledRef.current) return;
          // Fáze 3: Blikání
          let blinkCount = 0;
          const doBlink = () => {
            if (cancelledRef.current) return;
            if (blinkCount >= BLINK_COUNT) {
              // Fáze 4: Blur fade
              setCursorVisible(false);
              setFading(true);
              setTimeout(() => {
                if (cancelledRef.current) return;
                setText("");
                setFading(false);
                // Fáze 5: Pauza před dalším
                setTimeout(() => {
                  if (cancelledRef.current) return;
                  currentLineRef.current = (currentLineRef.current + 1) % LINES.length;
                  setCursorVisible(true);
                  runningRef.current = false;
                  // Spustit další cyklus
                  setTimeout(() => startTyping.current(), 50);
                }, PAUSE_BEFORE_NEXT);
              }, BLUR_FADE_DURATION);
              return;
            }
            setCursorVisible(false);
            setTimeout(() => {
              if (cancelledRef.current) return;
              setCursorVisible(true);
              blinkCount++;
              setTimeout(doBlink, BLINK_GAP);
            }, BLINK_DURATION);
          };
          setTimeout(doBlink, 200);
        }, PAUSE_AFTER_LINE);
      }
    };

    setTimeout(typeChar, 100);
  };

  // Start na mount
  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (reducedMotion) {
      setText(LINES.join("\n"));
      return;
    }
    const timer = setTimeout(() => startTyping.current(), 500);
    return () => {
      cancelledRef.current = true;
      clearTimeout(timer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Kurzor blikání
  useEffect(() => {
    if (reducedMotion || fading || !text) return;
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, [reducedMotion, fading, text]);

  // Parallax scroll
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    function handleScroll() {
      if (!el) return;
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / window.innerHeight, 1);
      el.style.transform = `translateY(${-Math.min(scrollY * 0.15, 50)}px)`;
      el.style.opacity = String(Math.max(1 - progress * 1.4, 0));
      el.style.filter = `blur(${Math.min(progress * 12, 8)}px)`;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      data-context-section="hero"
      className="hero-bg relative flex min-h-[100svh] flex-col items-center justify-center px-5 pt-20 text-center"
    >
      <div className="hero-grid" aria-hidden="true" />

      <div className="container-narrow relative z-10">
        <div
          ref={textRef}
          style={{
            willChange: "transform, opacity, filter",
            transition: "transform 0.1s linear, opacity 0.1s linear, filter 0.1s linear",
          }}
        >
          <p className="eyebrow mb-4 animate-fade-in-up" style={{ color: "var(--gold)" }}>
            Petr Piskáček
          </p>

          <div className="mb-4 flex justify-center">
            <EchoTrigger sectionId="hero" />
          </div>

          <div
            className="relative mb-12 flex items-center justify-center sm:mb-16"
            style={{ minHeight: "6rem" }}
          >
            <h1
              className="headline-xl text-center"
              style={{
                filter: fading ? "blur(8px)" : "blur(0px)",
                opacity: fading ? 0 : 1,
                transition: `filter ${BLUR_FADE_DURATION}ms ease-out, opacity ${BLUR_FADE_DURATION}ms ease-out`,
              }}
            >
              {text}
              {text && !fading && (
                <span
                  className={`inline-block w-[3px] h-[0.8em] ml-1 align-middle transition-opacity duration-100 ${
                    cursorVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ backgroundColor: "var(--gold)" }}
                />
              )}
            </h1>
          </div>

          <div
            className="flex animate-fade-in-up flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
            style={{ animationDelay: "0.4s" }}
          >
            <a href="#pribeh" className="btn-apple btn-apple-primary w-full sm:w-auto">
              Zajímá tě proč?
            </a>
            <a href="#projekty" className="btn-apple btn-apple-secondary w-full sm:w-auto">
              Prozkoumat projekty
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
