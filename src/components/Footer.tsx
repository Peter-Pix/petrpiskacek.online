"use client";

import { GithubIcon, MailIcon, ExternalLinkIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="border-t py-8" style={{ borderColor: "var(--border)" }}>
      <div className="container-apple px-5">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Petr Piskáček
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://petrpiskacek.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              .cz
              <ExternalLinkIcon size={10} />
            </a>
            <a
              href="https://petrpiskacek.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              .cloud
              <ExternalLinkIcon size={10} />
            </a>
            <a
              href="https://github.com/Peter-Pix"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <GithubIcon size={14} />
              GitHub
            </a>
            <a
              href="mailto:ppix50@gmail.com"
              className="inline-flex items-center gap-1 text-xs transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <MailIcon size={14} />
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
