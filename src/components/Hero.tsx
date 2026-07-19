"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { EchoTrigger } from "./ChatBot";

// Každej řádek je samostatná "myšlenka" — napíše se, chvíli počká, zmizí, pak další.
const LINES = [
  "Nejsem tady, abych prodal AI.",
  "Jsem tady, abych ukázal, co umí.",
  "A proč si myslím, že to má smysl.",
];

// Rychlost psaní (ms na znak)
const TYPE_SPEED = 35;
// Pauza po dopsání řádku (ms)
const PAUSE_AFTER_LINE = 2000;
// Pauza před začátkem psaní dalšího řádku (ms)
const PAUSE_BEFORE_NEXT = 400;
// Rychlost mazání (ms na znak)
const DELETE_SPEED = 20;

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const [displayedLines, setDisplayedLines] = useState<string[]>([""]);
  const [currentLine, setCurrentLine] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Blikání kurzoru
  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  // Hlavní smyčka psaní/mazání
  useEffect(() => {
    if (reducedMotion) {
      // Při reduced motion rovnou ukážeme všechny řádky
      setDisplayedLines(LINES);
      return;
    }

    const line = LINES[currentLine];
    if (!line) return;

    if (isTyping && !isDeleting) {
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
        // Dopsáno — pauza, pak začni mazat
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, PAUSE_AFTER_LINE);
        return () => clearTimeout(timeout);
      }
    }

    if (isDeleting) {
      const currentText = displayedLines[currentLine] || "";
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedLines((prev) => {
            const next = [...prev];
            next[currentLine] = currentText.slice(0, -1);
            return next;
          });
        }, DELETE_SPEED);
        return () => clearTimeout(timeout);
      } else {
        // Smazáno — přesun na další řádek
        setIsDeleting(false);
        setIsTyping(true);
        const nextLine = (currentLine + 1) % LINES.length;
        const timeout = setTimeout(() => {
          setCurrentLine(nextLine);
          // Pokud je další řádek prázdnej, inicializuj ho
          setDisplayedLines((prev) => {
            const next = [...prev];
            if (!next[nextLine]) next[nextLine] = "";
            return next;
          });
        }, PAUSE_BEFORE_NEXT);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentLine, displayedLines, isTyping, isDeleting, reducedMotion]);

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

          {/* Typewriter hero text */}
          <div className="relative mb-12 flex min-h-[4.5rem] items-center justify-center sm:min-h-[3.5rem] sm:mb-16">
            <h1 className="headline-xl inline-flex items-baseline gap-0">
              {displayedLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                  {/* Kurzor jen na aktuálně psaným řádku */}
                  {i === currentLine && (
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
