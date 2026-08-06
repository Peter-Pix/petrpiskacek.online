// Site content index pro Echo — hlas stránky, ne průvodce.
// Mikro-otázky, ne romány. Krátké odpovědi, vždy.

export type Section = {
  id: string;
  title: string;
  kind: "hero" | "story" | "beliefs" | "projects" | "footer";
  summary: string;
  wow?: string;
  keywords: string[];
};

export type Project = {
  id: string;
  name: string;
  // Co je to (fakt, 1 věta)
  fact: string;
  // Proč to vzniklo (emocionální háček, 1 věta)
  why: string;
  // Wow moment (to nejlepší, 1 věta)
  wow: string;
  // Co dál (návaznost, 1 věta)
  next: string;
  // Plný popis (jen když user chce víc)
  detail: string;
  link: string | null;
  keywords: string[];
};

export const SITE_SECTIONS: Section[] = [
  {
    id: "hero",
    title: "Úvod",
    kind: "hero",
    summary: "Petr Piskáček. Ukazuje co s AI jde dělat, neprodává.",
    wow: "Programoval od dětství. Když přišlo GPT, zamiloval se.",
    keywords: ["úvod", "kdo", "úvodní"],
  },
  {
    id: "story",
    title: "Příběh",
    kind: "story",
    summary: "Jak se z kluka, co z ničeho dělal něco, stal člověk co se zamiloval do AI.",
    wow: "První den s GPT verzí, která se nepodobala ničemu dnešnímu. A on už věděl.",
    keywords: ["příběh", "historie", "jak začal", "minulost"],
  },
  {
    id: "beliefs",
    title: "Přesvědčení",
    kind: "beliefs",
    summary: "AI je nástroj. Neudělá to za tebe, udělá to co jí řekneš.",
    wow: "Rutinu strojům, kreativitu lidem. To je celý jeho manifest.",
    keywords: ["věří", "názor", "ai", "přesvědčení", "filozofie", "budoucnost"],
  },
  {
    id: "projects",
    title: "Projekty",
    kind: "projects",
    summary: "Šest live projektů. Každý má svůj důvod.",
    wow: "Každý projekt začal frustrací, ne nápadem.",
    keywords: ["projekty", "co postavil", "díla"],
  },
  {
    id: "ecosystem",
    title: "Ekosystém",
    kind: "hero",
    summary:
      "Tři domény: .cz je portfolio (kdo jsem), .online je příběh (proč to dělám), .cloud je AI playground (co jsem postavil — živé aplikace).",
    wow: "Tři propojené weby, sedm live aplikací, jeden hlas. Nikdo jiný v CZ to nemá.",
    keywords: ["ekosystém", "domény", "doména", "web", "portfolio", "cloud", "online", "petrpiskacek"],
  },
];

