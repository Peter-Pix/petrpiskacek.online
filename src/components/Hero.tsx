"use client";

import { useEffect, useRef, useState } from "react";
import { EchoTrigger } from "./ChatBot";

// A/B test varianty pro hero headline
const VARIANTS = {
  A: {
    eyebrow: "Petr Piskáček",
    line1: "Nejsem tady, abych prodal AI.",
    line2: "Jsem tady, abych ukázal, co umí.",
  },
  B: {
    eyebrow: "Petr Piskáček",
    line1: "Žádná magie.",
    line2: "Nový nástroj. Ukážu ti to.",
  },
};

// Rotující části pro variantu A (Apple keynotes styl)
const ROTATING_PARTS_A = [
  "Nejsem tady, abych prodal AI.",
  "Jsem tady, abych ukázal...",
  "co umí.",
];

// Rotující části pro variantu B
const ROTATING_PARTS_B = [
  "Žádná magie.",
  "Nový nástroj.",
  "Ukážu ti to.",
];

function getABVariant(): "A" | "B" {
  if (typeof window === "undefined") return "A";

  const stored = localStorage.getItem("ab_hero_variant");
  if (stored === "A" || stored === "B") return stored;

  // 50/50 split
  const variant = Math.random() < 0.5 ? "A" : "B";
  localStorage.setItem("ab_hero_variant", variant);
  return variant;
}

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<"A" | "B">("A");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [displayText, setDisplayText] = useState("");
  const [nextText, setNextText] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const v = getABVariant();
    setVariant(v);
    const parts = v === "A" ? ROTATING_PARTS_A : ROTATING_PARTS_B;
    setDisplayText(parts[0]);
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

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

  // Rotace textu — plynulý crossfade dvou elementů.
  // Jeden fade out, druhý fade in. Žádný skok, žádný „zešediví a zmizí“.
  useEffect(() => {
    if (reducedMotion) return;

    const parts = variant === "A" ? ROTATING_PARTS_A : ROTATING_PARTS_B;
    if (parts.length <= 1) return;

    const interval = setInterval(() => {
      const next = (currentIndex + 1) % parts.length;
      setNextText(parts[next]);
      setNextIndex(next);
      // Po 1.5s (fade out) se current přepne na next
      setTimeout(() => {
        setCurrentIndex(next);
        setDisplayText(parts[next]);
        setNextText(null);
        setNextIndex(null);
      }, 1500);
    }, 5000);

    return () => clearInterval(interval);
  }, [variant, reducedMotion, currentIndex]);

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
            {VARIANTS[variant].eyebrow}
          </p>

          <div className="mb-4 flex justify-center">
            <EchoTrigger sectionId="hero" />
          </div>

          {/* Headline s rotujícím textem — plynulý crossfade */}
          <div className="relative min-h-[5rem] mb-12 flex items-center justify-center sm:min-h-[3.5rem] sm:mb-16">
            {/* Aktuální text — fade out, když je nextText */}
            <h1
              className={`headline-xl absolute inset-0 flex items-center justify-center transition-opacity duration-[1500ms] ease-in-out ${
                nextText ? "opacity-0" : "opacity-100"
              }`}
            >
              {displayText}
            </h1>
            {/* Další text — fade in, když je aktivní */}
            {nextText && (
              <h1
                className={`headline-xl absolute inset-0 flex items-center justify-center transition-opacity duration-[1500ms] ease-in-out opacity-100`}
              >
                {nextText}
              </h1>
            )}
          </div>

          {/* A/B test indicator (jen v developmentu) */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute top-2 right-2 rounded bg-white/10 px-2 py-1 text-[10px] text-white/50">
              Variant {variant}
            </div>
          )}

          {/* CTA tlačítka — větší odstup od headline */}
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
