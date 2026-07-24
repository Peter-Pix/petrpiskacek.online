import { Metadata } from "next";
import Link from "next/link";

const posts: Record<string, { title: string; date: string; content: string[] }> = {
  "ai-neni-nepritel": {
    title: "AI není nepřítel. Jen jsme se ještě nenaučili jeho řeč.",
    date: "2026-07-24",
    content: [
      "",
      "Víte, že:",
      "AI dnes používají stovky milionů lidí.",
      "Většina lidí říká, že jim šetří čas.",
      "A přesto ji spousta lidí nemůže vystát.",
      "",
      "To je zvláštní.",
      "Jedna technologie. Dva úplně opačný názory.",
      "A víš co?",
      "Já chápu oba.",
      "",
      "Napadlo mě, že...",
      "Možná není problém v AI.",
      "Možná je problém v tom, že jsme si zvykli, že když s náma něco komunikuje normální řečí, rozumí.",
      "Jenže AI člověk není.",
      "A vlastně je docela zvláštní, že to vůbec funguje.",
      "Žádnej jinej druh na planetě se ti nesnaží pomoct napsat e-mail, naplánovat dovolenou nebo vysvětlit hypotéku.",
      "Dobře. Procesor není druh.",
      "Právě.",
      "A přesto si s ním povídáme.",
      "Někdy překvapivě dobře.",
      "A někdy se zeptáš na jednoduchou věc a odpověď tě donutí podívat se, jestli se náhodou nevypnul internet.",
      "A přesně tam vzniká většina nedorozumění.",
      "",
      "---",
      "",
      "**Tři věci, který stojí za to pochopit**",
      "",
      "**1. AI není ani chytrá, ani hloupá**",
      "Je to nástroj.",
      "Stejně jako kladivo.",
      "Samo o sobě není ani dobrý, ani špatný.",
      "",
      "**2. Když si nerozumíme, nemáme se rádi**",
      "To platí mezi lidmi.",
      "A překvapivě i mezi lidmi a technologiemi.",
      "Čím líp pochopíš, jak se AI ptát, tím víc z ní dostaneš.",
      "",
      "**3. Budoucnost není člověk proti AI**",
      "Daleko pravděpodobnější je člověk s AI proti člověku bez AI.",
      "Ne proto, že by byl chytřejší.",
      "Protože má vedle sebe pomocníka.",
      "",
      "---",
      "",
      "**O co tu vlastně jde**",
      "",
      "Často slýcháme, že nám roboti vezmou práci.",
      "Upřímně?",
      "Tohle zní líp v titulku než v realitě.",
      "",
      "AI sama nikam nedojede.",
      "Nepřipojí kabel.",
      "Neuklidní naštvanýho zákazníka.",
      "Nepřevezme odpovědnost za rozhodnutí.",
      "",
      "Co ale umí skvěle, je zrychlit člověka.",
      "Najde informace. Pomůže s textem. Pomůže s učením. Pomůže s nápady.",
      "A najednou zvládneš za hodinu to, co ti dřív trvalo dvě.",
      "To je ten skutečnej rozdíl.",
      "",
      "---",
      "",
      "**Pod lupou**",
      "",
      "Když se podíváš do historie, pořád děláme jednu věc.",
      "Rozšiřujeme svoje schopnosti.",
      "Kolo prodloužilo naše nohy. Motor naši sílu. Internet naše znalosti.",
      "A AI?",
      "Ta rozšiřuje naše přemýšlení.",
      "",
      "Pomůže najít souvislosti.",
      "Pomůže formulovat myšlenku.",
      "Pomůže překonat prázdnou stránku.",
      "A hlavně nám uvolňuje prostor v hlavě.",
      "Míň energie na detaily. Více energie na nápady. Na tvoření. Na řešení problémů. Na lidi kolem nás.",
      "",
      "A možná právě proto je AI tak zajímavá.",
      "Není to náhrada člověka.",
      "Je to zesilovač člověka.",
      "",
      "Stejně jako jsme si kdysi ochočili psy a později kočky, dnes se učíme žít s úplně novým druhem pomocníků.",
      "Nejsou živí. Nejsou lidský. Ale pomalu se stávají součástí každodenního života.",
      "",
      "---",
      "",
      "**Shrnutí**",
      "",
      "AI není konkurence člověka.",
      "Je to jeho zesilovač.",
      "",
      "Kdo se s ní naučí mluvit, nezíská robota, kterej za něj bude žít.",
      "Získá parťáka, se kterým zvládne víc.",
      "",
      "A podle mě tímhle civilizace nekončí, zajímavej příběh spíš teprve začíná.",
    ],
  },
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