export const PROJECTS: Project[] = [
  // ── Live projekty z ekosystému (shodné s UI Projects.tsx) ──
  {
    id: "karel",
    name: "Karel Robot",
    fact: "AI e-mailovej administrátor. Pošleš mu e-mail a on ho analyzuje, roztřídí a napíše odpověď.",
    why: "Vznikl, protože Petra štvalo trávit hodiny nad mailama, který se daj zvládnout za vteřinu.",
    wow: "Rozpozná urgentní zprávy, faktury, newslettery a osobní poštu — a postará se o to, co není důležitý.",
    next: "Bude to víc autonomní — sám odpoví na rutinní věci, ne jen roztřídí.",
    detail:
      "Přesně ten typ práce, kterou nikdo nechce dělat — ale někdo musí. Karel se nikdy neunaví, nevyhoří a neřekne 'to není moje náplň'. Analyzuje, třídí a odpovídá na e-maily.",
    link: "https://karel.petrpiskacek.cloud",
    keywords: ["karel", "robot", "e-mail", "email", "administrátor", "třídění", "pošta"],
  },
  {
    id: "sparring",
    name: "Sparring",
    fact: "AI konzultant na projekty. Napíšeš nápad, on se doptá, nacení a navrhne stack.",
    why: "Vznikl z frustrace z prázdný stránky — nápad je pocit, ne plán.",
    wow: "Z pocitu tě dostane na konkrétní návrh s cenou a časovým plánem za pár vteřin.",
    next: "Čtyři bloky: jádro, stack, náklady, postup — rozšiřuje se o konkrétní implementace.",
    detail:
      "Od nápadu k plánu za pár minut. Konkrétní stack a cena bez vágních rad. Je to jako mít na pohovce AI mentora, kterej tě nenechá mlžit. Čtyři bloky: jádro, stack, náklady, postup.",
    link: "https://petrpiskacek.cloud/challenge",
    keywords: ["sparring", "konzultant", "projekt", "nápad", "plán", "nacení", "stack", "cena"],
  },
  {
    id: "flash-ui",
    name: "Flash UI",
    fact: "Generuje UI komponenty z promptu — napiš, co chceš, a nakreslí to v reálným čase.",
    why: "Ukázat, že design už není o tom umět klikat ve Figmě, ale vědět, co chceš.",
    wow: "Tlačítka, formuláře, karty, dashboardy — cokoliv z promptu za sekundu.",
    next: "Bude umět generovat kompletní stránky, ne jen komponenty.",
    detail:
      "Napiš, co chceš, a DeepSeek V4 Flash to nakreslí v reálným čase. Každý návrh vzniká live. Ušetří hodiny práce a ukazuje, že design je o vizi, ne o nástroji.",
    link: "https://petrpiskacek.cloud/flash-ui",
    keywords: ["flash", "ui", "design", "komponenty", "generování", "prompt", "frontend"],
  },
  {
    id: "4rap",
    name: "4RAP.CZ",
    fact: "Vědomostní graf české rapové scény. Kdo s kým, kdo kde, co kdy vyšlo.",
    why: "Česká scéna neměla web, kde bys zjistil, kdo je kdo.",
    wow: "1200+ entit a skoro 6000 vazeb. Petr říká, že je to k ničemu. A v tom je krása.",
    next: "Dotáhnout to, aby to bylo férový zdroj pro celou scénu, ne jen jeho hobby.",
    detail:
      "Shromažďuje ověřené informace a ukazuje propojení interpretů, alb, měst, žánrů. Chaos dostal řád. 1200+ entit, skoro 6000 vazeb. K ničemu — pokud nechceš vědět, kdo produkoval beat na desku, kterou nikdo neposlouchal.",
    link: "https://4rap.cz",
    keywords: ["4rap", "rap", "český rap", "rapu", "rapova", "rapová", "scéna", "hudba", "databáze", "interpret"],
  },
  {
    id: "docbot",
    name: "DocBot",
    fact: "AI právník na český smlouvy. Postaví NDA, nájemní nebo pracovní smlouvu podle českého práva.",
    why: "Vznikl, protože právníci jsou drahý a šablony z internetu jsou past.",
    wow: "Chatem tě provede krok za krokem a pak to zkontroluje na rizika.",
    next: "Rozšíření o další typy smluv a hlubší právní analýzu.",
    detail:
      "Žádné ruční vyplňování. Smlouvy snadno a rychle. Chat tě provede a výsledek zkontroluje na rizika. Kompromis, kterej ti nezlomí banku ani nervy.",
    link: "https://docbot.petrpiskacek.cloud",
    keywords: ["docbot", "právník", "právo", "smlouvy", "nda", "nájem", "pracovní", "smlouva"],
  },
  {
    id: "terminall",
    name: "Terminall",
    fact: "Trénink příkazovýho řádku. Uč se Linux, macOS a Windows příkazy v bezpečným terminálu.",
    why: "Vznikl, protože nejlepší způsob, jak se naučit terminál, je v něm chybovat — ale v bezpečí.",
    wow: "Dělej chyby a AI učitel ti je vysvětlí. Lekce s příběhem.",
    next: "Víc lekcí a pokročilé scénáře pro reálné sysadmin úkoly.",
    detail:
      "Učitel opravuje chyby a napovídá. Lekce s příběhem. Nejlepší způsob, jak se naučit terminál, je v něm chybovat — tady je to povolený a ještě z toho něco máš.",
    link: "https://terminall.petrpiskacek.cloud",
    keywords: ["terminall", "terminál", "příkazová", "řádka", "linux", "macos", "windows", "trénink", "učení"],
  },
  // ── Osobní experimenty (mimo hlavní UI, ale Echo o nich umí odpovědět) ──
  {
    id: "vocalbrain",
    name: "VocalBrain",
    fact: "Brainstorming o projektu nahlas — AI to celé naplánuje.",
    why: "Vznikl z frustrace: psát poznámky ručně je otrava.",
    wow: "Druhej den pozná, že mluvíš o tom samým projektu, a přidá k němu.",
    next: "Píše se o tom, že to bude umět i rozhodovat, ne jen plánovat.",
    detail:
      "Audio transkripce + AI. Mluvíš o projektu, systém to přepíše, strukturalizuje, udělá to-do listy. Druhý den pozná, že jde o ten samý projekt, a přidá nové informace.",
    link: null,
    keywords: ["vocalbrain", "audio", "brainstorming", "přepis", "hlas"],
  },
  {
    id: "stylemorph",
    name: "StyleMorph",
    fact: "Starý web → moderní web, během chviličky.",
    why: "Malé firmy platí tisíce za redesign, což Petra štvalo.",
    wow: "Řekneš mu styl, ono to předělá v reálném čase a můžeš si to stáhnout.",
    next: "Mělo by umět i generovat kompletní weby od nuly, ne jen předělávat.",
    detail:
      "Řekneš mu, jaký styl se ti líbí. V reálném čase předělá stránky, který si můžeš stáhnout. Ušetří hodiny, dny, možná týdny.",
    link: null,
    keywords: ["stylemorph", "web", "design", "předělání", "restyling"],
  },
  {
    id: "autoblog",
    name: "AutoBlog Publisher",
    fact: "Web, který se sám píše, kontroluje a publikuje.",
    why: "Petr to chtěl zkusit už léta. Chyběla mu technologická základna.",
    wow: "Zvolíš téma, on sám zjistí co lidi aktuálně zajímá, a napíše o tom článek.",
    next: "Cíl je, aby o tom člověk vůbec nevěděl — web jede sám, organicky roste.",
    detail:
      "Zvolíš téma, AI dohledá co lidi aktuálně zajímá, vyhledá informace, napíše články, zkontroluje je, vylepší, nasdílí online. Celý web se buduje a rozvíjí sám.",
    link: null,
    keywords: ["autoblog", "blog", "automatizace", "publikování", "obsah"],
  },
  {
    id: "scrollo",
    name: "Scrollo.cz",
    fact: "Jednoduché nástroje. Bez reklam. Vše v prohlížeči.",
    why: "Naštval se, že všechny free nástroje jsou zaplavené reklamami a nefungují.",
    wow: "Všechno běží v prohlížeči. Žádná databáze, žádný tracking, žádná reklama.",
    next: "Chce tam přidávat nástroje, co sám potřebuje. Pomalu, jak je potřebuje.",
    detail:
      "Side projekt. Nástroje, které sám používá. Plně privátní — neukládají data, vše běží v prohlížeči. Žádné reklamy, zcela zdarma.",
    link: "https://scrollo.cz",
    keywords: ["scrollo", "nástroje", "utilities", "soukromí", "bez reklam"],
  },
];

