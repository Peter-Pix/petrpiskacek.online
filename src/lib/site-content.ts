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
    summary: "Pět projektů. Každý má svůj důvod.",
    wow: "Každý projekt začal frustrací, ne nápadem.",
    keywords: ["projekty", "co postavil", "díla"],
  },
];

export const PROJECTS: Project[] = [
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
  {
    id: "4rap",
    name: "4RAP.CZ",
    fact: "Databáze českýho rapu. Kdo s kým, kdo co, odkud.",
    why: "Česká scéna neměla web, kde bys zjistil, kdo je kdo.",
    wow: "Přes 1200 interpretů a skoro 6000 vazeb mezi nimi. Petr říká, že je to k ničemu. A v tom je krása.",
    next: "Chce to dotáhnout k tomu, aby to bylo férový zdroj pro celou scénu, ne jen jeho hobby.",
    detail:
      "Shromažďuje ověřené informace, ukazuje propojení interpretů, alb, měst, žánrů. 1200+ entit, skoro 6000 vazeb. Petr říká, že je to k ničemu. A právě v tom je krása.",
    link: "https://4rap.cz",
    keywords: ["4rap", "rap", "český rap", "hudba", "databáze"],
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
export function findContext(
  query: string,
): { section?: Section; project?: Project } {
  const q = query.toLowerCase().trim();
  if (!q) return {};

  for (const p of PROJECTS) {
    if (q.includes(p.id) || p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase())) {
      return { project: p };
    }
  }

  let bestProject: Project | undefined;
  let bestProjectScore = 0;
  for (const p of PROJECTS) {
    let score = 0;
    for (const kw of p.keywords) {
      if (q.includes(kw)) score += 2;
    }
    if (score > bestProjectScore) {
      bestProjectScore = score;
      bestProject = p;
    }
  }

  let bestSection: Section | undefined;
  let bestSectionScore = 0;
  for (const s of SITE_SECTIONS) {
    let score = 0;
    for (const kw of s.keywords) {
      if (q.includes(kw)) score += 1;
    }
    if (score > bestSectionScore) {
      bestSectionScore = score;
      bestSection = s;
    }
  }

  return {
    section: bestSectionScore > 0 ? bestSection : undefined,
    project: bestProjectScore > 0 ? bestProject : undefined,
  };
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
