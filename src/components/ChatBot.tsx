"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { InfoIcon, CloseIcon } from "./icons";
import { useEcho } from "@/lib/echo-context";
import {
  PROJECTS,
  SITE_SECTIONS,
  type Project,
  type Section,
  type QuestionType,
  suggestionsForContext,
  staticAnswer,
} from "@/lib/site-content";

type Message = { role: "user" | "assistant"; content: string };

// Client-side routing — 90% případů bez API.
const QUICK_REPLIES: Record<string, string> = {
  "ahoj": "Ahoj. Co tě zajímá?",
  "čau": "Ahoj. Co tě zajímá?",
  "cus": "Ahoj. Co tě zajímá?",
  "cau": "Ahoj. Co tě zajímá?",
  "čus": "Ahoj. Co tě zajímá?",
  "zdar": "Ahoj. Co tě zajímá?",
  "zdravím": "Ahoj. Co tě zajímá?",
  "čum": "Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?",
  "kunda": "Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?",
  "píča": "Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?",
  "pica": "Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?",
  "kokot": "Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?",
  "prdel": "Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?",
  "hovno": "Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?",
};

function tryQuickReply(text: string): string | null {
  const t = text.toLowerCase().trim();
  if (QUICK_REPLIES[t]) return QUICK_REPLIES[t];
  if (t.length <= 3 && !/[a-záčďéěíňóřšťúůýž]{2,}/i.test(t)) {
    return "To bylo krátký. Co tím myslíš?";
  }
  return null;
}

