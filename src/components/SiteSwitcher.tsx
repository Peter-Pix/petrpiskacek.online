"use client";

import { useState, useRef, useEffect } from "react";
import { ExternalLinkIcon } from "./icons";

interface SiteSwitcherProps {
  current: "cz" | "cloud" | "online";
}

const sites = {
  cz: { label: "petrpiskacek.cz", href: "https://petrpiskacek.cz", desc: "Profesionální prezentace" },
  cloud: { label: "petrpiskacek.cloud", href: "https://petrpiskacek.cloud", desc: "AI Infrastructure & Experiments" },
  online: { label: "petrpiskacek.online", href: "https://petrpiskacek.online", desc: "Příběh, vize, proč to dělám" },
};

export default function SiteSwitcher({ current }: SiteSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-sm font-semibold tracking-tight transition-colors hover:text-gold"
        style={{ color: "var(--text)" }}
      >
        Petr Piskáček
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-64 rounded-xl border p-2 shadow-xl"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-secondary)",
            backdropFilter: "blur(20px)",
          }}
        >
          {(Object.keys(sites) as Array<keyof typeof sites>).map((key) => {
            const site = sites[key];
            const isCurrent = key === current;
            return (
              <a
                key={key}
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isCurrent ? "font-semibold" : ""
                }`}
                style={{
                  backgroundColor: isCurrent ? "var(--surface)" : "transparent",
                  color: isCurrent ? "var(--text)" : "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) e.currentTarget.style.backgroundColor = "var(--surface)";
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div>
                  <div className="text-sm">{site.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {site.desc}
                  </div>
                </div>
                {isCurrent ? (
                  <span className="text-xs font-medium" style={{ color: "var(--gold)" }}>
                    tady
                  </span>
                ) : (
                  <ExternalLinkIcon size={12} />
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
