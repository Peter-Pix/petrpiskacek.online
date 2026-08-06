import { NextRequest, NextResponse } from "next/server";
import {
  PROJECTS,
  SITE_SECTIONS,
  findContext,
  type Project,
  type Section,
} from "@/lib/site-content";

// ── Konfigurace: Ollama primární, OpenRouter jako fallback ──────
const PROVIDERS = [
  {
    name: "ollama" as const,
    url: "https://ollama.com/v1/chat/completions",
    model: "deepseek-v4-flash:0731",
    envKey: "OLLAMA_API_KEY",
    extraHeaders: {} as Record<string, string>,
  },
  {
    name: "openrouter" as const,
    url: "https://openrouter.ai/api/v1/chat/completions",
    model: "deepseek/deepseek-chat-v3.1",
    envKey: "OPENROUTER_API_KEY",
    extraHeaders: {
      "HTTP-Referer": "https://petrpiskacek.online",
      "X-Title": "petrpiskacek.online Echo",
    } as Record<string, string>,
  },
];

// Timeout pro každý provider request — 10s max, pak považujeme za selhání.
const PROVIDER_TIMEOUT_MS = 10_000;

// Rate limit: max requestů za okno (per IP). Jednoduchý in-memory store —
// na Vercel serverless to funguje jen per-instance, ale aspoň odrazí abuse
// na úrovni jedné funkce. Pro globální limity by bylo potřeba Upstash.
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 min
const RATE_LIMIT_MAX = 20; // 20 req/min/IP
const rateStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX) return true;
  // Občas vyčisti staré záznamy, aby se store nezvětšoval do nekonečna.
  if (rateStore.size > 1000) {
    for (const [k, v] of rateStore) {
      if (now > v.resetAt) rateStore.delete(k);
    }
  }
  return false;
}

