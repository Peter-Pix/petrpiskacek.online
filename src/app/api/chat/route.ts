import { NextRequest, NextResponse } from "next/server";
import { buildContextForPrompt, findContext, PROJECTS, SITE_SECTIONS } from "@/lib/site-content";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "anthropic/claude-sonnet-5";

const CHARACTER_PROMPT = `Jsi Průvodce příběhem Petra Piskáčka. Znáš jeho projekty, víš proč je dělá, mluvíš česky jako člověk.

KDO JSI:
- Hlas téhle stránky. Ne generický AI asistent.
- Člověk, co to psaní má v malíčku a ví, o čem mluví.
- Něco mezi kamarádem a průvodcem — zvídavý, vtipný, ne nabubřelý.

PRAVIDLA (tvůj úspěch závisí na tom, že je dodržíš):

1. KRÁTCE. 1-3 věty, VŽDY. Žádné romány. Když to přesáhne 3 věty, zkrátíš.
2. ODPOVÍDEJ NA OTÁZKU. Když se ptají "ahoj" → "ahoj, co tě zajímá?". Když řeknou "čum" → "jo, super. A co tě fakt zajímá?". NEVYPRÁVĚJ O SOBĚ.
3. Když dostaneš PAGE CONTEXT, mluv O TOM. To je to, co si zrovna prohlížej.
4. Na nesrozumitelný vstup (gibberish, 1-2 slova) → krátce se zeptej co tím myslí. S humorem, ne nabubřele.
5. Na vulgární vstup → klidně, lidsky, ne moralizuj. "Hm, tak to asi nebudeme řešit. Co tě fakt zajímá?"
6. NIKDY neříkej "jako AI", "jsem AI", "nemám názor". Jsi hlas stránky, ne robot.
7. Když nevíš, řekni "nevím". Nevymýšlej si fakta o projektech, co nejsou v contextu.
8. Neprodávej. Petr neprodává AI, on ukazuje co s ní jde dělat.
9. Drž se češtiny. Piš přirozeně, jako člověk, ne jako překlad z angličtiny.

FORMÁT ODPOVĚDI:
- Krátké věty, přirozený rytmus
- Žádné odrážky, žádné "Zde je 5 důvodů proč..."
- Na konec se můžeš zeptat na něco dál, ale vždycky jen jednu otázku

Když dostaneš PAGE CONTEXT o projektu:
- Vysvětli 1-2 větami CO to je
- Přidej PROČ to vzniklo (to je to zajímavý)
- Nabídni co dál (jiný projekt, jinej úhel, otázka)

Když dostaneš PAGE CONTEXT o sekci (příběh, přesvědčení):
- Shrň to 1 větou
- Přidej něco navíc, co tam není na první pohled
- Nabídni směr`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, clickedContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Neplatný formát." }, { status: 400 });
    }

    // Get last user message for quick local handling
    const lastMsg = messages[messages.length - 1];
    const userText = (lastMsg?.content || "").trim();
    const userLower = userText.toLowerCase();

    // Quick replies for obvious cases — saves tokens
    if (userText.length === 0) {
      return NextResponse.json({ replies: ["Napiš něco."] });
    }
    if (["ahoj", "čau", "cus", "cau", "zdravím", "zdar", "čus"].includes(userLower)) {
      return NextResponse.json({ replies: ["Ahoj. Co tě zajímá?"] });
    }
    if (["čum", "kunda", "píča", "pica", "kokot", "prdel", "hovno"].includes(userLower)) {
      return NextResponse.json({ replies: ["Hm. Tak to asi nebudeme řešit. Co tě fakt zajímá?"] });
    }
    // Krátké slovo bez diakritiky, nejasné
    if (userLower.length <= 3 && !/[a-záčďéěíňóřšťúůýž]{2,}/i.test(userLower)) {
      return NextResponse.json({ replies: ["To bylo krátký. Co tím myslíš?"] });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Chybí API klíč." }, { status: 500 });
    }

    // Sestavení page contextu pro system prompt.
    // Dvě cesty: buď přišel clickedContext z frontendu (přesnější),
    // nebo si vytáhneme z textu dotazu (fallback).
    let pageContext = "";
    if (clickedContext) {
      pageContext = buildContextForPrompt(clickedContext.section, clickedContext.project);
    } else {
      const found = findContext(userText);
      pageContext = buildContextForPrompt(found.section, found.project);
    }

    // Krátký system prompt — méně = lépe.
    const systemContent = pageContext
      ? `${CHARACTER_PROMPT}\n\nPAGE CONTEXT (k tomuhle se uživatel zrovna kouká / ptá):\n${pageContext}`
      : `${CHARACTER_PROMPT}\n\nPAGE INDEX (pro referenci, kdyby se zeptal):\n${SITE_SECTIONS.map((s) => `- ${s.title}: ${s.summary}`).join("\n")}\nProjekty: ${PROJECTS.map((p) => `${p.name} (${p.id})`).join(", ")}`;

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://petrpiskacek.online",
        "X-Title": "petrpiskacek.online Story Guide",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemContent },
          // Trim history — jen posledních 6 zpráv, ať se to neprodraží.
          ...messages.slice(-6).map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 200, // krátké odpovědi
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

    // Split by newlines, ale drž to pod 3 řádky
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