// Mikro-otázky podle kontextu. Krátké, konkrétní, zvědavé.
export function suggestionsForContext(
  section?: Section,
  project?: Project,
): { id: string; text: string; type: "fact" | "why" | "wow" | "next" }[] {
  if (project) {
    return [
      { id: `${project.id}-fact`, text: `Co to je?`, type: "fact" },
      { id: `${project.id}-why`, text: `Proč to vzniklo?`, type: "why" },
      { id: `${project.id}-wow`, text: `Co je na tom nejlepší?`, type: "wow" },
      { id: `${project.id}-next`, text: `Co bude dál?`, type: "next" },
    ];
  }
  if (section) {
    return [
      { id: `${section.id}-wow`, text: `Co je na tom nejzajímavější?`, type: "wow" },
      { id: `${section.id}-why`, text: `Proč tohle vůbec existuje?`, type: "why" },
      { id: `${section.id}-next`, text: `Co dalšího bych měl vědět?`, type: "next" },
    ];
  }
  return [
    { id: "default-petr", text: `Kdo je Petr?`, type: "wow" },
    { id: "default-ai", text: `Co si myslí o AI?`, type: "wow" },
    { id: "default-projects", text: `Jaké projekty postavil?`, type: "wow" },
  ];
}

// Klíčová slova pro klasifikaci typu otázky.
const TYPE_PATTERNS: { type: QuestionType; patterns: RegExp[] }[] = [
  { type: "why", patterns: [/proč/i, /jakej důvod/i, /jak to vzniklo/i] },
  { type: "how", patterns: [/jak (to |funguje|se|dělá)/i, /^jak\b/i] },
  { type: "fact", patterns: [/^(co|kdo|kdy|kde|kolik)\b/i, /^\b(co|kdo|kdy)\b/i] },
  { type: "next", patterns: [/co dál/i, /co bude/i, /plány?/i, /budoucnost/i] },
  { type: "wow", patterns: [/wow/i, /nejlepší/i, /nejoblíbenější/i, /fakt? cool/i] },
];

