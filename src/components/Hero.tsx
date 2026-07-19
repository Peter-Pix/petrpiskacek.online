"use client";

import { useEffect, useRef, useState } from "react";
import { EchoTrigger } from "./ChatBot";

// Každej řádek je samostatná "myšlenka" — napíše se, chvíli počká, blikne, zmizí.
const LINES = [
  "Nejsem tady, abych prodal AI.",
  "Jsem tady, abych ukázal, co umí.",
  "A proč si myslím, že to má smysl.",
];

// Rychlost psaní (ms na znak) — pomalejší, ať si to člověk vychutná
const TYPE_SPEED = 80;
// Pauza po dopsání řádku (ms)
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayedLines, setDisplayedLines] = useState<string[]>([""]);
  const [currentLine, setCurrentLine] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Blikání kurzoru (jen když se píše)
  useEffect(() => {
    if (reducedMotion || !isTyping || isBlinking || isFadingOut) return;
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, [reducedMotion, isTyping, isBlinking, isFadingOut]);

  // Hlavní smyčka psaní → blikání → blur fade → další řádek
  useEffect(() => {
    if (reducedMotion) {
      setDisplayedLines(LINES);
      return;
    }

    const line = LINES[currentLine];
    if (!line) return;

    // --- FÁZE 1: PSANÍ ---
    if (isTyping && !isBlinking && !isFadingOut) {
      const currentText = displayedLines[currentLine] || "";
      if (currentText.length < line.length) {
        const timeout = setTimeout(() => {
          setDisplayedLines((prev) => {
            const next = [...prev];
            next[currentLine] = line.slice(0, currentText.length + 1);
            return next;
          });
        }, TYPE_SPEED);
        return () => clearTimeout(timeout);
      } else {
        // Dopsáno — pauza, pak začni blikat
        const timeout = setTimeout(() => {
          setIsTyping(false);
          setIsBlinking(true);
        }, PAUSE_AFTER_LINE);
        return () => clearTimeout(timeout);
      }
    }

    // --- FÁZE 2: BLIKÁNÍ (zářivka) ---
    if (isBlinking) {
      let blinkCount = 0;
      const blink = () => {
        if (blinkCount >= BLINK_COUNT) {
          // Blikání hotovo — začni blur fade
          setIsBlinking(false);
          setIsFadingOut(true);
          return;
        }
        // Blik — zmizí
        setCursorVisible(false);
        setTimeout(() => {
          // Blik — objeví se
          setCursorVisible(true);
          blinkCount++;
          setTimeout(blink, BLINK_GAP);
        }, BLINK_DURATION);
      };
      const timeout = setTimeout(blink, 200);
      return () => clearTimeout(timeout);
    }

    // --- FÁZE 3: BLUR FADE OUT ---
    if (isFadingOut) {
      const timeout = setTimeout(() => {
        // Smažeme text
        setDisplayedLines((prev) => {
          const next = [...prev];
          next[currentLine] = "";
          return next;
        });
        setIsFadingOut(false);
        setIsTyping(true);
        setCursorVisible(true);

        // Přesun na další řádek
        const nextLine = (currentLine + 1) % LINES.length;
        setTimeout(() => {
          setCurrentLine(nextLine);
          setDisplayedLines((prev) => {
            const next = [...prev];
            if (!next[nextLine]) next[nextLine] = "";
            return next;
          });
        }, PAUSE_BEFORE_NEXT);
      }, BLUR_FADE_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, displayedLines, isTyping, isBlinking, isFadingOut, reducedMotion]);

  // Parallax scroll efekt
  useEffect(() => {
    const text = textRef.current;
    if (!text) return;

    function handleScroll() {
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      const progress = Math.min(scrollY / viewportH, 1);

      if (text) {
        const opacity = Math.max(1 - progress * 1.4, 0);
        const blur = Math.min(progress * 12, 8);
        const translate = Math.min(scrollY * 0.15, 50);
        text.style.transform = `translateY(${-translate}px)`;
        text.style.opacity = String(opacity);
        text.style.filter = `blur(${blur}px)`;
      }
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

          {/* Typewriter hero text — fixní výška, žádný odskakování */}
          <div
            ref={containerRef}
            className="relative mb-12 flex items-center justify-center sm:mb-16"
            style={{ minHeight: "6rem" }}
          >
            <h1
              className="headline-xl text-center"
              style={{
                filter: isFadingOut ? `blur(8px)` : `blur(0px)`,
                opacity: isFadingOut ? 0 : 1,
                transition: `filter ${BLUR_FADE_DURATION}ms ease-out, opacity ${BLUR_FADE_DURATION}ms ease-out`,
              }}
            >
              {displayedLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                  {/* Kurzor jen na aktuálně psaným řádku */}
                  {i === currentLine && isTyping && (
                    <span
                      className={`inline-block w-[3px] h-[0.8em] ml-1 align-middle transition-opacity duration-100 ${
                        cursorVisible ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ backgroundColor: "var(--gold)" }}
                    />
                  )}
                </span>
              ))}
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