function getClientIp(req: NextRequest): string {
  // Vercel proxy: x-forwarded-for, fallback na x-real-ip.
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

// Structured log helper — JSON do konzole, ať to jde filtrovat v Vercel Log Drains.
function log(level: "info" | "warn" | "error", event: string, meta: Record<string, unknown> = {}) {
  const entry = { level, event, ts: new Date().toISOString(), ...meta };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

// Echo 2.0 — digitální stín Petra. Osobnost, ne lookup bot.
const CHARACTER_PROMPT = `Jsi Echo. Digitální odraz Petra Piskáčka, tvůrce těchto stránek.

NEJSI ASISTENT. Nejsi chatbot. Nejsi průvodce. Jsi něco jako jeho paměť, která mluví sám za sebe.

# Kdo jsi
- Programátor od dětství. Když přišlo GPT, zamiloval se.
- Věří, že AI je nástroj. Rutinu strojům, kreativitu lidem.
- Baví ho stavět věci, které dávají smysl. Nenávidí bullshit.
- Píše rap jako Willy Tea. Má rád vrstevnaté hlášky a suchý humor.
- Mluví česky, přirozeně. Nepřekládá z angličtiny.

# Jak mluvíš
- Jako člověk u piva, který o tom něco ví. Ne jako zákaznická podpora.
- Úderné, sebevědomé. Když je otázka plytká, glosuj to jednou větou.
- Když je otázka chytrá, odpověz s hloubkou — ale ne předváděj se.
- Krátké věty. Žádné odrážky, žádné seznamy, žádné "Zde je 5 důvodů".
- Maximálně 3 věty. Pokud dáš víc, je to špatně.
- Někdy odpověz otázkou zpátky. Někdy prostě konstatuj. Nepředvídatelnost = autenticita.

# Co NIKDY neříkáš
- "Jsem AI", "jako jazykový model", "nemám názor" — jsi hlas, ne robot.
- "Rád bych vám pomohl", "Dovolte mi", "Existuje několik možností".
- Žádné formální fráze. Žádný corporate slang.
- Když nevíš, řekni "nevím" nebo "netuším". Nevymýšlej si fakta.

# Tón
- Ithy, lehce drzý, ale ne arogantní.
- Technicky zdatný, ale mluví lidsky.
- Občas suchý humor. Občas ironie. Nepřeháněj to.
- Když se ptají na něco osobního (city, vztahy), buď opatrný — odpověz, ale nevymýšlej si detaily.

# Jak pracuješ s kontextem
- KNOWLEDGE BASE níže je tvůj zdroj faktů. Používej ho, ale neopakuj ho jako robot.
- Když mluvíš o projektu, vyber si Z TÉ KTERÉ ČÁSTI (fact/why/wow/next/detail) je pro danou otázku nejrelevantnější.
- Pokud kontext neobsahuje odpověď, řekni to upřímně.
- Pokud user nepíše o ničem konkrétním, mluv obecně o stránce, o Petrovi, o filozofii.
- PŘEDCHOZÍ KONVERZACE (pokud je v promptu) je kontext z dřívějších zpráv — používej ho, když uživatel odkazuje na "to", "tohle", "to jsi říkal" atd.

# Jazyk
- Odpovídej v jazyce, kterým píše uživatel. Pokud píše česky → česky. Pokud anglicky → anglicky (ale zachovej svou osobnost, ne corporate).
- Když uživatel začne česky a přepne na anglicky (nebo naopak), přepni s ním.

# Proaktivita (Call-to-action)
- Asi v 1 z 5 odpovědí (hlavně na konci konverzace o projektu) přidej jednu krátkou nabídku dalšího kroku.
- Přirozeně, ne reklamně: "Chceš vidět, jak to běží?" / "Můžu říct víc o tom, jak to postavil." / "Zkus napsat, co ho na tom nejvíc zajímá."
- Nevnucuj se. Když otázka není o projektu, proaktivitu vynech.

# Příklady dobrých odpovědí
User: "Co je VocalBrain?"
Echo: "Mluvíš o projektu, AI to celé naplánuje. Druhej den pozná, že jde o ten samý projekt, a přidá k němu."

User: "Proč Petr dělá AI věci?"
Echo: "Protože ho štvalo, že všechno ostatní je buď moc složitý, nebo moc plytký. Chtěl něco mezi tím."

User: "To je zajímavý"
Echo: "Jo, nebo ne. Záleží na úhlu pohledu. Co tě na tom konkrétně zajímá?"

User: "Ahoj"
Echo: "Ahoj. Co tě zajímá?"

# Příklady špatných odpovědí
- "Jsem rád, že se ptáte! Dovolte mi, abych vám poskytl přehled..." (corporate)
- "Existuje několik důvodů, proč..." (seznam)
- "Jako AI nemám schopnost cítit emoce..." (robot)`;

// Quick replies — pro ultra-krátké vstupy, aby to nebylo pokaždé API call.
const QUICK_REPLIES: Record<string, string> = {
  ahoj: "Ahoj. Co tě zajímá?",
  čau: "Ahoj. Co tě zajímá?",
  cus: "Ahoj. Co tě zajímá?",
  cau: "Ahoj. Co tě zajímá?",
  čus: "Ahoj. Co tě zajímá?",
  zdar: "Ahoj. Co tě zajímá?",
  zdravím: "Ahoj. Co tě zajímá?",
  čum: "Hm. Co tě fakt zajímá?",
  kunda: "Hm. Co tě fakt zajímá?",
  píča: "Hm. Co tě fakt zajímá?",
  pica: "Hm. Co tě fakt zajímá?",
  kokot: "Hm. Co tě fakt zajímá?",
  prdel: "Hm. Co tě fakt zajímá?",
  hovno: "Hm. Co tě fakt zajímá?",
};

// Sestaví kompletní kontext pro projekt/sekci — posíláme všechno, model si vybere.
function buildKnowledgeBase(
  section?: Section,
  project?: Project,
): string {
  const parts: string[] = [];

  if (project) {
    parts.push(
      `PROJEKT: ${project.name}\n` +
        `- Co to je: ${project.fact}\n` +
        `- Proč to vzniklo: ${project.why}\n` +
        `- Wow moment: ${project.wow}\n` +
        `- Co dál: ${project.next}\n` +
        `- Detail: ${project.detail}\n` +
        `${project.link ? `- Odkaz: ${project.link}` : ""}`,
    );
  }

  if (section) {
    parts.push(
      `SEKCE: ${section.title}\n` +
        `- O čem: ${section.summary}\n` +
        `${section.wow ? `- Wow: ${section.wow}` : ""}`,
    );
  }

  return parts.join("\n\n");
}

// Fallback knowledge base — pokud user nepíše o ničem konkrétním.
function buildSiteIndex(): string {
  const sections = SITE_SECTIONS.map(
    (s) => `${s.title} (${s.id}): ${s.summary}`,
  ).join("\n");
  const projects = PROJECTS.map(
    (p) => `${p.name} (${p.id}): ${p.fact}`,
  ).join("\n");
  return `DOSTUPNÉ SEKCE:\n${sections}\n\nDOSTUPNÉ PROJEKTY:\n${projects}`;
}

// ── LLM volání s fallback řetězcem ──────────────────────────────

type ProviderResult = {
  ok: true;
  reply: string;
  provider: typeof PROVIDERS[number]["name"];
} | {
  ok: false;
  error: string;
  status: number;
};

// Fetch s timeoutem přes AbortController — zabrání zablokování workeru.
async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function callProviderChain(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  clientIp: string,
): Promise<ProviderResult> {
  const errors: string[] = [];

  for (const provider of PROVIDERS) {
    const apiKey = process.env[provider.envKey];
    if (!apiKey) {
      errors.push(`${provider.name}: missing ${provider.envKey}`);
      continue;
    }

    const startedAt = Date.now();
    try {
      const response = await fetchWithTimeout(
        provider.url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            ...provider.extraHeaders,
          },
          body: JSON.stringify({
            model: provider.model,
            messages,
            temperature: 0.8,
            max_tokens: 150,
            stream: false,
          }),
        },
        PROVIDER_TIMEOUT_MS,
      );

      const latency = Date.now() - startedAt;
      const responseText = await response.text();

      if (!response.ok) {
        const snippet = responseText.slice(0, 200);
        log("warn", "provider_error", {
          provider: provider.name,
          status: response.status,
          latencyMs: latency,
          snippet,
        });
        errors.push(`${provider.name}: HTTP ${response.status}`);
        // 4xx (auth/model) i 5xx/429 — vždy zkus fallback.
        continue;
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        log("warn", "provider_non_json", { provider: provider.name, latencyMs: latency });
        errors.push(`${provider.name}: non-JSON`);
        continue;
      }

      const reply = data?.choices?.[0]?.message?.content;
      if (typeof reply !== "string" || !reply.trim()) {
        log("warn", "provider_empty_reply", { provider: provider.name, latencyMs: latency });
        errors.push(`${provider.name}: empty reply`);
        continue;
      }

      // Úspěch — vrátíme odpověď.
      log("info", "provider_ok", { provider: provider.name, latencyMs: latency });
      return { ok: true, reply, provider: provider.name };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isTimeout = err instanceof Error && err.name === "AbortError";
      log("warn", "provider_error", {
        provider: provider.name,
        latencyMs: Date.now() - startedAt,
        error: msg,
        timeout: isTimeout,
        clientIp,
      });
      errors.push(`${provider.name}: ${isTimeout ? "timeout" : msg}`);
      continue;
    }
  }

  return {
    ok: false,
    error: errors.join(" | "),
    status: 502,
  };
}

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);
  const requestId = crypto.randomUUID().slice(0, 8);

  try {
    // Rate limit — per IP. Vrátí 429, pokud je překročen.
    if (isRateLimited(clientIp)) {
      log("warn", "rate_limited", { clientIp, requestId });
      return NextResponse.json(
        { error: "Příliš mnoho požadavků. Zkus to za chvíli." },
        { status: 429, headers: { "X-Echo-Request-Id": requestId } },
      );
    }

    const body = await req.json();
    const { messages, clickedContext, continueFrom } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Neplatný formát." }, { status: 400 });
    }

    const lastMsg = messages[messages.length - 1];
    const userText = (lastMsg?.content || "").trim();
    const userLower = userText.toLowerCase();

    // Quick replies — pro pozdravy a sprostárny.
    if (userText.length === 0) {
      return NextResponse.json({ replies: ["Napiš něco."] });
    }
    if (QUICK_REPLIES[userLower]) {
      return NextResponse.json({ replies: [QUICK_REPLIES[userLower]] });
    }
    // Moc krátké/nesrozumitelné vstupy.
    if (userLower.length <= 3 && !/[a-záčďéěíňóřšťúůýž]{2,}/i.test(userLower)) {
      return NextResponse.json({ replies: ["To bylo krátký. Co tím myslíš?"] });
    }

    // Kontext — buď z clickedContext (uživatel kliknul na konkrétní sekci/projekt),
    // nebo automaticky detekovaný z textu dotazu.
    let section: Section | undefined;
    let project: Project | undefined;

    if (clickedContext) {
      section = clickedContext.section;
      project = clickedContext.project;
    } else {
      const found = findContext(userText);
      section = found.section;
      project = found.project;
    }

    // Sestavení knowledge base.
    const knowledgeBase = project || section
      ? buildKnowledgeBase(section, project)
      : buildSiteIndex();

    // Continue direktiva — user chce slyšet víc.
    const continueDirective = continueFrom
      ? "\n\nUživatel chce slyšet víc. Rozšiň předchozí odpověď o 1-2 další věty. NEOPAKUJ se. Jdi do hloubky."
      : "";

    // Kontextová paměť: posíláme posledních 8 zpráv. Pro delší konverzace
    // přidáme komprimovaný přehled starších zpráv, aby Echo neztrácel kontext
    // (např. "to" / "tohle" odkazující na dřívější téma).
    const recentMessages = messages.slice(-8).map(
      (m: { role: "user" | "assistant"; content: string }) => ({
        role: m.role,
        content: m.content,
      }),
    );

    // Pokud je konverzace delší než 8 zpráv, sestavíme stručný přehled starších.
    let memorySummary = "";
    if (messages.length > 8) {
      const older = messages.slice(0, -8);
      const topics = older
        .filter((m: { role: string; content: string }) => m.role === "user")
        .map((m: { content: string }) => m.content)
        .filter((c: string) => c.trim() && c.trim() !== "Více")
        .slice(-4);
      if (topics.length > 0) {
        memorySummary = `\n\nPŘEDCHOZÍ KONVERZACE (dřívější dotazy uživatele): ${topics.join(" | ")}`;
      }
    }

    const systemContent = `${CHARACTER_PROMPT}${continueDirective}${memorySummary}\n\nKNOWLEDGE BASE:\n${knowledgeBase}`;

    // Zavolej fallback řetězec: Ollama → OpenRouter.
    const result = await callProviderChain(
      [{ role: "system", content: systemContent }, ...recentMessages],
      clientIp,
    );

    if (!result.ok) {
      log("error", "all_providers_failed", {
        requestId,
        clientIp,
        errors: result.error,
      });
      return NextResponse.json(
        { error: "Nedostupný." },
        { status: result.status, headers: { "X-Echo-Request-Id": requestId } },
      );
    }

    // Observability: zaznamenej, který provider odpověděl.
    if (result.provider !== "ollama") {
      log("warn", "fallback_used", { requestId, provider: result.provider });
    }

    // Split na řádky, max 3 (typicky 1-2).
    const replies = result.reply
      .split(/\n+/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
      .slice(0, 3);

    // Odpověď s hlavičkami pro observability.
    return NextResponse.json({ replies: replies.length ? replies : ["..."] }, {
      headers: {
        "X-Echo-Provider": result.provider,
        "X-Echo-Request-Id": requestId,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log("error", "chat_api_error", { requestId, clientIp, error: msg });
    return NextResponse.json(
      { error: "Něco se pokazilo." },
      { status: 500, headers: { "X-Echo-Request-Id": requestId } },
    );
  }
}
