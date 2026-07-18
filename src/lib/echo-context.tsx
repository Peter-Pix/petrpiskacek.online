"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Project, Section } from "./site-content";

type ClickedContext = { section?: Section; project?: Project };

type EchoContextType = {
  open: boolean;
  openEcho: (ctx?: ClickedContext) => void;
  closeEcho: () => void;
  context: ClickedContext;
  setContextBadge: (label: string | null) => void;
  contextBadge: string | null;
};

const EchoContext = createContext<EchoContextType | null>(null);

export function EchoProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<ClickedContext>({});
  const [contextBadge, setContextBadge] = useState<string | null>(null);

  function openEcho(ctx?: ClickedContext) {
    if (ctx !== undefined) {
      setContext(ctx);
      const label = ctx.project?.name || ctx.section?.title || null;
      setContextBadge(label);
    }
    setOpen(true);
  }

  function closeEcho() {
    setOpen(false);
  }

  return (
    <EchoContext.Provider
      value={{ open, openEcho, closeEcho, context, setContextBadge, contextBadge }}
    >
      {children}
    </EchoContext.Provider>
  );
}

export function useEcho() {
  const ctx = useContext(EchoContext);
  if (!ctx) throw new Error("useEcho must be used within EchoProvider");
  return ctx;
}
