"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { EchoTrigger } from "./ChatBot";

// Každej řádek je samostatná "myšlenka" — napíše se, chvíli počká, blikne, zmizí.
const LINES = [
  "Neprodávám AI.",
  "Ukazuju, co umí.",
  "A proč to dává smysl.",
];

// Rychlost psaní (ms na znak)
const TYPE_SPEED = 80;
// Pauza po dopsání (ms)
const PAUSE_AFTER_LINE = 2500;
// Blikání na konci — počet bliknutí
const BLINK_COUNT = 4;
// Délka jednoho bliknutí (ms)
const BLINK_DURATION = 150;
// Pauza mezi bliknutími (ms)
const BLINK_GAP = 150;
// Délka blur fade-out efektu (ms)
const BLUR_FADE_DURATION = 1000;
// Pauza před začátkem psaní dalšího řádku (ms)
const PAUSE_BEFORE_NEXT = 800;

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Stav: "idle" = ready na další akci, "busy" = probíhá animace
  const [ready, setReady] = useState(true);
  // Fade stav: null = normální, "fading" = probíhá blur fade
  const [fading, setFading] = useState(false);

  // --- Blikání kurzoru (jen když je text a není fade) ---
  useEffect(() => {
    if (reducedMotion || fading || !text) return;
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, [reducedMotion, fading, text]);

  // --- Callback: animace dokončena → ready na další ---
  const onAnimationDone = useCallback(() => {
    setReady(true);
  }, []);

  // --- Hlavní smyčka: ready + není fade → začni psát ---
  useEffect(() => {
    if (reducedMotion) {
      setText(LINES.join("\n"));
      return;
    }
    if (!ready || fading) return;

    const line = LINES[currentLine];
    if (!line) return;

    let cancelled = false;
    setReady(false);

    // Fáze 1: Psaní
    let pos = 0;
    const typeChar = () => {
      if (cancelled) return;
      if (pos < line.length) {
        pos++;
        setText(line.slice(0, pos));
        setTimeout(typeChar, TYPE_SPEED);
      } else {
        // Fáze 2: Pauza po dopsání
        setTimeout(() => {
          if (cancelled) return;
          // Fáze 3: Blikání (zářivka)
          let blinkCount = 0;
          const doBlink = () => {
            if (cancelled) return;
            if (blinkCount >= BLINK_COUNT) {
              // Fáze 4: Blur fade out
              setCursorVisible(false);
              setFading(true);
              setTimeout(() => {
                if (cancelled) return;
                setText("");
                setFading(false);
                // Fáze 5: Pauza před dalším řádkem
                setTimeout(() => {
                  if (cancelled) return;
                  const nextLine = (currentLine + 1) % LINES.length;
                  setCurrentLine(nextLine);
                  setCursorVisible(true);
                  onAnimationDone();
                }, PAUSE_BEFORE_NEXT);
              }, BLUR_FADE_DURATION);
              return;
            }
            setCursorVisible(false);
            setTimeout(() => {
              if (cancelled) return;
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

    return () => { cancelled = true; };
  }, [ready, currentLine, fading, reducedMotion, onAnimationDone]);

  // Parallax scroll efekt
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
          <p
            className="eyebrow mb-4 animate-fade-in-up"
            style={{ color: "var(--gold)" }}
          >
            Petr Piskáček
          </p>

          <div className="mb-4 flex justify-center">
            <EchoTrigger sectionId="hero" />
          </div>

          {/* Typewriter — jeden řádek, žádný hromadění */}
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

          {/* CTA tlačítka */}
          <div
            className="flex animate-fade-in-up flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="#pribeh"
              className="btn-apple btn-apple-primary w-full sm:w-auto"
            >
              Zajímá tě proč?
            </a>
            <a
              href="#projekty"
              className="btn-apple btn-apple-secondary w-full sm:w-auto"
            >
              Prozkoumat projekty
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