export type QuestionType = "fact" | "why" | "how" | "wow" | "next";

// Jednoduchá heuristika pro klasifikaci typu otázky.
export function classifyQuestion(query: string): QuestionType {
  const q = query.toLowerCase().trim();
  if (!q) return "wow";
  for (const { type, patterns } of TYPE_PATTERNS) {
    for (const p of patterns) {
      if (p.test(q)) return type;
    }
  }
  return "wow";
}

// Najde kontext podle textu dotazu.
// ── Fuzzy context matching ──────────────────────────────────────
// Hledá napříč VŠEMI poli projektu/sekce (ne jen keywords), aby Echo
// našel kontext i pro dotazy, které nepoužívají přesné klíčové slovo.

// Tokenizace: malá písmena, odstraní diakritiku a interpunkci, rozdělí na slova.
// Ignoruje stop-slova (běžná česká slova bez identifikační hodnoty), aby
// nedošlo k falešným shodám (např. "žádný" by nemělo shodit na scrollo).
const STOP_WORDS = new Set([
  "aby", "ale", "asi", "atd", "bez", "bud", "bude", "bylo", "byt", "co",
  "cely", "cesky", "dalsi", "dela", "delat", "den", "dnes", "dva", "ho",
  "hodne", "jak", "jako", "jaky", "jen", "jeho", "jeste", "jiny", "jsi",
  "jsou", "kdyz", "ktery", "kte", "ma", "me", "mezi", "mi", "mit", "moc",
  "muze", "muzes", "na", "nebo", "nekdo", "neco", "nemu", "neni", "nez",
  "nic", "nove", "od", "podle", "podle", "prave", "pres", "pro", "protoze",
  "sam", "sami", "se", "si", "tak", "take", "taky", "ten", "te", "tim",
  "to", "tom", "tomas", "tu", "uz", "vse", "vsechny", "zadna", "zadny",
  "zda", "zkusit", "zvolis", "aby", "ale", "asi", "bez", "ceho", "dva",
  "jak", "jako", "kdo", "kdy", "kde", "kdyz", "ktery", "proc", "z", "s",
  "web", "weby", "stranky", "stranka", "projekt", "projekty", "funguje",
  "fungovat", "dela", "delat", "prace", "veci", "veci", "tak", "nejaky",
  "mluvit", "mluvis", "mluvi", "mluvime", "petr", "petra", "piskacek",
  "povidej", "rekni", "vysvetli", "zajima", "zajimave",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // odstraní diakritiku
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w)); // stop-slova pryč
}

// Vrátí, kolik tokenů dotazu se objevilo v textu (fuzzy overlap).
function countOverlap(queryTokens: string[], text: string): number {
  const textTokens = tokenize(text);
  let score = 0;
  for (const q of queryTokens) {
    for (const t of textTokens) {
      // Přesná shoda tokenu.
      if (t === q) {
        score += 1;
        break;
      }
      // Fuzzy shoda přes společný prefix (stemming-lite):
      // - oba ≥ 4 znaky
      // - sdílejí společný začátek ≥ 4 znaků
      // - délky se liší maximálně o 3 (jsou to tvary stejného slova)
      let shared = 0;
      const max = Math.min(q.length, t.length);
      while (shared < max && q[shared] === t[shared]) shared++;
      if (
        q.length >= 4 &&
        t.length >= 4 &&
        shared >= 4 &&
        Math.abs(q.length - t.length) <= 3
      ) {
        score += 1;
        break;
      }
    }
  }
  return score;
}

