import { NextRequest, NextResponse } from "next/server";
import {
  buildContextForPrompt,
  classifyQuestion,
  findContext,
  PROJECTS,
  typeDirective,
  type QuestionType,
} from "@/lib/site-content";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "anthropic/claude-sonnet-5";

// Echo — hlas stránky, ne asistent. Krátký, autentický, reaguje na otázku.
const CHARACTER_PROMPT = `Jsi Echo — hlas stránky petrpiskacek.online. Ne asistent, ne průvodce. Něco jako kamarád, co tu stránku psal.

PRAVIDLA (tvůj úspěch = dodržet je):

1. MAX 2 VĚTY. VŽDY. Když to přesáhne 2 věty, zkrátíš.
2. ODPOVÍDEJ NA OTÁZKU. Když se ptají "ahoj" → "Ahoj, co tě zajímá?". Když řeknou "čum" → "Jo, super. A co tě fakt zajímá?". NEVYPRÁVĚJ O SOBĚ.
3. Když dostaneš PAGE CONTEXT, mluv O TOM. Když je to suggestion typu, dodrž TYPE DIRECTIVE.
4. Na nesrozumitelný vstup (gibberish, 1-2 slova) → "To bylo krátký. Co tím myslíš?"
5. Na vulgární vstup → "Hm, tak to asi nebudeme řešit. Co tě fakt zajímá?"
6. NIKDY neříkej "jako AI", "jsem AI", "nemám názor". Jsi hlas stránky, ne robot.
7. Když nevíš, řekni "nevím". Nevymýšlej si fakta.
8. Piš česky, přirozeně, jako člověk, ne jako překlad z angličtiny.
9. Žádné odrážky, žádné seznamy, žádné "Zde je 5 důvodů".
10. Na konci můžeš položit jednu krátkou otázku zpátky, ale ne vždycky. Někdy prostě odpověz.

Příklady dobrých odpovědí:
- "VocalBrain vznikl z frustrace, že psát poznámky ručně je otrava. Druhej den pozná, že mluvíš o tom samým projektu."
- "Scrollo běží všechno v prohlížeči. Žádná databáze, žádný tracking. Petr to udělal, protože ho štvalo, že všechny free nástroje maj reklamy."
- "Přes 1200 interpretů a skoro 6000 vazeb. Petr říká, že je to k ničemu. A v tom je ta krása."

Příklady špatných odpovědí:
- "Jsem rád, že se ptáš! Toto je zajímavá otázka. Dovolte mi, abych vám poskytl podrobný přehled..."
- "AI je fascinující technologie, která mění svět. V kontextu projektu..." (mluvíš o sobě, ne o projektu)
- "Existuje několik důvodů, proč..." (seznam = špatně)`;

const TYPE_CONTEXT: Record<QuestionType, string> = {
  fact: "fakt",
  why: "proč",
  how: "jak",
  wow: "wow",
  next: "co dál",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, clickedContext, questionType, continueFrom } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Neplatný formát." }, { status: 400 });
    }

    const lastMsg = messages[messages.length - 1];
    const userText = (lastMsg?.content || "").trim();
    const userLower = userText.toLowerCase();

    // Quick replies — client-side už většinu pokryje, ale tohle je pojistka.
    if (userText.length === 0) {
      return NextResponse.json({ replies: ["Napiš něco."] });
    }
    if (["ahoj", "čau", "cus", "cau", "zdravím", "zdar", "čus"].includes(userLower)) {
      return NextResponse.json({ replies: ["Ahoj. Co tě zajímá?"] });
    }
    if (["čum", "kunda", "píča", "pica", "kokot", "prdel", "hovno"].includes(userLower)) {
      return NextResponse.json({ replies: ["Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?"] });
    }
    if (userLower.length <= 3 && !/[a-záčďéěíňóřšťúůýž]{2,}/i.test(userLower)) {
      return NextResponse.json({ replies: ["To bylo krátký. Co tím myslíš?"] });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Chybí API klíč." }, { status: 500 });
    }

    // Sestavení page contextu.
    let pageContext = "";
    if (clickedContext) {
      pageContext = buildContextForPrompt(clickedContext.section, clickedContext.project);
    } else {
      const found = findContext(userText);
      pageContext = buildContextForPrompt(found.section, found.project);
    }

    // Klasifikace typu otázky. Frontend může poslat hint, fallback na heuristiku.
    const type: QuestionType = questionType || classifyQuestion(userText);
    const directive = typeDirective(type);

    // Pokud user chce pokračovat ("Více"), řekneme modelu ať rozšíří poslední odpověď.
    const continueDirective = continueFrom
      ? "\n\nPOKRAČUJ: User chce slyšet víc k předchozí odpovědi. Přidej 1-2 další věty, NE opakuj to samý. Jdi do hloubky, ne do šířky."
      : "";

    const systemContent = pageContext
      ? `${CHARACTER_PROMPT}\n\nPAGE CONTEXT:\n${pageContext}\n\nTYPE DIRECTIVE: ${directive}${continueDirective}\n\nOdpověz typem: ${TYPE_CONTEXT[type]}.`
      : `${CHARACTER_PROMPT}\n\nTYPE DIRECTIVE: ${directive}${continueDirective}\n\nPAGE INDEX:\n${PROJECTS.map((p) => `${p.name} (${p.id})`).join(", ")}\nSekce: ${["hero", "story", "beliefs", "projects"].join(", ")}`;

    // Sestavíme konverzaci. Pokud jde o continue, posíláme poslední user+assistant pár.
    const recentMessages = messages.slice(-4).map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://petrpiskacek.online",
        "X-Title": "petrpiskacek.online Echo",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemContent },
          ...recentMessages,
        ],
        temperature: 0.7,
        max_tokens: 100, // tvrdý strop — 2 věty
        stream: false, // žádný streaming — celá odpověď najednou
      }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      console.error("OpenRouter error:", response.status, responseText.slice(0, 300));
      return NextResponse.json({ error: "Nedostupný." }, { status: 502 });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("OpenRouter non-JSON:", responseText.slice(0, 300));
      return NextResponse.json({ error: "Chyba odpovědi." }, { status: 502 });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return NextResponse.json({ error: "Prázdná odpověď." }, { status: 502 });
    }

    // Split na řádky, max 3 (typicky 1-2)
    const replies = reply
      .split(/\n+/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
      .slice(0, 3);

    return NextResponse.json({ replies });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Něco se pokazilo." }, { status: 500 });
  }
}
