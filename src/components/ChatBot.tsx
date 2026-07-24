"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { InfoIcon, CloseIcon } from "./icons";
import { useEcho } from "@/lib/echo-context";
import { PROJECTS, SITE_SECTIONS, type QuestionType } from "@/lib/site-content";

type Message = { role: "user" | "assistant"; content: string };

// ── Quick replies ──────────────────────────────────────────────

const QUICK_REPLIES: Record<string, string> = {
  ahoj: "Ahoj. Co tě zajímá?",
  čau: "Ahoj. Co tě zajímá?",
  cus: "Ahoj. Co tě zajímá?",
  cau: "Ahoj. Co tě zajímá?",
  čus: "Ahoj. Co tě zajímá?",
  zdar: "Ahoj. Co tě zajímá?",
  zdravím: "Ahoj. Co tě zajímá?",
  čum: "Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?",
  kunda: "Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?",
  píča: "Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?",
  pica: "Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?",
  kokot: "Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?",
  prdel: "Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?",
  hovno: "Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?",
};

function tryQuickReply(text: string): string | null {
  const t = text.toLowerCase().trim();
  if (QUICK_REPLIES[t]) return QUICK_REPLIES[t];
  if (t.length <= 3 && !/[a-záčďéěíňóřšťúůýž]{2,}/i.test(t)) {
    return "To bylo krátký. Co tím myslíš?";
  }
  return null;
}

// ── First replies ──────────────────────────────────────────────

const FIRST_REPLIES: Record<string, string> = {
  hero:
    "Že nekecá. Neprodává AI. Ukazuje, co umí. A dává to smysl. Celej tenhle web je důkaz, ne slib.",
  story:
    "Že to není žádnej 'příběh úspěchu'. Je to příběh člověka, kterej potkal nástroj, kterej konečně chápe stejně jako on. A místo aby ho prodával, tak s ním staví.",
  beliefs:
    "Že si nemyslí, že AI zachrání svět. Ani že ho zničí. Je to nástroj. Jako kladivo. Můžeš s ním postavit dům, nebo někoho praštit. Rozdíl je v tom, kdo ho drží.",
  projects:
    "Že každej projekt začal frustrací, ne nápadem. Štvalo ho, že něco neexistuje, nebo že to existuje blbě. Tak to postavil. Nic víc, nic míň.",
  footer:
    "Že i patička má svůj příběh. Ale fakt bys chtěl kecat o patičce?",
};

const PROJECT_FIRST_REPLIES: Record<string, string> = {
  vocalbrain:
    "Brainstorming o projektu nahlas — AI to celé naplánuje. Mluvíš, systém to přepíše, strukturalizuje, udělá to-do listy. Druhej den pozná, že jde o ten samej projekt, a přidá nový informace.",
  stylemorph:
    "Řekneš mu styl, ono to v reálném čase předělá celej web a můžeš si ho stáhnout. Malý firmy platí tisíce za redesign. Tohle to umí za pár vteřin.",
  autoblog:
    "Zvolíš téma, AI dohledá co lidi aktuálně zajímá, vyhledá informace, napíše články, zkontroluje je, vylepší, nasdílí online. Celej web se buduje a rozvíjí sám.",
  scrollo:
    "Jednoduchý nástroje. Bez reklam. Všechno běží v prohlížeči — žádná databáze, žádný tracking, žádná reklama. Petr je staví, protože sám potřebuje věci, který dělaj přesně to co maj.",
  "4rap":
    "Databáze českýho rapu. Kdo s kým, kdo co, odkud. 1200+ interpretů, skoro 6000 vazeb. Petr říká, že je to k ničemu. A v tom je krása — nedělá to pro nikoho, dělá to, protože ho to baví.",
};

// ── Helpers ────────────────────────────────────────────────────

function buildFirstMessage(ctx: { project?: { id: string; fact: string }; section?: { id: string; wow?: string; summary: string } }) {
  if (ctx.project) {
    return {
      user: "Co to je?",
      assistant: PROJECT_FIRST_REPLIES[ctx.project.id] || ctx.project.fact,
    };
  }
  if (ctx.section) {
    return {
      user: "Co je na tom nejzajímavější?",
      assistant: FIRST_REPLIES[ctx.section.id] || ctx.section.wow || ctx.section.summary,
    };
  }
  return {
    user: "Ahoj, kdo jsi?",
    assistant:
      "Jsem Echo. Hlas týhle stránky. Petr mě postavil, abych odpovídal na otázky, který bys normálně musel hledat sám. Nejsem chatbot na prodej. Jsem tu, protože ho baví stavět věci, který dávaj smysl.",
  };
}

// ── Component ──────────────────────────────────────────────────

