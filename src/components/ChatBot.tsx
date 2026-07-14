"use client";

import { useState, useRef, useEffect } from "react";
import { ChatIcon, ExternalLinkIcon } from "./icons";

const SUGGESTIONS = [
  "Co Petr dělá?",
  "Proč začal s AI?",
  "Co si myslí o budoucnosti AI?",
  "Jaké projekty postavil?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  async function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setShowSuggestions(false);
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: msg }] }),
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
        { role: "assistant", content: "Promiň, teď nemůžu odpovědět. Zkus to znovu za chvíli." },
      ]);
    } finally {
      setLoading(false);
    }
  }

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
              <span className="text-sm font-medium">Zeptej se mě</span>
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ChatIcon size={32} className="mb-3" />
                <p className="mb-1 text-sm font-medium">Zeptej se mě na cokoliv</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  O Petrovi, jeho projektech, přesvědčení — normální řečí.
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
                    msg.role === "user"
                      ? "rounded-br-md"
                      : "rounded-bl-md"
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

          {/* Suggestions */}
          {showSuggestions && messages.length === 0 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {SUGGESTIONS.map((s) => (
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
