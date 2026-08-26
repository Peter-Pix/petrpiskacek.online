import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getBlogSections, BLOG_CATEGORIES, type PostMeta } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — Petr Piskacek",
  description: "Myšlenky o AI, programování, životě a všem mezi tím.",
  openGraph: {
    title: "Blog — Petr Piskacek",
    description: "Myšlenky o AI, programování, životě a všem mezi tím.",
    url: "https://petrpiskacek.online/blog",
    siteName: "Petr Piskacek",
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Petr Piskacek",
    description: "Myšlenky o AI, programování, životě a všem mezi tím.",
  },
};

const posts = getAllPosts();
const totalMinutes = posts.reduce((sum, p) => sum + parseInt(p.readTime), 0);
const sections = getBlogSections(posts);

function getFeaturedPost(posts: PostMeta[]): PostMeta | null {
  const featured = posts.filter((p) => p.featured);
  if (featured.length === 0) return null;
  const dayIndex = Math.floor(Date.now() / 86_400_000) % featured.length;
  return featured[dayIndex];
}

const featuredPost = getFeaturedPost(posts);

/** Jedna karta článku — horizontálně scrollovatelná, Apple glass styl. */
function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="glass card-hover group flex w-[78vw] max-w-[340px] shrink-0 snap-start flex-col justify-between rounded-2xl p-6 max-sm:w-[82vw]"
      aria-label={post.title}
    >
      <div>
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
          <time dateTime={post.date}>{post.date}</time>
          <span className="text-[var(--border)]">·</span>
          <span>{post.readTime}</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold leading-snug text-[var(--text)] transition-colors duration-300 group-hover:text-[var(--gold)]">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          {post.description}
        </p>
      </div>
      <div className="mt-6 flex items-center gap-1 text-sm font-medium text-[var(--gold)]">
        Číst
        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

/** Horizontálně scrollovatelný pás karet. */
function CardRail({ posts }: { posts: PostMeta[] }) {
  return (
    <div className="mt-10 -mx-6 overflow-x-auto px-6 pb-6 scrollbar-thin sm:-mx-8 sm:px-8">
      <div className="flex snap-x snap-mandatory gap-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
        {/* Spacer na konci, aby poslední karta nelepila k okraji */}
        <div className="w-1 shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Header */}
      <header className="pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="container-apple px-6">
          <Link href="/" className="link-apple text-sm text-[var(--text-muted)]">
            ← zpět
          </Link>
          <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--text-secondary)]">
            Myšlenky o AI, programování, životě a všem mezi tím.
          </p>
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
            {posts.length} článků · {totalMinutes} minut myšlenek
          </p>
        </div>
      </header>

      {/* Featured */}
      {featuredPost && (
        <section className="container-apple px-6">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="glass card-hover group block rounded-2xl border-l-2 border-l-[var(--gold)] p-6 sm:p-8"
          >
            <p className="eyebrow text-[var(--gold)]">Dnes doporučujeme</p>
            <h2 className="mt-3 text-xl font-semibold leading-snug group-hover:text-[var(--gold)] transition-colors sm:text-2xl">
              {featuredPost.title}
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--text-secondary)] leading-relaxed">{featuredPost.description}</p>
          </Link>
        </section>
      )}

      {/* Category sections — velké rozestupy, horizontální scroll */}
      <div className="mt-24 sm:mt-32">
        {sections.map((section, i) => (
          <section
            key={section.category.id}
            className={i !== 0 ? "mt-28 sm:mt-40" : ""}
          >
            <div className="container-apple px-6 sm:px-8">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{section.category.label}</h2>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">{section.category.tagline}</p>
                </div>
                <span className="hidden font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] sm:block">
                  {String(i + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-2 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
            </div>
            <CardRail posts={section.posts} />
          </section>
        ))}
      </div>

      <footer className="mt-32 pb-16">
        <div className="container-apple px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
            Petr Piskáček · petrpiskacek.online
          </p>
        </div>
      </footer>
    </main>
  );
}