// Všechna prohledávaná pole projektu — řazená podle důležitosti.
function projectSearchText(p: Project): string {
  return [p.name, p.fact, p.why, p.wow, p.next, p.detail, ...p.keywords].join(" ");
}

function sectionSearchText(s: Section): string {
  return [s.title, s.summary, s.wow || "", ...s.keywords].join(" ");
}

export function findContext(
  query: string,
): { section?: Section; project?: Project } {
  const q = query.toLowerCase().trim();
  if (!q) return {};

  // Přesná shoda na id nebo jméno projektu — nejvyšší priorita.
  for (const p of PROJECTS) {
    if (q.includes(p.id) || q.includes(p.name.toLowerCase())) {
      return { project: p };
    }
  }

  // Přesná shoda na id nebo title sekce (např. "ekosystém", "příběh").
  for (const s of SITE_SECTIONS) {
    if (q.includes(s.id) || q.includes(s.title.toLowerCase())) {
      return { section: s };
    }
  }

  const qTokens = tokenize(q);
  if (qTokens.length === 0) return {};

  let bestProject: Project | undefined;
  let bestProjectScore = 0;
  for (const p of PROJECTS) {
    const score = countOverlap(qTokens, projectSearchText(p));
    if (score > bestProjectScore) {
      bestProjectScore = score;
      bestProject = p;
    }
  }

  let bestSection: Section | undefined;
  let bestSectionScore = 0;
  for (const s of SITE_SECTIONS) {
    const score = countOverlap(qTokens, sectionSearchText(s));
    if (score > bestSectionScore) {
      bestSectionScore = score;
      bestSection = s;
    }
  }

  // Projekt má přednost — dotaz na konkrétní věc je spíš o projektu než o sekci.
  // Při rovnosti skóre vyhrává projekt.
  if (bestProjectScore >= 1 && bestProjectScore >= bestSectionScore) {
    return { project: bestProject };
  }
  // Sekce: stačí 1 shoda (přesné klíčové slovo jako "domény", "cloud", "ekosystém").
  if (bestSectionScore >= 1) {
    return { section: bestSection };
  }
  if (bestProjectScore >= 1) {
    return { project: bestProject };
  }

  return {};
}

// Prompt direktiva podle typu otázky.
export function typeDirective(type: QuestionType): string {
  switch (type) {
    case "fact":
      return "Fakt (1 věta, konkrétní, žádný obecný fráze)";
    case "why":
      return "Proč (2 věty — důvod + emocionální háček, ne vysvětlování)";
    case "how":
      return "Jak (1-2 věty, lidsky, ne pseudotechnický detail)";
    case "wow":
      return "Wow (1 věta, silná, s vtipem nebo překvapením)";
    case "next":
      return "Co dál (1 věta, naznač, ne slibuj)";
  }
}

// Sestaví kontextový blok pro API prompt — max ~500 tokenů.
export function buildContextForPrompt(
  section?: Section,
  project?: Project,
): string {
  const parts: string[] = [];
  if (project) {
    parts.push(
      `Projekt: ${project.name}\nCo to je: ${project.fact}\nProč to vzniklo: ${project.why}\nWow: ${project.wow}\nCo dál: ${project.next}\nDetail: ${project.detail}`,
    );
  }
  if (section) {
    parts.push(`Sekce: ${section.title}\nO čem: ${section.summary}${section.wow ? `\nWow: ${section.wow}` : ""}`);
  }
  return parts.join("\n\n");
}

// Statická odpověď pro suggestion tlačítka (žádný API call).
export function staticAnswer(
  type: QuestionType,
  project?: Project,
  section?: Section,
): string {
  if (project) {
    switch (type) {
      case "fact":
        return project.fact;
      case "why":
        return project.why;
      case "wow":
        return project.wow;
      case "next":
        return project.next;
      case "how":
        return project.detail.split(".").slice(0, 2).join(".") + ".";
    }
  }
  if (section) {
    switch (type) {
      case "wow":
        return section.wow || section.summary;
      case "why":
        return section.summary;
      case "next":
        return `V další sekci se dozvíš víc.`;
      case "fact":
        return section.summary;
      case "how":
        return section.summary;
    }
  }
  return "Zajímavá otázka. Co tě na tom nejvíc zajímá?";
}
