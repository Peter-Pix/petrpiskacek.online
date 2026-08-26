import fs from "fs";
import path from "path";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  readTime: string;
  featured?: boolean;
  category?: string;
}

export interface PostData extends PostMeta {
  content: string;
  nextPost?: string;
}

export interface BlogCategory {
  id: string;
  label: string;
  tagline: string;
}

const POSTS_DIR = path.join(process.cwd(), "src/app/blog/posts");

/**
 * Kategorie blogu — pořadí v poli = pořadí na stránce.
 * Každá kategorie má label (nadpis) a tagline (krátký podtitul).
 */
export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: "agenti-automatizace",
    label: "Agenti & Automatizace",
    tagline: "Nechat stroje dělat práci.",
  },
  {
    id: "mluveni-s-ai",
    label: "Jak mluvit s AI",
    tagline: "Prompt je dialog, ne příkaz.",
  },
  {
    id: "mysleni",
    label: "Přemýšlení & Mindset",
    tagline: "Nástroj je v hlavě, ne v ruce.",
  },
  {
    id: "technologie-spolecnost",
    label: "Technologie & Společnost",
    tagline: "AI dělá s námi, ne pro nás.",
  },
  {
    id: "zivot-tvorba",
    label: "Život & Tvorba",
    tagline: "Proč tvořit, když žijeme.",
  },
];

/**
 * Mapování slug → kategorie.
 * Každý článek patří přesně do jedné kategorie (vícenásobné by rozbilo přehlednost).
 */
const SLUG_TO_CATEGORY: Record<string, string> = {
  // Agenti & Automatizace
  "kdo-nevidel-neuveri": "agenti-automatizace",
  "automatizace-co-setri": "agenti-automatizace",
  "proc-mam-tolik-projektu": "agenti-automatizace",
  "ukaz-mi-tlacitko-schovej-tovarnu": "agenti-automatizace",
  "labuti-jezero": "agenti-automatizace",

  // Jak mluvit s AI
  "mluvime-s-kladivem": "mluveni-s-ai",
  "nenadavam-protoze-me-to-bavi": "mluveni-s-ai",
  "parak-kterej-nezavidi": "mluveni-s-ai",
  "ai-je-trochu-jako-sexy-holka": "mluveni-s-ai",

  // Přemýšlení & Mindset
  "obcas-je-dobry-mit-spatnej-napad": "mysleni",
  "vyjimecni-obycejnaci": "mysleni",
  "rozkosne-nedokonalosti": "mysleni",
  "bojime-se-toho-co-nechapeme": "mysleni",

  // Technologie & Společnost
  "ai-neni-prirozena": "technologie-spolecnost",
  "proc-nas-to-stve": "technologie-spolecnost",
  "gemma-je-zdarma": "technologie-spolecnost",
  "sny-jsou-kod": "technologie-spolecnost",
  "prekvapeny-lektor": "technologie-spolecnost",
  "zavri-hubu-nebo-otevru-terminal": "technologie-spolecnost",

  // Život & Tvorba
  "dar-pro-ty-co-zivot-milujou": "zivot-tvorba",
  "legendario": "zivot-tvorba",
  "proc-to-nedelaji-vsichni": "zivot-tvorba",
};

export function getCategoryForSlug(slug: string): BlogCategory | undefined {
  const catId = SLUG_TO_CATEGORY[slug];
  return BLOG_CATEGORIES.find((c) => c.id === catId);
}

/** Vrátí kategorie s přiřazenými posty (jen ty, které mají aspoň 1 článek). */
export function getBlogSections(posts: PostMeta[]): Array<{ category: BlogCategory; posts: PostMeta[] }> {
  return BLOG_CATEGORIES.map((category) => ({
    category,
    posts: posts.filter((p) => getCategoryForSlug(p.slug)?.id === category.id),
  })).filter((s) => s.posts.length > 0);
}

/**
 * Parsuje YAML-like frontmatter z MDX souboru.
 * Jednoduchý parser — klíč: hodnota na řádku, hodnota v uvozovkách se stripne.
 */
export function parseFrontmatter(raw: string): Record<string, string> {
  const frontmatter: Record<string, string> = {};
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return frontmatter;

  for (const line of match[1].split("\n")) {
    const sep = line.indexOf(": ");
    if (sep > 0) {
      const key = line.slice(0, sep).trim();
      const val = line.slice(sep + 2).trim().replace(/^"(.*)"$/, "$1");
      frontmatter[key] = val;
    }
  }
  return frontmatter;
}

/** Rozdělí MDX na frontmatter + obsah. */
export function splitFrontmatter(raw: string): { frontmatter: Record<string, string>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content: raw };
  return { frontmatter: parseFrontmatter(raw), content: match[2].trim() };
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

const WORDS_PER_MINUTE = 200;

/** Spočítá readTime z obsahu (slova / 200), zaokrouhleno nahoru. */
export function calcReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return `${minutes} min`;
}

/** Vrátí metadata všech postů, seřazené od nejnovějšího. */
export function getAllPosts(): PostMeta[] {
  return getAllSlugs()
    .map((slug) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), "utf-8");
      const fm = parseFrontmatter(raw);
      const category = getCategoryForSlug(slug);
      return {
        slug,
        title: fm.title || slug,
        date: fm.date || "2000-01-01",
        description: fm.description || "",
        readTime: fm.readTime || calcReadTime(raw),
        featured: fm.featured === "true",
        category: category?.id,
      } satisfies PostMeta;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Vrátí plný post (metadata + obsah). */
export function getPost(slug: string): PostData | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { frontmatter, content } = splitFrontmatter(raw);
  if (!content) return null;

  return {
    slug,
    title: frontmatter.title || slug,
    date: frontmatter.date || "2000-01-01",
    description: frontmatter.description || "",
    readTime: frontmatter.readTime || calcReadTime(content),
    featured: frontmatter.featured === "true",
    content,
    nextPost: frontmatter.nextPost,
  };
}