export default function ChatBot() {
  const { open, openEcho, closeEcho, context, contextBadge, setContextBadge } = useEcho();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAssistantId, setLastAssistantId] = useState<number | null>(null);
  const [continueTarget, setContinueTarget] = useState<number | null>(null);
  const [raised, setRaised] = useState<number | null>(null); // ID karty, která je "vyjeta nahoru"
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const raisedRef = useRef<HTMLElement | null>(null);
  const previousRaisedRef = useRef<HTMLElement | null>(null);

  // Když user klikne mimo Echo (a ne na info-icon), zavři ho.
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      // Pokud kliknul na info-icon, necháme ChatBot se otevřít (handle se v InfoIconButton)
      if (target.closest("[data-echo-trigger]")) return;
      if (target.closest("[data-echo-panel]")) return;
      closeEcho();
    }
    // Přidáme listener s mírným delay, aby se nejdřív zpracoval klik na info-icon
    const t = setTimeout(() => {
      document.addEventListener("click", handleClick);
    }, 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("click", handleClick);
    };
  }, [open, closeEcho]);

  // Animace "karta vyjede nahoru" — najdeme element a přidáme třídu.
  useEffect(() => {
    if (!open) {
      // Skryjeme raised
      if (raisedRef.current) {
        raisedRef.current.style.transform = "";
        raisedRef.current.style.transition = "";
        raisedRef.current = null;
      }
      if (previousRaisedRef.current && previousRaisedRef.current !== raisedRef.current) {
        previousRaisedRef.current.style.transform = "";
        previousRaisedRef.current.style.transition = "";
        previousRaisedRef.current = null;
      }
      setRaised(null);
      return;
    }

    // Najdeme kontextovou kartu/sekci podle data-context atributu.
    let selector = "";
    if (context.project) {
      selector = `[data-context-project="${context.project.id}"]`;
    } else if (context.section) {
      selector = `[data-context-section="${context.section.id}"]`;
    }
    if (!selector) return;

    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) return;

    // Pokud už je to samý element, nic neměň.
    if (raisedRef.current === el) return;

    // Resetuj předchozí
    if (raisedRef.current) {
      raisedRef.current.style.transform = "";
      raisedRef.current.style.transition = "";
    }

    // "Vyjede nahoru" — zvětšíme, zvedneme, přidáme stín.
    raisedRef.current = el;
    el.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease";
    el.style.transform = "translateY(-8px) scale(1.02)";
    el.style.boxShadow = "0 24px 64px rgba(0, 0, 0, 0.4)";

    setRaised(Date.now());
  }, [open, context]);

  // ESC zavře Echo
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeEcho();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, closeEcho]);

  // Input focus
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [open]);

  // Když se změní kontext, vyčistíme zprávy.
  useEffect(() => {
    if (open) {
      setMessages([]);
      setLastAssistantId(null);
    }
  }, [context.project?.id, context.section?.id, open]);

  // Funkce pro poslání zprávy.
  const addAssistantMessage = useCallback((content: string) => {
    setMessages((prev) => {
      const next = [...prev, { role: "assistant" as const, content }];
      setLastAssistantId(next.length - 1);
      return next;
    });
  }, []);

  const sendUserMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
  }, []);

  async function callApi(
    msg: string,
    options: { questionType?: QuestionType; continueFrom?: boolean } = {},
  ) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, { role: "user", content: msg }],
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

  function handleSuggestionClick(text: string, type: QuestionType) {
    if (loading) return;
    sendUserMessage(text);
    if (context.project || context.section) {
      const answer = staticAnswer(type, context.project, context.section);
      addAssistantMessage(answer);
    } else {
      setLoading(true);
      callApi(text, { questionType: type }).finally(() => setLoading(false));
    }
  }

  async function handleMore() {
    if (loading || lastAssistantId === null) return;
    const lastUserIdx = messages
      .slice(0, lastAssistantId)
      .findLastIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;
    const lastUserText = messages[lastUserIdx].content;
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

  const currentSuggestions = suggestionsForContext(context.section, context.project);
  const canShowMore =
    lastAssistantId !== null &&
    !loading &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant";

  return (
    <>
      {/* Backdrop — rozostří pozadí, je pod echo-panelem */}
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

      {/* Echo panel — plovoucí glassmorph, vyjíždí z boku (desktop) / zespodu (mobil) */}
      <div
        data-echo-panel
        className="fixed z-50 flex flex-col overflow-hidden transition-all duration-700"
        style={{
          // Glassmorph
          backgroundColor: "rgba(20, 20, 25, 0.65)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: open
            ? "0 32px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
            : "0 0 0 rgba(0, 0, 0, 0)",

          // Desktop: vyjíždí zprava
          // Mobil: vyjíždí zespodu, přes celou obrazovku
          right: 0,
          top: 0,
          bottom: 0,
          width: "min(440px, 100vw)",
          maxWidth: "100vw",
          height: "100dvh",

          // Animace vstupu
          transform: open
            ? "translateX(0) translateY(0)"
            : "translateX(100%) translateY(0)",

          // Mobil override
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
              onClick={() => {
                setContextBadge(null);
                // Vyčistit i context — uživatel nechce mluvit o ničem konkrétním
                // Tady nemůžeme volat openEcho bez resetu, tak to řešíme přes wrapper
              }}
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
              <p
                className="mb-2 text-base font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {context.project || context.section
                  ? "Co tě na tom zajímá?"
                  : "Zeptej se, nebo klikni na info u projektu."}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Krátké odpovědi. Pokud chceš víc, klikni na ↻.
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

        {/* Tlačítko "Více" + Suggestions */}
        <div
          className="border-t px-5 py-3"
          style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
        >
          {canShowMore && (
            <div className="mb-3 flex justify-start">
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

          {messages.length === 0 && (
            <div className="flex flex-wrap gap-1.5">
              {currentSuggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={(e) => { e.stopPropagation(); handleSuggestionClick(s.text, s.type); }}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-colors hover:bg-white/5"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {s.text}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div
          className="border-t p-4"
          style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
        >
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
              style={{
                color: "var(--text-primary)",
                caretColor: "var(--gold)",
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all disabled:opacity-30"
              style={{
                background: "var(--gold)",
                color: "var(--text-inverse)",
              }}
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

      {/* Mobilní override — slide zespodu */}
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
            transform: ${open ? "translateY(0)" : "translateY(100%)"} !important;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
        }
      `}</style>
    </>
  );
}

// Komponenta pro "i" trigger — klik otevře Echo s daným kontextem.
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
      className={`group inline-flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${className}`}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        color: "var(--text-muted)",
      }}
      aria-label="Zeptat se Echa"
      title="Zeptat se Echa"
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(200, 150, 46, 0.12)";
        e.currentTarget.style.borderColor = "rgba(200, 150, 46, 0.3)";
        e.currentTarget.style.color = "var(--gold)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
        e.currentTarget.style.color = "var(--text-muted)";
      }}
    >
      <InfoIcon size={14} />
    </button>
  );
}
