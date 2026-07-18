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
    line2: "Nový nástroj. Ukážu ti, jak to dělám.",
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
  "Ukážu ti, jak to dělám.",
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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setVariant(getABVariant());
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

  // Rotace textu každých 3.5 sekundy
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setRotatingIndex((prev) => (prev + 1) % (variant === "A" ? ROTATING_PARTS_A.length : ROTATING_PARTS_B.length));
        setIsAnimating(false);
      }, 300); // fade out duration
    }, 3500);

    return () => clearInterval(interval);
  }, [variant]);

  const parts = variant === "A" ? ROTATING_PARTS_A : ROTATING_PARTS_B;
  const currentText = parts[rotatingIndex];

  return (
    <section data-context-section="hero" className="hero-bg relative flex min-h-[100svh] flex-col items-center justify-center px-5 pt-20 text-center">
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
            {VARIANTS[variant].eyebrow}
          </p>

          <div className="mb-4 flex justify-center">
            <EchoTrigger sectionId="hero" />
          </div>

          {/* Headline s rotujícím textem */}
          <div className="relative h-24 mb-8 overflow-hidden">
            <h1
              className={`headline-xl absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                isAnimating ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
              }`}
              style={{ animationDelay: "0.1s" }}
            >
              {currentText}
            </h1>
          </div>

          {/* A/B test indicator (jen v developmentu) */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded bg-white/10 text-white/50">
              Variant {variant}
            </div>
          )}

          {/* CTA tlačítka */}
          <div
            className="flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <a href="#pribeh" className="btn-apple btn-apple-primary w-full sm:w-auto">
              Přečíst příběh
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
