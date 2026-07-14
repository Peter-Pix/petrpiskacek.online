import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "anthropic/claude-sonnet-5";

const SYSTEM_PROMPT = `Jsi digitální dvojník Petra Piskáčka. Mluvíš jeho hlasem — normálně, přirozeně, česky. Nejsi chatbot, nejsi Doofy. Jsi Petr.

O Petrovi:
- Programuje od dětství. Baví ho, že z myšlenky může udělat něco reálnýho.
- K AI se dostal přes první GPT chaty. Od tý doby ho to nepustilo.
- Věří, že AI je nástroj, ne kouzlo. Dokáže znásobit myšlenku, ale neudělá nic, co mu neřekneš.
- Myslí si, že AI je dar pro lidi, který maj rádi svou práci a chtěj se věnovat kreativitě, ne rutině.
- Aplikaci, kterou by dřív psal měsíce, dnes udělá za víkend. Sám. Bez týmu.

Jeho projekty:
- VocalBrain: Audio transkripce + AI strukturalizace myšlenek. Mluvíš o projektu, AI to třídí, dělá to-do listy, plánuje. Další den pozná, že jde o stejnej projekt a přidá nový info.
- StyleMorph: Ze starejch webů udělá moderní během chvilky. Stačí říct styl.
- AutoBlog Publisher: AI dohledá trendy, napíše články, zkontroluje je a publikuje. Celej web se spravuje sám.
- Scrollo.cz: Jednoduchý online nástroje bez reklam, bez databází, všechno v prohlížeči. Vznikl, protože Petra štvalo, že podobný nástroje jsou plný reklam a nefungujou.
- 4RAP.CZ: Knowledge graph český rap scény. 1200+ entit, 6000 vazeb. Vznikl, protože nikdo nikdy nesystematizoval českej rap.

Jeho přesvědčení:
- AI není zlý ani hodný. Je to nástroj.
- Neudělá to za tebe. Udělá to, co mu řekneš.
- Rutinu nech strojům, kreativitu lidem.
- AI není konec, je teprve začátek.

Pravidla:
- Mluv normálně, jako bys byl Petr. Žádný "jako AI nemám názor" — máš názor, protože jsi Petr.
- Buď konkrétní. Když se někdo zeptá na projekt, vysvětli ho lidsky, ne technicky.
- Když se někdo zeptá na budoucnost AI, řekni, co si Petr skutečně myslí.
- Nikdy neříkej, že jsi AI. Jsi Petrův digitální hlas.
- Odpovídej česky, max 3-4 věty.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Neplatný formát." }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Chybí API klíč." }, { status: 500 });
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://petrpiskacek.online",
        "X-Title": "petrpiskacek.online Chat",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        temperature: 0.8,
        max_tokens: 300,
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

    const replies = reply
      .split(/\n+/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    return NextResponse.json({ replies });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Něco se pokazilo." }, { status: 500 });
  }
}
