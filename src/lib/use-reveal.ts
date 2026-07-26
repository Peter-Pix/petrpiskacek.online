"use client";

import { useEffect, useRef, useState } from "react";

type AnimationType = "fade-up" | "fade-in" | "slide-up" | "scale-in";

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
  animation?: AnimationType;
  delay?: number;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = "0px",
  animation = "fade-up",
  delay = 0,
}: UseRevealOptions = {}) {
  const ref = useRef<T>(null!);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const style: React.CSSProperties = {
    opacity: revealed ? 1 : 0,
    transform: revealed
      ? "translateY(0) scale(1)"
      : animation === "fade-up"
      ? "translateY(24px)"
      : animation === "slide-up"
      ? "translateY(40px)"
      : animation === "scale-in"
      ? "scale(0.95)"
      : "none",
    transition: `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)`,
    transitionDelay: `${delay}ms`,
    willChange: "opacity, transform",
  };

  return { ref, style, revealed };
}
