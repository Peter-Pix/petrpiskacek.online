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
const BLUR_FADE_DURATION = 1200;
const PAUSE_BEFORE_NEXT = 800;
const CRT_UNFOLD_DURATION = 500;

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [crtUnfold, setCrtUnfold] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const currentLineRef = useRef(0);
  const cancelledRef = useRef(false);
  const runningRef = useRef(false);

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
    let unfolded = false;

    setCursorVisible(false);
    setCrtUnfold(false);

    const typeChar = () => {
      if (cancelledRef.current) return;
      if (pos < line.length) {
        pos++;
        setText(line.slice(0, pos));
        if (pos === 1) {
          // První písmeno — spustíme CRT unfold + kurzor
          setCrtUnfold(true);
          setTimeout(() => setCursorVisible(true), 100);
        }
        setTimeout(typeChar, TYPE_SPEED);
      } else {
        setTimeout(() => {
          if (cancelledRef.current) return;
          setFading(true);
          setTimeout(() => {
            if (cancelledRef.current) return;
            setText("");
            setFading(false);
            setCrtUnfold(false);
            setTimeout(() => {
              if (cancelledRef.current) return;
              currentLineRef.current = (currentLineRef.current + 1) % LINES.length;
              runningRef.current = false;
              setTimeout(() => startTyping.current(), 50);
            }, PAUSE_BEFORE_NEXT);
          }, BLUR_FADE_DURATION);
        }, PAUSE_AFTER_LINE);
      }
    };

    setTimeout(typeChar, 100);
  };

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

  useEffect(() => {
    if (reducedMotion || fading || !text) return;
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, [reducedMotion, fading, text]);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    function handleScroll() {
      if (!el) return;
      const scrollY = window.scrollY;
      el.style.transform = `translateY(${-Math.min(scrollY * 0.15, 50)}px)`;
      el.style.opacity = String(Math.max(1 - Math.min(scrollY / window.innerHeight, 1) * 1.4, 0));
      el.style.filter = `blur(${Math.min((scrollY / window.innerHeight) * 12, 8)}px)`;
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
        <div ref={textRef} style={{ willChange: "transform, opacity, filter" }}>
          <p className="eyebrow mb-4 animate-fade-in-up" style={{ color: "var(--gold)" }}>
            Petr Piskáček
          </p>

          <div className="mb-4 flex justify-center">
            <EchoTrigger sectionId="hero" />
          </div>

          <div className="relative mb-12 flex items-center justify-center sm:mb-16" style={{ minHeight: "6rem" }}>
            <div
              className="overflow-hidden"
              style={{
                height: crtUnfold ? "auto" : "2px",
                opacity: crtUnfold ? 1 : 0,
                transition: `height ${CRT_UNFOLD_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${CRT_UNFOLD_DURATION}ms ease-out`,
              }}
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
                <span
                  className="inline-block w-[3px] h-[0.8em] ml-1 align-middle transition-all duration-200"
                  style={{
                    backgroundColor: "var(--gold)",
                    opacity: !fading && cursorVisible ? 1 : 0,
                  }}
                />
              </h1>
            </div>
          </div>

          <div
            className="flex animate-fade-in-up flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
            style={{ animationDelay: "0.4s" }}
          >
            <a href="#pribeh" className="btn-apple btn-apple-primary w-full sm:w-auto max-w-[60vw] sm:max-w-none">
              Zajímá tě proč?
            </a>
            <a href="#projekty" className="btn-apple btn-apple-secondary w-full sm:w-auto max-w-[60vw] sm:max-w-none">
              Prozkoumat projekty
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
