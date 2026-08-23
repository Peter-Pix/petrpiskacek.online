import fs from "fs";
import path from "path";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  readTime: string;
  featured?: boolean;
}

export interface PostData extends PostMeta {
  content: string;
  nextPost?: string;
}

const POSTS_DIR = path.join(process.cwd(), "src/app/blog/posts");

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
      return {
        slug,
        title: fm.title || slug,
        date: fm.date || "2000-01-01",
        description: fm.description || "",
        readTime: fm.readTime || calcReadTime(raw),
        featured: fm.featured === "true",
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
