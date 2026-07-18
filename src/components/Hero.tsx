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
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [phase, setPhase] = useState<"visible" | "fading" | "changing">("visible");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setVariant(getABVariant());
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

  // Rotace textu — plynulý crossfade (Apple styl)
  useEffect(() => {
    if (reducedMotion) return;

    const parts = variant === "A" ? ROTATING_PARTS_A : ROTATING_PARTS_B;
    if (parts.length <= 1) return;

    const interval = setInterval(() => {
      // Fáze 1: fade out (400ms)
      setPhase("fading");
      setTimeout(() => {
        // Fáze 2: změna textu (okamžitě)
        setPrevIndex(rotatingIndex);
        setRotatingIndex((prev) => (prev + 1) % parts.length);
        setPhase("changing");
        // Fáze 3: fade in (400ms)
        setTimeout(() => {
          setPhase("visible");
        }, 50);
      }, 400);
    }, 4000);

    return () => clearInterval(interval);
  }, [variant, rotatingIndex, reducedMotion]);

  const parts = variant === "A" ? ROTATING_PARTS_A : ROTATING_PARTS_B;
  const currentText = parts[rotatingIndex];
  const prevText = parts[prevIndex];

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
          <div className="relative min-h-[5rem] mb-8 flex items-center justify-center sm:min-h-[3.5rem]">
            {reducedMotion ? (
              <h1 className="headline-xl">{currentText}</h1>
            ) : (
              <>
                {/* Předchozí text — fade out */}
                <h1
                  className="headline-xl absolute inset-0 flex items-center justify-center transition-all duration-[400ms] ease-in-out"
                  style={{
                    opacity: phase === "fading" ? 0 : 1,
                    transform: phase === "fading" ? "translateY(-8px)" : "translateY(0)",
                    filter: phase === "fading" ? "blur(4px)" : "blur(0)",
                  }}
                >
                  {prevText}
                </h1>
                {/* Nový text — fade in */}
                <h1
                  className="headline-xl absolute inset-0 flex items-center justify-center transition-all duration-[400ms] ease-in-out"
                  style={{
                    opacity: phase === "visible" ? 1 : 0,
                    transform: phase === "visible" ? "translateY(0)" : "translateY(8px)",
                    filter: phase === "visible" ? "blur(0)" : "blur(4px)",
                  }}
                >
                  {currentText}
                </h1>
              </>
            )}
          </div>

          {/* A/B test indicator (jen v developmentu) */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute top-2 right-2 rounded bg-white/10 px-2 py-1 text-[10px] text-white/50">
              Variant {variant}
            </div>
          )}

          {/* CTA tlačítka */}
          <div
            className="flex animate-fade-in-up flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="#pribeh"
              className="btn-apple btn-apple-primary w-full sm:w-auto"
            >
              Přečíst příběh
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
