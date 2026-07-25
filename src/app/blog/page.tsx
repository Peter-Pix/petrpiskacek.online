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
    slug: "ai-je-trochu-jako-sexy-holka",
    title: "AI je trochu jako sexy holka",
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
    slug: "parak-kterej-nezavidi",
    title: "Parťák, kterej nezávidí",
    description: "Představ si kolegu, co nemá ego. Nezávidí, neurazí se, nepotřebuje kafe. Zní to jako sci-fi? Není.",
    date: "2026-07-22",
    readTime: "3 min",
  },
  {
    slug: "bojime-se-toho-co-nechapeme",
    title: "Bojíme se toho, co nechápeme. A to je vlastně v pohodě.",
    description: "Bál jsem se, že zlenivím. Že přestanu přemýšlet. Že se stanu tím týpkem, co jen zadává prompt. A víš co? Měl jsem pravdu. Chvíli.",
    date: "2026-07-21",
    readTime: "4 min",
  },
  {
    slug: "mluvime-s-kladivem",
    title: "Mluvíme s kladivem a divíme se, že nerozumí",
    description: "Řekl jsem AI: 'Udělej to hezčí.' A ona to udělala hezčí. Jenže já myslel funkčnější. Ona myslela vizuálně. Výsledek byl krásnej. A úplně k ničemu.",
    date: "2026-07-05",
    readTime: "3 min",
  },
  {
    slug: "copilot-v-poznamkach",
    title: "Copilot v Poznámkách M365 mě fakt překvapil. A ukázal mi, kam směřuje práce s informacemi.",
    description: "Celý dokument jako kontext, okamžité editace, projekty místo izolovaných poznámek — a čtyři nápady, kam by to šlo posunout dál.",
    date: "2026-06-30",
    readTime: "4 min",
  },
  {
    slug: "obcas-je-dobry-mit-spatnej-napad",
    title: "Občas je dobrý mít špatnej nápad",
    description: "Nejdřív to pořádně promysli, říkali. A já jsem promyslel víc nápadů, než kolik jsem jich kdy zrealizoval. Tohle je o tom, proč špatný nápady jsou lepší než žádný.",
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
