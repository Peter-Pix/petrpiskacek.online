"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatIcon } from "./icons";
import {
  PROJECTS,
  SITE_SECTIONS,
  type Project,
  type Section,
  type QuestionType,
  suggestionsForContext,
  staticAnswer,
  classifyQuestion,
  findContext,
} from "@/lib/site-content";

type Message = { role: "user" | "assistant"; content: string };
type ClickedContext = { section?: Section; project?: Project };
type Toast = { id: number; text: string };

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
  // Krátké slovo bez smyslu
  if (t.length <= 3 && !/[a-záčďéěíňóřšťúůýž]{2,}/i.test(t)) {
    return "To bylo krátký. Co tím myslíš?";
  }
  return null;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [clickedContext, setClickedContext] = useState<ClickedContext>({});
  const [contextBadge, setContextBadge] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [lastAssistantId, setLastAssistantId] = useState<number | null>(null);
  const [continueTarget, setContinueTarget] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Detekce kliknutí na elementy s data-context atributem.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest(
        "[data-context-section], [data-context-project]",
      );
      if (!target) return;

      const sectionId = target.getAttribute("data-context-section");
      const projectId = target.getAttribute("data-context-project");

      const section = sectionId
        ? SITE_SECTIONS.find((s) => s.id === sectionId)
        : undefined;
      const project = projectId
        ? PROJECTS.find((p) => p.id === projectId)
        : undefined;

      if (section || project) {
        const newContext: ClickedContext = { section, project };
        setClickedContext(newContext);
        const label = project?.name || section?.title || null;
        setContextBadge(label);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Input focus
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Funkce pro poslání zprávy.
  const addAssistantMessage = useCallback((content: string) => {
    setMessages((prev) => {
      const next = [...prev, { role: "assistant" as const, content }];
      setLastAssistantId(next.length - 1);
      return next;
    });
    // Toast upozornění (když je user scrollnutej jinde)
    setToast({ id: Date.now(), text: content.slice(0, 60) + (content.length > 60 ? "…" : "") });
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
        clickedContext,
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
      // 1) Quick reply
      const quick = tryQuickReply(msg);
      if (quick) {
        addAssistantMessage(quick);
        return;
      }

      // 2) Suggestion tlačítko — pokud user kliknul na suggestion, máme type
      // (handled separately v handleSuggestionClick)

      // 3) API call
      await callApi(msg);
    } finally {
      setLoading(false);
    }
  }

  // Suggestion tlačítka — statická odpověď pro projekt/sekci.
  function handleSuggestionClick(
    text: string,
    type: QuestionType,
  ) {
    if (loading) return;
    sendUserMessage(text);

    // Statická odpověď pokud máme context
    if (clickedContext.project || clickedContext.section) {
      const answer = staticAnswer(
        type,
        clickedContext.project,
        clickedContext.section,
      );
      addAssistantMessage(answer);
    } else {
      // Bez kontextu — pošleme na API
      setLoading(true);
      callApi(text, { questionType: type }).finally(() => setLoading(false));
    }
  }

  // Tlačítko "Více" — pokračování poslední odpovědi.
  async function handleMore() {
    if (loading || lastAssistantId === null) return;

    // Najdeme poslední user zprávu (před assistant)
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

  // Submit na Enter
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const currentSuggestions = suggestionsForContext(
    clickedContext.section,
    clickedContext.project,
  );

  const canShowMore =
    lastAssistantId !== null &&
    !loading &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant";

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110"
        style={{
          backgroundColor: "var(--gold)",
          color: "var(--text-inverse)",
          boxShadow: "0 8px 32px rgba(200, 150, 46, 0.35)",
        }}
        aria-label="Otevřít chat"
      >
        <ChatIcon size={24} />
      </button>

      {/* Toast notifikace — vpravo dole, krátká, mizí sama */}
      {toast && (
        <div
          className="fixed bottom-24 right-6 z-[60] max-w-[280px] rounded-xl border px-3 py-2 text-xs shadow-lg"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--gold)",
            color: "var(--text-primary)",
            animation: "fadeInUp 0.2s ease-out",
          }}
          onClick={() => setOpen(true)}
        >
          <div className="mb-1 text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Echo
          </div>
          <div className="line-clamp-2">{toast.text}</div>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border shadow-2xl"
          style={{
            height: "min(600px, calc(100vh - 8rem))",
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between rounded-t-2xl border-b px-4 py-3"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium">Echo</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                — hlas stránky
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
              style={{ color: "var(--text-muted)" }}
              aria-label="Zavřít chat"
            >
              ✕
            </button>
          </div>

          {/* Context badge */}
          {contextBadge && (
            <div
              className="flex items-center justify-between gap-2 border-b px-4 py-2 text-xs"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-muted)",
              }}
            >
              <span className="truncate">
                Mluvíme o:{" "}
                <strong style={{ color: "var(--gold)" }}>{contextBadge}</strong>
              </span>
              <button
                onClick={() => {
                  setClickedContext({});
                  setContextBadge(null);
                }}
                className="shrink-0 text-xs underline"
                style={{ color: "var(--text-muted)" }}
              >
                vyčistit
              </button>
            </div>
          )}

          {/* Messages — žádný autoscroll. User scrolluje sám. */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ChatIcon size={32} className="mb-3" />
                <p className="mb-1 text-sm font-medium">
                  Zeptej se, nebo klikni na projekt nahoře.
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Krátké odpovědi. Pokud chceš víc, klikni na „Více".
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"
                  }`}
                  style={{
                    backgroundColor:
                      msg.role === "user"
                        ? "var(--chat-user-bg)"
                        : "var(--chat-assistant-bg)",
                    color:
                      msg.role === "user"
                        ? "var(--chat-user-text)"
                        : "var(--chat-assistant-text)",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="mb-3 flex justify-start">
                <div
                  className="flex items-center gap-1.5 rounded-2xl rounded-bl-md px-4 py-3"
                  style={{
                    backgroundColor: "var(--chat-assistant-bg)",
                  }}
                >
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Tlačítko „Více" — rozšíření poslední odpovědi */}
          {canShowMore && messages.length > 0 && (
            <div className="flex justify-start px-4 pb-2">
              <button
                onClick={handleMore}
                disabled={loading}
                className="rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:border-gold hover:text-gold disabled:opacity-30"
                style={{
                  borderColor: "var(--tag-border)",
                  backgroundColor: "var(--tag-bg)",
                  color: "var(--tag-text)",
                }}
              >
                {loading && continueTarget !== null ? "Přemýšlím…" : "↻ Více"}
              </button>
            </div>
          )}

          {/* Suggestion tlačítka — mikro-otázky */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {currentSuggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSuggestionClick(s.text, s.type)}
                  className="rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:border-gold hover:text-gold"
                  style={{
                    borderColor: "var(--tag-border)",
                    backgroundColor: "var(--tag-bg)",
                    color: "var(--tag-text)",
                  }}
                >
                  {s.text}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            className="flex items-end gap-2 border-t p-3"
            style={{ borderColor: "var(--border)" }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Napiš otázku..."
              rows={1}
              className="max-h-20 min-h-[36px] flex-1 resize-none rounded-xl border bg-transparent px-3 py-2 text-sm outline-none"
              style={{
                borderColor: "var(--input-border)",
                color: "var(--input-text)",
                caretColor: "var(--gold)",
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all disabled:opacity-30"
              style={{
                backgroundColor: "var(--gold)",
                color: "var(--text-inverse)",
              }}
            >
              <svg
                width="16"
                height="16"
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
      )}
    </>
  );
}
