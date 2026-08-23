import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, type PostMeta } from "@/lib/posts";

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

function getFeaturedPost(posts: PostMeta[]): PostMeta | null {
  const featured = posts.filter((p) => p.featured);
  if (featured.length === 0) return null;
  const dayIndex = Math.floor(Date.now() / 86_400_000) % featured.length;
  return featured[dayIndex];
}

const featuredPost = getFeaturedPost(posts);

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
          ← zpět
        </Link>
        <h1 className="mt-8 text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-zinc-400">Myšlenky o AI, programování, životě a všem mezi tím.</p>
        <p className="mt-1 text-xs text-zinc-600">{totalMinutes} minut myšlenek</p>

        {featuredPost && (
          <section className="mt-10 rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-amber-500">Dnes doporučujeme</p>
            <Link href={`/blog/${featuredPost.slug}`} className="group mt-2 block">
              <h2 className="text-lg font-semibold group-hover:text-amber-500 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{featuredPost.description}</p>
            </Link>
          </section>
        )}

        <div className="mt-12 space-y-8">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <h2 className="text-xl font-semibold group-hover:text-amber-500 transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-zinc-400 leading-relaxed">{post.description}</p>
                <div className="mt-2 flex items-center gap-3 text-sm text-zinc-600">
                  <time dateTime={post.date}>{post.date}</time>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
