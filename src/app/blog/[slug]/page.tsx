import { Metadata } from "next";
import Link from "next/link";

const posts: Record<string, { title: string; date: string; content: string[] }> = {
  "nenadavam-protoze-me-to-bavi": {
    title: "Nenadávám, protože mě to baví. Dělám to, protože to funguje.",
    date: "2026-07-19",
    content: [
      "",
      "**Proč nevybíravý jazyk u AI prokazatelně boduje — a proč to není o vulgárnosti.**",
      "",
      "---",
      "",
      'Když řeknu AI: *"Do píči, zase to nefunguje. Vyhodilo to chybu P45 na osmnáctým řádku u funkce XY. Sprav to, nebo tě vyhodím z okna."*',
      "",
      "Tak ta věta obsahuje:",
      "",
      "1. Můj emocionální stav — nejsem spokojenej, nečekej small talk",
      "2. Konkrétní problém — chyba P45, řádek 18, funkce XY",
      "3. Očekávanej výsledek — oprav to",
      "4. Urgenci — neptám se, říkám",
      "",
      "A spotřebovalo to pár desítek tokenů.",
      "",
      'Kdybych to řekl "správně": *"Dobrý den, došlo k chybě P45 na řádku 18 ve funkci XY. Mohl byste se na to prosím podívat a opravit to? Děkuji."*',
      "",
      "To je víc tokenů, míň informace, a hlavně — model neví, jak moc je to důležitý. Neví, jestli může začít rovnou, nebo jestli má čekat na další instrukce.",
      "",
      "**Čím víc slov použiju, tím větší je pravděpodobnost, že model spletu.** Každý slovo navíc je šum, kterej může model svést jinam.",
      "",
      'Když řeknu "do píči, sprav to", model ví: Mám problém. Chci ho vyřešit. Nechci diskutovat. Můžu začít rovnou.',
      "",
      'A on to udělá. Neptá se "a co přesně myslíte tím...?", neříká "určitě, rád vám pomůžu". Prostě to vezme a opraví to nejlíp, jak umí.',
      "",
      "**Paradoxně tím, že mu řeknu, ať jde do píči, o několikanásobně zefektivňuju komunikaci.**",
      "",
      "Míň tokenů. Míň kol. Míň šumu. Víc výsledků.",
      "",
      "Není to o vulgárnosti. Je to o **informační kompresi**. A to, že to funguje, není náhoda — ty modely jsou natrénovaný na miliardách textů a naučily se, že když je někdo naštvanej, nechce diskutovat. Když někdo řekne \"sprav to\", nechce slyšet \"určitě, rád vám pomůžu\".",
      "",
      "Model neví, co je \"vztek\". Ale naučil se, že když v textu vidí určitý vzorce, správná odpověď je: jednat rychle, neptat se, neotravovat.",
      "",
      "A funguje to.",
      "",
      "---",
      "",
      "*Nenadávám, protože mě to baví. Dělám to, protože to funguje.*",
      "*A to neplatí jen u počítačů.*",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return {};
  return {
    title: `${post.title} — Petr Piskacek`,
    description: "Proč nevybíravý jazyk u AI prokazatelně boduje — a proč to není o vulgárnosti.",
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-2xl px-6 py-24">
          <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← zpět na blog
          </Link>
          <h1 className="mt-8 text-2xl font-bold">Článek nenalezen</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <article className="mx-auto max-w-2xl px-6 py-24">
        <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
          ← zpět na blog
        </Link>
        <h1 className="mt-8 text-3xl font-bold tracking-tight">{post.title}</h1>
        <time dateTime={post.date} className="mt-2 block text-sm text-zinc-600">{post.date}</time>

        <div className="mt-12 space-y-4 leading-relaxed text-zinc-300">
          {post.content.map((line, i) => {
            if (line.startsWith("---")) return <hr key={i} className="border-zinc-800 my-8" />;
            if (line.startsWith("**") && line.endsWith("**")) {
              return <p key={i} className="font-semibold text-zinc-100 text-lg">{line.replace(/\*\*/g, "")}</p>;
            }
            if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ")) {
              return <p key={i} className="text-zinc-300">{line}</p>;
            }
            if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
              return <p key={i} className="italic text-zinc-400">{line.replace(/\*/g, "")}</p>;
            }
            if (line === "") return <br key={i} />;
            return <p key={i} className="text-zinc-300">{line}</p>;
          })}
        </div>
      </article>
    </main>
  );
}
