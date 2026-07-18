// Site content index for the "Story Guide" chatbot.
// Malý, strukturovaný dataset — chatbot k němu přistupuje podle kontextu kliknutí.

export type Section = {
  id: string;
  title: string;
  kind: "hero" | "story" | "beliefs" | "projects" | "footer";
  summary: string; // 1-2 věty, co ta sekce říká
  keywords: string[]; // pro matching dotazů
};

export type Project = {
  id: string;
  name: string;
  oneLiner: string; // 1 věta, wow
  why: string; // 1-2 věty, proč ten projekt existuje
  description: string; // plný popis (kratší verze)
  link: string | null;
  keywords: string[];
};

export const SITE_SECTIONS: Section[] = [
  {
    id: "hero",
    title: "Hero",
    kind: "hero",
    summary:
      "Petr Piskáček. Programování od dětství, AI od prvního GPT. Ukazuje co s ní jde dělat, neprodává.",
    keywords: ["úvod", "kdo", "o něm", "úvodní"],
  },
  {
    id: "story",
    title: "Příběh",
    kind: "story",
    summary:
      "Jak se z kluka, co z ničeho dělal něco, stal člověk, co se zamiloval do AI. První den s GPT, cesta k vlastním projektům.",
    keywords: ["příběh", "jak začal", "historie", "minulost"],
  },
  {
    id: "beliefs",
    title: "Přesvědčení",
    kind: "beliefs",
    summary:
      "AI je nástroj jako kladívko. Neudělá to za tebe, udělá to co jí řekneš. Rutinu strojům, kreativitu lidem.",
    keywords: [
      "věří",
      "názor",
      "ai",
      "přesvědčení",
      "filozofie",
      "budoucnost",
      "nástroj",
    ],
  },
  {
    id: "projects",
    title: "Projekty",
    kind: "projects",
    summary:
      "Pět projektů, každý má svůj důvod. VocalBrain, StyleMorph, AutoBlog, Scrollo, 4RAP.",
    keywords: ["projekty", "co postavil", "díla", "výtvory"],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "vocalbrain",
    name: "VocalBrain",
    oneLiner: "Brainstorming o projektu nahlas — AI to celé naplánuje.",
    why:
      "Vznikl z frustrace: psát poznámky ručně je otrava. Petr chtěl mluvit a mít z toho strukturovaný plán.",
    description:
      "Audio transkripce + AI. Mluvíš o projektu, systém to přepíše, strukturalizuje, udělá to-do listy. Druhý den pozná, že jde o ten samý projekt, a přidá nové informace.",
    link: null,
    keywords: ["vocalbrain", "audio", "brainstorming", "přepis", "hlas"],
  },
  {
    id: "stylemorph",
    name: "StyleMorph",
    oneLiner: "Starý web → moderní web, během chviličky.",
    why:
      "Malé firmy platí tisíce za redesign. Petr chtěl nástroj, kterej to udělá za zlomek času a nákladů.",
    description:
      "Řekneš mu, jaký styl se ti líbí. V reálném čase předělá stránky, který si můžeš stáhnout. Ušetří hodiny, dny, možná týdny.",
    link: null,
    keywords: ["stylemorph", "web", "design", "předělání", "restyling"],
  },
  {
    id: "autoblog",
    name: "AutoBlog Publisher",
    oneLiner: "Web, který se sám píše, sám kontroluje, sám publikuje.",
    why:
      "Petr to chtěl zkusit už léta, ale chyběla mu technologická základna. Teď ji má.",
    description:
      "Zvolíš téma, AI dohledá co lidi aktuálně zajímá, vyhledá informace, napíše články, zkontroluje je, vylepší, nasdílí online. Celý web se buduje a rozvíjí sám.",
    link: null,
    keywords: [
      "autoblog",
      "blog",
      "automatizace",
      "publikování",
      "obsah",
      "seo",
    ],
  },
  {
    id: "scrollo",
    name: "Scrollo.cz",
    oneLiner: "Jednoduché nástroje. Bez reklam. Bez otravování. Vše v prohlížeči.",
    why:
      "Naštval se, že všechny free nástroje na internetu jsou zaplavené reklamami a stejně nefungují.",
    description:
      "Side projekt. Nástroje, které sám používá. Plně privátní — neukládají data, vše běží v prohlížeči. Žádné reklamy, zcela zdarma.",
    link: "https://scrollo.cz",
    keywords: ["scrollo", "nástroje", "utilities", "soukromí", "bez reklam"],
  },
  {
    id: "4rap",
    name: "4RAP.CZ",
    oneLiner: "Databáze českýho rapu. Kdo s kým, kdo co, odkud.",
    why:
      "Česká scéna neměla centralizovaný web, kde by se člověk dozvěděl, kdo je kdo. Petr to napravil.",
    description:
      "Shromažďuje ověřené informace, ukazuje propojení interpretů, alb, měst, žánrů. 1200+ entit, skoro 6000 vazeb. Petr říká, že je to k ničemu. A právě v tom je krása.",
    link: "https://4rap.cz",
    keywords: ["4rap", "rap", "český rap", "hudba", "databáze", "graf"],
  },
];

// Najde nejrelevantnější sekci/projekt podle textu dotazu.
// Jednoduchý keyword match — žádný embedding, žádný vector store. Rychlé a levné.
export function findContext(
  query: string,
): { section?: Section; project?: Project } {
  const q = query.toLowerCase().trim();
  if (!q) return {};

  // Přesná shoda projektu
  for (const p of PROJECTS) {
    if (q.includes(p.id) || p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase())) {
      return { project: p };
    }
  }

  // Keyword match na projekty
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

  // Keyword match na sekce
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

// Vrátí context pro API prompt — max ~500 tokenů.
export function buildContextForPrompt(
  section?: Section,
  project?: Project,
): string {
  const parts: string[] = [];
  if (project) {
    parts.push(
      `Projekt: ${project.name}\nCo to je: ${project.oneLiner}\nProč to vzniklo: ${project.why}\nDetail: ${project.description}`,
    );
  }
  if (section) {
    parts.push(`Sekce: ${section.title}\nO čem: ${section.summary}`);
  }
  return parts.join("\n\n");
}
