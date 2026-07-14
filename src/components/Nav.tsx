"use client";

import { useState } from "react";
import { MenuIcon, CloseIcon, ExternalLinkIcon } from "./icons";

const links = [
  { href: "/", label: "Domů" },
  { href: "#pribeh", label: "Příběh" },
  { href: "#presvedceni", label: "Přesvědčení" },
  { href: "#projekty", label: "Projekty" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav-apple">
      <a href="/" className="text-sm font-semibold tracking-tight" style={{ color: "var(--text)" }}>
        Petr Piskáček
      </a>

      <ul className="hidden items-center gap-8 md:flex">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="link-apple">
              {link.label}
            </a>
          </li>
        ))}
        <li className="flex items-center gap-3 pl-2">
          <a
            href="https://petrpiskacek.cz"
            target="_blank"
            rel="noopener noreferrer"
            className="link-apple inline-flex items-center gap-1"
          >
            .cz
            <ExternalLinkIcon size={10} />
          </a>
          <a
            href="https://petrpiskacek.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="link-apple inline-flex items-center gap-1"
          >
            .cloud
            <ExternalLinkIcon size={10} />
          </a>
        </li>
      </ul>

      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"
          style={{ color: "var(--text-secondary)" }}
          aria-label={open ? "Zavřít menu" : "Otevřít menu"}
          aria-expanded={open}
        >
          {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-x-0 top-14 z-40 border-t px-6 pb-8 pt-6 md:hidden"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface-strong)",
            backdropFilter: "blur(24px)",
          }}
        >
          <ul className="flex flex-col gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-lg font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
              <a
                href="https://petrpiskacek.cz"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block text-lg font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                petrpiskacek.cz ↗
              </a>
            </li>
            <li>
              <a
                href="https://petrpiskacek.cloud"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block text-lg font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                petrpiskacek.cloud ↗
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