export default function ChatBot() {
  const { open, closeEcho, context, contextBadge, setContextBadge } = useEcho();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAssistantId, setLastAssistantId] = useState<number | null>(null);
  const [continueTarget, setContinueTarget] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const autoSendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const raisedRef = useRef<HTMLElement | null>(null);

  // ── Auto-send + cleanup (single effect, no race) ──────────────

  useEffect(() => {
    if (autoSendTimerRef.current) {
      clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = null;
    }

    if (!open) {
      setMessages([]);
      setLastAssistantId(null);
      return;
    }

    setMessages([]);
    setLastAssistantId(null);

    const { user: autoMsg, assistant: firstReply } = buildFirstMessage(context);

    autoSendTimerRef.current = setTimeout(() => {
      setMessages((prev) => {
        if (prev.length > 0) return prev;
        return [
          { role: "user" as const, content: autoMsg },
          { role: "assistant" as const, content: firstReply },
        ];
      });
    }, 600);

    return () => {
      if (autoSendTimerRef.current) {
        clearTimeout(autoSendTimerRef.current);
        autoSendTimerRef.current = null;
      }
    };
  }, [open, context.project?.id, context.section?.id]);

  // ── Click outside ─────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("[data-echo-trigger]")) return;
      if (target.closest("[data-echo-panel]")) return;
      closeEcho();
    }
    const t = setTimeout(() => document.addEventListener("click", handleClick), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("click", handleClick);
    };
  }, [open, closeEcho]);

  // ── Card raise animation ──────────────────────────────────────

  useEffect(() => {
    if (!open) {
      if (raisedRef.current) {
        raisedRef.current.style.transform = "";
        raisedRef.current.style.transition = "";
        raisedRef.current = null;
      }
      return;
    }

    const selector = context.project
      ? `[data-context-project="${context.project.id}"]`
      : context.section
        ? `[data-context-section="${context.section.id}"]`
        : null;

    if (!selector) return;

    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el || raisedRef.current === el) return;

    if (raisedRef.current) {
      raisedRef.current.style.transform = "";
      raisedRef.current.style.transition = "";
    }

    raisedRef.current = el;
    el.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease";
    el.style.transform = "translateY(-8px) scale(1.02)";
    el.style.boxShadow = "0 24px 64px rgba(0, 0, 0, 0.4)";
  }, [open, context]);

  // ── ESC ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeEcho();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, closeEcho]);

  // ── Input focus ──────────────────────────────────────────────

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 700);
  }, [open]);

  // ── Message helpers ───────────────────────────────────────────

  const addAssistantMessage = useCallback((content: string) => {
    setMessages((prev) => {
      const next = [...prev, { role: "assistant" as const, content }];
      setLastAssistantId(next.length - 1);
      return next;
    });
  }, []);

  const sendUserMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, { role: "user" as const, content: text }]);
  }, []);

  // ── API ───────────────────────────────────────────────────────

  async function callApi(
    msg: string,
    options: { questionType?: QuestionType; continueFrom?: boolean } = {},
  ) {
    // Read current messages via ref to avoid stale closure
    const currentMessages = messagesRef.current;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...currentMessages, { role: "user", content: msg }],
        clickedContext: context,
        questionType: options.questionType,
        continueFrom: options.continueFrom,
      }),
    });

    if (!res.ok) {
      addAssistantMessage("Promiň, teď nemůžu odpovědět. Zkus to znovu za chvíli.");
      return;
    }

    const data = await res.json();
    const replies: string[] = data.replies || [];
    if (replies.length === 0) {
      addAssistantMessage("Promiň, teď nemůžu odpovědět. Zkus to znovu za chvíli.");
      return;
    }
    for (const r of replies) {
      addAssistantMessage(r);
    }
  }

  // Keep a ref in sync with messages for API calls
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // ── Handlers ──────────────────────────────────────────────────

  async function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    sendUserMessage(msg);
    setInput("");
    setLoading(true);

    try {
      const quick = tryQuickReply(msg);
      if (quick) {
        addAssistantMessage(quick);
        return;
      }
      await callApi(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleMore() {
    if (loading || lastAssistantId === null) return;

    const msgs = messagesRef.current;
    const lastUserIdx = msgs.slice(0, lastAssistantId).findLastIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;

    const lastUserText = msgs[lastUserIdx].content;
    sendUserMessage("Více");
    setContinueTarget(lastAssistantId);
    setLoading(true);

    try {
      await callApi(lastUserText, { continueFrom: true });
    } finally {
      setLoading(false);
      setContinueTarget(null);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const canShowMore =
    lastAssistantId !== null &&
    !loading &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant";

  // ── Render ────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      <div
        data-echo-panel
        onClick={closeEcho}
        className="fixed inset-0 z-40 transition-opacity duration-500"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden="true"
      />

      {/* Echo panel */}
      <div
        data-echo-panel
        className="fixed z-50 flex flex-col overflow-hidden"
        style={{
          backgroundColor: "rgba(20, 20, 25, 0.65)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: open
            ? "0 32px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
            : "0 0 0 rgba(0, 0, 0, 0)",
          right: 0,
          top: 0,
          bottom: 0,
          width: "min(440px, 100vw)",
          maxWidth: "100vw",
          height: "100dvh",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease",
          opacity: open ? 1 : 0,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(200, 150, 46, 0.2), rgba(200, 150, 46, 0.05))",
                border: "1px solid rgba(200, 150, 46, 0.3)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ color: "var(--gold)" }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Echo
              </div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                hlas stránky
              </div>
            </div>
          </div>
          <button
            onClick={closeEcho}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/5"
            style={{ color: "var(--text-muted)" }}
            aria-label="Zavřít"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Context badge */}
        {contextBadge && (
          <div
            className="flex items-center justify-between gap-2 border-b px-5 py-2.5 text-xs"
            style={{
              borderColor: "rgba(255, 255, 255, 0.06)",
              backgroundColor: "rgba(200, 150, 46, 0.05)",
            }}
          >
            <span className="truncate" style={{ color: "var(--text-muted)" }}>
              Mluvíme o{" "}
              <strong style={{ color: "var(--gold)" }}>{contextBadge}</strong>
            </span>
            <button
              onClick={() => setContextBadge(null)}
              className="shrink-0 text-xs underline"
              style={{ color: "var(--text-muted)" }}
            >
              vyčistit
            </button>
          </div>
        )}

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-5"
          style={{ scrollbarWidth: "thin" }}
        >
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="mb-2 text-base font-medium" style={{ color: "var(--text-primary)" }}>
                Přemýšlím…
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                style={{
                  backgroundColor:
                    msg.role === "user"
                      ? "rgba(200, 150, 46, 0.15)"
                      : "rgba(255, 255, 255, 0.04)",
                  color: "var(--text-primary)",
                  border:
                    msg.role === "user"
                      ? "1px solid rgba(200, 150, 46, 0.25)"
                      : "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius:
                    msg.role === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="mb-3 flex justify-start">
              <div
                className="flex items-center gap-1.5 rounded-2xl px-4 py-3"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "16px 16px 16px 4px",
                }}
              >
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
        </div>

        {/* Více button */}
        <div className="border-t px-5 py-3" style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}>
          {canShowMore && (
            <div className="flex justify-start">
              <button
                onClick={handleMore}
                disabled={loading}
                className="rounded-full px-3 py-1 text-xs font-medium transition-colors hover:bg-white/5 disabled:opacity-30"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "var(--text-secondary)",
                }}
              >
                {loading && continueTarget !== null ? "Přemýšlím…" : "↻ Více"}
              </button>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t p-4" style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}>
          <div
            className="flex items-end gap-2 rounded-2xl px-3 py-2"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Napiš otázku..."
              rows={1}
              className="max-h-24 min-h-[36px] flex-1 resize-none bg-transparent px-1 py-1.5 text-sm outline-none"
              style={{ color: "var(--text-primary)", caretColor: "var(--gold)" }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all disabled:opacity-30"
              style={{ background: "var(--gold)", color: "var(--text-inverse)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile override — CSS custom property avoids stale closure in styled-jsx */}
      <style jsx global>{`
        @media (max-width: 640px) {
          [data-echo-panel]:not([data-echo-panel="backdrop"]) {
            top: auto !important;
            right: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 85dvh !important;
            border-radius: 24px 24px 0 0 !important;
            border-bottom: none !important;
            transform: translateY(var(--echo-mobile-transform, 100%)) !important;
          }
        }
      `}</style>
      {/* Set the CSS variable via inline style on the panel */}
      <style>{`
        [data-echo-panel]:not([data-echo-panel="backdrop"]) {
          --echo-mobile-transform: ${open ? "0" : "100%"};
        }
      `}</style>
    </>
  );
}

// ── EchoTrigger ─────────────────────────────────────────────────

export function EchoTrigger({
  projectId,
  sectionId,
  className = "",
}: {
  projectId?: string;
  sectionId?: string;
  className?: string;
}) {
  const { openEcho } = useEcho();

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (projectId) {
      const project = PROJECTS.find((p) => p.id === projectId);
      if (project) openEcho({ project });
    } else if (sectionId) {
      const section = SITE_SECTIONS.find((s) => s.id === sectionId);
      if (section) openEcho({ section });
    } else {
      openEcho();
    }
  }

  return (
    <button
      data-echo-trigger
      onClick={handleClick}
      className="group relative inline-flex h-8 w-8 items-center justify-center rounded-full"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        color: "var(--text-muted)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: "visible",
      }}
      aria-label="Zeptat se Echa"
      title="Zeptat se Echa"
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.backgroundColor = "rgba(200, 150, 46, 0.1)";
        el.style.borderColor = "rgba(200, 150, 46, 0.35)";
        el.style.color = "var(--gold)";
        el.style.transform = "scale(1.12)";
        el.style.boxShadow = "0 0 20px rgba(200, 150, 46, 0.2), 0 0 40px rgba(200, 150, 46, 0.08)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
        el.style.borderColor = "rgba(255, 255, 255, 0.06)";
        el.style.color = "var(--text-muted)";
        el.style.transform = "scale(1)";
        el.style.boxShadow = "none";
      }}
    >
      <InfoIcon size={15} />
    </button>
  );
}
