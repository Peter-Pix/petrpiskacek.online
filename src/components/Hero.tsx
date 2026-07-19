"use client";

import { useEffect, useRef, useState } from "react";
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

type Phase = "typing" | "pause" | "blinking" | "fading" | "waiting";

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Blikání kurzoru (jen během psaní)
  useEffect(() => {
    if (reducedMotion || phase !== "typing") return;
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, [reducedMotion, phase]);

  // Hlavní smyčka
  useEffect(() => {
    if (reducedMotion) {
      setText(LINES.join("\n"));
      return;
    }

    const line = LINES[currentLine];
    if (!line) return;

    // --- FÁZE 1: PSANÍ ---
    if (phase === "typing") {
      if (text.length < line.length) {
        const timeout = setTimeout(() => {
          setText(line.slice(0, text.length + 1));
        }, TYPE_SPEED);
        return () => clearTimeout(timeout);
      } else {
        // Dopsáno — pauza
        const timeout = setTimeout(() => {
          setPhase("blinking");
        }, PAUSE_AFTER_LINE);
        return () => clearTimeout(timeout);
      }
    }

    // --- FÁZE 2: BLIKÁNÍ (zářivka) ---
    if (phase === "blinking") {
      let blinkCount = 0;
      const blink = () => {
        if (blinkCount >= BLINK_COUNT) {
          setPhase("fading");
          return;
        }
        setCursorVisible(false);
        setTimeout(() => {
          setCursorVisible(true);
          blinkCount++;
          setTimeout(blink, BLINK_GAP);
        }, BLINK_DURATION);
      };
      const timeout = setTimeout(blink, 200);
      return () => clearTimeout(timeout);
    }

    // --- FÁZE 3: BLUR FADE OUT ---
    if (phase === "fading") {
      const timeout = setTimeout(() => {
        setText("");
        setCursorVisible(false);
        setPhase("waiting");
      }, BLUR_FADE_DURATION);
      return () => clearTimeout(timeout);
    }

    // --- FÁZE 4: ČEKÁNÍ před dalším řádkem ---
    if (phase === "waiting") {
      const timeout = setTimeout(() => {
        const nextLine = (currentLine + 1) % LINES.length;
        setCurrentLine(nextLine);
        setCursorVisible(true);
        setPhase("typing");
      }, PAUSE_BEFORE_NEXT);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, text, phase, reducedMotion]);

  // Parallax scroll efekt
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    function handleScroll() {
      if (!el) return;
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      const progress = Math.min(scrollY / viewportH, 1);

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
                filter: phase === "fading" ? "blur(8px)" : "blur(0px)",
                opacity: phase === "fading" ? 0 : 1,
                transition: `filter ${BLUR_FADE_DURATION}ms ease-out, opacity ${BLUR_FADE_DURATION}ms ease-out`,
              }}
            >
              {text}
              {phase === "typing" && (
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
