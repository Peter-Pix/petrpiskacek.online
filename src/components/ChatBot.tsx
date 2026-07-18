"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatIcon } from "./icons";
import { PROJECTS, SITE_SECTIONS, type Project, type Section } from "@/lib/site-content";

// Kontextové suggestion podle toho, na co uživatel kliknul.
function suggestionsForContext(
  section?: Section,
  project?: Project,
): string[] {
  if (project) {
    switch (project.id) {
      case "vocalbrain":
        return [
          "Jak to funguje technicky?",
          "Co na tom baví Petra nejvíc?",
          "Kde to vidí za 2 roky?",
        ];
      case "stylemorph":
        return [
          "Proč zrovna redesign webů?",
          "Jak rychle to udělá stránku?",
          "Stojí to něco?",
        ];
      case "autoblog":
        return [
          "Jak AI pozná, co lidi zajímá?",
          "Kontroluje se to vůbec?",
          "Může to psát i o technologii?",
        ];
      case "scrollo":
        return [
          "Co je tam za nástroje?",
          "Proč bez reklam?",
          "Ukládá se něco?",
        ];
      case "4rap":
        return [
          "Proč zrovna český rap?",
          "Kolik interpretů tam je?",
          "Co dalšího se tam dá najít?",
        ];
    }
  }
  if (section) {
    switch (section.id) {
      case "hero":
        return ["Kdo je Petr?", "Co teď dělá?", "Proč tři weby?"];
      case "story":
        return [
          "Jak začal s programováním?",
          "Co byl ten první moment s AI?",
          "Co ho na AI nejvíc baví?",
        ];
      case "beliefs":
        return [
          "Co si myslí o AI v roce 2030?",
          "Bojí se něčeho?",
          "Nahradí AI programátory?",
        ];
      case "projects":
        return [
          "Jaký je jeho nejoblíbenější?",
          "Který trval nejdýl?",
          "Co bude dělat dál?",
        ];
    }
  }
  return [
    "Co Petr dělá?",
    "Proč začal s AI?",
    "Co si myslí o budoucnosti AI?",
    "Jaké projekty postavil?",
  ];
}

const DEFAULT_SUGGESTIONS = [
  "Co Petr dělá?",
  "Proč začal s AI?",
  "Co si myslí o budoucnosti AI?",
  "Jaké projekty postavil?",
];

type Message = { role: "user" | "assistant"; content: string };
type ClickedContext = { section?: Section; project?: Project };

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [clickedContext, setClickedContext] = useState<ClickedContext>({});
  const [autoScroll, setAutoScroll] = useState(true);
  const [contextBadge, setContextBadge] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
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

  // Autoscroll — pouze pokud je to zapnuté. Při vypnutí necháme scroll kde je.
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, autoScroll]);

  // Detekce user scrollu — pokud scrollne nahoru, vypneme autoscroll.
  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    // Jsme 80px odspoda? → autoscroll zůstává. Jinak ho vypneme.
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom > 80) {
      setAutoScroll(false);
    } else if (distanceFromBottom < 10) {
      setAutoScroll(true);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  async function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setShowSuggestions(false);
    setAutoScroll(true); // nová zpráva → zase sledujeme
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: msg }],
          clickedContext,
        }),
      });

      if (!res.ok) throw new Error("Chyba");

      const data = await res.json();
      const replies = data.replies || [];

      setMessages((prev) => [
        ...prev,
        ...replies.map((r: string) => ({ role: "assistant", content: r })),
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Promiň, teď nemůžu odpovědět. Zkus to znovu za chvíli.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const currentSuggestions =
    clickedContext.project || clickedContext.section
      ? suggestionsForContext(clickedContext.section, clickedContext.project)
      : DEFAULT_SUGGESTIONS;

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
              <span className="text-sm font-medium">Průvodce příběhem</span>
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

          {/* Context badge — ukáže, co si zrovna prohlížej */}
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
                📍 Mluvíme o: <strong style={{ color: "var(--gold)" }}>{contextBadge}</strong>
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

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 scrollbar-thin"
            style={{ scrollBehavior: "smooth" }}
          >
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ChatIcon size={32} className="mb-3" />
                <p className="mb-1 text-sm font-medium">
                  Zeptej se na cokoliv ze stránky
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Nebo klikni na projekt nahoře — přepnu se na něj.
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

          {/* Autoscroll toggle + Suggestions */}
          <div
            className="flex items-center justify-between gap-2 border-t px-4 py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              onClick={() => setAutoScroll((v) => !v)}
              className="flex items-center gap-1.5 text-xs transition-opacity"
              style={{
                color: "var(--text-muted)",
                opacity: autoScroll ? 1 : 0.5,
              }}
              aria-label={autoScroll ? "Vypnout autoscroll" : "Zapnout autoscroll"}
              title={
                autoScroll
                  ? "Autoscroll je zapnutý — klikneš pro vypnutí"
                  : "Autoscroll je vypnutý — klikneš pro zapnutí"
              }
            >
              {autoScroll ? "▼" : "■"} {autoScroll ? "sleduje" : "stojí"}
            </button>
            {contextBadge && (
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                o: {contextBadge}
              </span>
            )}
          </div>

          {showSuggestions && messages.length === 0 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {currentSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:border-gold hover:text-gold"
                  style={{
                    borderColor: "var(--tag-border)",
                    backgroundColor: "var(--tag-bg)",
                    color: "var(--tag-text)",
                  }}
                >
                  {s}
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
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
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
