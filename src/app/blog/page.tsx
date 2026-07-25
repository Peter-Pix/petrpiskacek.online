import { Metadata } from "next";
import Link from "next/link";

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

const posts = [
  {
    slug: "vyjimecni-obycejnaci",
    title: "Výjimeční obyčejňáci",
    description: "Nejde o to být nejchytřejší. Jde o to nebýt nejhloupější. A to je maximalistický minimalismus v praxi.",
    date: "2026-07-25",
    readTime: "4 min",
  },
  {
    slug: "ai-je-trochu-zenska",
    title: "AI je trochu ženská",
    description: "Nepředvídatelná, občas zaseknutá, a nejlepší řešení je někdy začít novej chat. Myslím to jako kompliment.",
    date: "2026-07-24",
    readTime: "2 min",
  },
  {
    slug: "proc-nas-to-stve",
    title: "Umělá inteligence. Proč nás to vlastně štve?",
    description: "Umělý kozy — v pohodě. Umělý květiny — jasný. Umělá inteligence — problém. Není to náhodou tím druhým slovem?",
    date: "2026-07-21",
    readTime: "2 min",
  },
  {
    slug: "ai-neni-prirozena",
    title: "AI není přirozená. A právě proto je tak užitečná.",
    description: "Stejně jako auto není přirozený, letadlo není přirozený a elektřina není přirozená. Přesto je používáme. Proč by AI měla být výjimka?",
    date: "2026-07-17",
    readTime: "4 min",
  },
  {
    slug: "co-dokazu-s-ai",
    title: "Co všechno dokážu, když se s AI naučím spolupracovat?",
    description: "Poprvé v historii máme partnera, který překlenuje mezery mezi tím, co chceme dokázat, a tím, co zatím neumíme.",
    date: "2026-07-13",
    readTime: "4 min",
  },
  {
    slug: "proc-se-lide-boji-ai",
    title: "Proč se lidé bojí AI",
    description: "Strach z AI není o technologii. Je o nás. O změně, nejistotě a paradoxu, který možná nečekáš.",
    date: "2026-07-09",
    readTime: "5 min",
  },
  {
    slug: "ai-neni-nepritel",
    title: "AI není nepřítel. Jen jsme se ještě nenaučili jeho řeč.",
    description: "Proč AI není konkurence člověka, ale jeho zesilovač. A proč většina nedorozumění vzniká tam, kde bys to nečekal.",
    date: "2026-07-05",
    readTime: "4 min",
  },
  {
    slug: "copilot-v-poznamkach",
    title: "Copilot v Poznámkách M365 mě fakt překvapil. A ukázal mi, kam směřuje práce s informacemi.",
    description: "Celý dokument jako kontext, okamžité editace, projekty místo izolovaných poznámek — a čtyři nápady, kam by to šlo posunout dál.",
    date: "2026-06-30",
    readTime: "4 min",
  },
  {
    slug: "proc-je-dobry-napad-pouzivat-ai",
    title: "Proč je dobrý nápad používat AI",
    description: "Největší zvýšení osobní produktivity od nástupu internetu. Kolik času a peněz ti AI může reálně ušetřit.",
    date: "2026-06-18",
    readTime: "5 min",
  },
  {
    slug: "nenadavam-protoze-me-to-bavi",
    title: "Nenadávám, protože mě to baví. Dělám to, protože to funguje.",
    description: "Proč nevybíravý jazyk u AI prokazatelně boduje — a proč to není o vulgárnosti.",
    date: "2026-06-10",
    readTime: "3 min",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
          ← zpět
        </Link>
        <h1 className="mt-8 text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-zinc-400">Myšlenky o AI, programování, životě a všem mezi tím.</p>

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
