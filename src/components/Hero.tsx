"use client";

import { useEffect, useRef } from "react";
import { EchoTrigger } from "./ChatBot";

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);

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
            Petr Piskáček
          </p>

          <div className="mb-4 flex justify-center">
            <EchoTrigger sectionId="hero" />
          </div>

          <h1 className="headline-xl mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Nejsem tady, abych ti prodal AI.
          </h1>

          <p
            className="subhead mx-auto mb-6 max-w-2xl animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Jsem tady, abych ti ukázal, co s ní jde dělat.
            <br />
            A proč si myslím, že to má smysl.
          </p>

          <p
            className="mb-10 text-sm animate-fade-in-up"
            style={{ color: "var(--text-muted)", animationDelay: "0.3s" }}
          >
            Programování od dětství. AI od prvního GPT. Pořád stejnej kluk, co chtěl z myšlenky udělat něco.
          </p>

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
