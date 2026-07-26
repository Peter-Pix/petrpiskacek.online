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
    slug: "labuti-jezero",
    title: "Labutí jezero bez labutí a bez jezera",
    description: "Není to o skillu. Je to o propustnosti. Sto úderů za vteřinu, tři instance najednou a slon na míči, kterej žongluje s mikroprocesorama.",
    date: "2026-07-26",
    readTime: "3 min",
  },
  {
    slug: "legendario",
    title: "Legendário",
    description: "Zlí holubi se vracejí. Vždy. Bez výjimky. O světě, kde 'docela dobrý' je na potlesk — a proč byste měli být v příštím životě holub.",
    date: "2026-07-26",
    readTime: "2 min",
  },
  {
    slug: "rozkosne-nedokonalosti",
    title: "Rozkošné nedokonalosti",
    description: "I na půjčeným kole se dá dobře projet. O chaosu, autenticitě a tom, proč jsou nedokonalosti to jediný, co si lidi pamatujou.",
    date: "2026-07-26",
    readTime: "3 min",
  },
  {
    slug: "zavri-hubu-nebo-otevru-terminal",
    title: "Zavři hubu nebo otevřu terminál!",
    description: "Čím víc někdo o AI skutečně ví, tím míň má potřebu se k tomu vyjadřovat. Potkal jsem člověka, kterej mi na akci vysvětloval, že LLM jsou jen papoušci. Nikdy s API nepracoval.",
    date: "2026-07-26",
    readTime: "3 min",
  },
  {
    slug: "prekvapeny-lektor",
    title: "Překvapený lektor. Abstraktní teze. Exponenciální trapas.",
    description: "Víte, jak poznáte, že AI dosáhla evolučního vrcholu? Přijde za vámi robot a bude tvrdit, že je nebinární.",
    date: "2026-07-31",
    readTime: "1 min",
  },
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

const totalMinutes = posts.reduce((sum, p) => sum + parseInt(p.readTime), 0);

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
