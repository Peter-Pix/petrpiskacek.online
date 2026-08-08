import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";

interface PostData {
  title: string;
  date: string;
  description: string;
  content: string;
  nextPost?: string;
}

function getPost(slug: string): PostData | null {
  const filePath = path.join(process.cwd(), "src/app/blog/posts", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const frontmatter: Record<string, string> = {};
  const lines = match[1].split("\n");
  for (const line of lines) {
    const sep = line.indexOf(": ");
    if (sep > 0) {
      const key = line.slice(0, sep).trim();
      const val = line.slice(sep + 2).trim().replace(/^"(.*)"$/, "$1");
      frontmatter[key] = val;
    }
  }

  return {
    title: frontmatter.title || slug,
    date: frontmatter.date || "2000-01-01",
    description: frontmatter.description || "",
    content: match[2].trim(),
    nextPost: frontmatter.nextPost,
  };
}

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "src/app/blog/posts");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));
  return files.map((f) => ({ slug: f.replace(/\.mdx$/, "") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Petr Piskacek`,
    description: post.description,
    openGraph: {
      title: `${post.title} — Petr Piskacek`,
      description: post.description,
      url: `https://petrpiskacek.online/blog/${slug}`,
      siteName: "Petr Piskacek",
      locale: "cs_CZ",
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — Petr Piskacek`,
      description: post.description,
    },
  };
}

function getNextPost(slug: string): { slug: string; title: string; description: string } | null {
  const filePath = path.join(process.cwd(), "src/app/blog/posts", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  const frontmatter: Record<string, string> = {};
  const lines = match[1].split("\n");
  for (const line of lines) {
    const sep = line.indexOf(": ");
    if (sep > 0) {
      const key = line.slice(0, sep).trim();
      const val = line.slice(sep + 2).trim().replace(/^"(.*)"$/, "$1");
      frontmatter[key] = val;
    }
  }
  return {
    slug,
    title: frontmatter.title || slug,
    description: frontmatter.description || "",
  };
}

function renderMdx(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("---")) {
      return <hr key={i} className="border-none h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent my-12" />;
    }
    if (line.startsWith("> ")) {
      return (
        <blockquote key={i} className="border-l-2 border-[var(--gold)] pl-5 py-1 my-8 text-[var(--text)] text-lg italic leading-relaxed">
          {line.replace(/^> /, "")}
        </blockquote>
      );
    }
    if (line.startsWith("## ")) {
      return <h2 key={i} className="text-xl font-semibold text-[var(--text)] mt-10 mb-4">{line.replace(/^## /, "")}</h2>;
    }
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-semibold text-[var(--text)] text-lg">{line.replace(/\*\*/g, "")}</p>;
    }
    if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
      return <p key={i} className="italic text-[var(--text-muted)]">{line.replace(/\*/g, "")}</p>;
    }
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      let j = i + 1;
      while (j < lines.length && !lines[j].startsWith("```")) {
        codeLines.push(lines[j]);
        j++;
      }
      if (codeLines.length > 0) {
        return (
          <pre key={i} className="bg-zinc-900 text-zinc-200 rounded-lg p-4 my-6 overflow-x-auto text-sm font-mono leading-relaxed">
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
      }
      return null;
    }
    if (line === "") return null;
    return <p key={i} className="text-[var(--text-secondary)]">{line}</p>;
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return (
      <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <div className="container-read mx-auto px-6 py-24">
          <Link href="/blog" className="text-sm text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">
            ← Blog
          </Link>
          <h1 className="mt-8 text-2xl font-bold">Článek nenalezen</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <article className="container-read mx-auto px-6 py-24">
        <Link href="/blog" className="text-sm text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">
          ← Blog
        </Link>
        <h1 className="mt-8 text-[2.5rem] font-bold tracking-tight leading-[1.1] max-sm:text-[2rem]">{post.title}</h1>
        <time dateTime={post.date} className="mt-3 block text-sm text-[var(--text-muted)]">{post.date}</time>

        <div className="mt-12 space-y-6 text-[1.0625rem] leading-relaxed text-[var(--text-secondary)] max-sm:text-[1rem]">
          {renderMdx(post.content)}
        </div>

        {post.nextPost && (() => {
          const next = getNextPost(post.nextPost);
          if (!next) return null;
          return (
            <section className="mt-16 rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-amber-500">Další článek</p>
              <Link href={`/blog/${next.slug}`} className="group mt-2 block">
                <h2 className="text-lg font-semibold group-hover:text-amber-500 transition-colors">{next.title}</h2>
                <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{next.description}</p>
              </Link>
            </section>
          );
        })()}
      </article>
    </main>
  );
}
