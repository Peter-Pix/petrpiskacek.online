"use client";

import { QuoteIcon } from "./icons";

export default function Story() {
  return (
    <section id="pribeh" className="section-apple">
      <div className="container-read">
        <p className="eyebrow mb-3">Příběh</p>
        <h2 className="headline-lg mb-8">Jak jsem se sem dostal</h2>

        <div className="longform">
          <p>
            Počítače mě pohltily už jako malýho kluka. Bavilo mě programovat, protože z ničeho se mohl udělat něco. Člověk nepotřeboval cihly, nepotřeboval peníze, dokonce ani míč nebo hokejku. Potřeboval jenom <strong>myšlenku</strong>. A to mě prostě zaujalo.
          </p>

          <p>
            Když se začaly objevovat první AI, samozřejmě jsem nemohl odolat a musel to vyzkoušet. Pamatuju si na svůj první den s GPT chatem. Byla to verze, která se ani trošku nepodobá tomu, co existuje teď. Ale už tenkrát mě to fascinovalo. Na cokoliv jsem se toho zeptal, odpovědělo to, <em>nesoudilo mě to</em>. Zkrátka, když jsem chtěl informaci, byl ochotnej mi ji dát nebo se pokusit ji někde najít.
          </p>

          <p>
            A já jsem se zamiloval.
          </p>

          <p>
            Podle mě je tahle technologie novej milník, něco jako byl internet nebo vynález kola. A čím víc s tímhletím pracuju, tím víc mě to baví a fascinuje. Už je to několik let, co jsem k tomuhle přičichl poprvé. A moje nadšení pro projekty s umělou inteligencí je pořád větší a větší.
          </p>
        </div>

        {/* Pull quote */}
        <div
          className="my-12 rounded-2xl border p-6 md:p-8"
          style={{
            borderColor: "var(--badge-border)",
            backgroundColor: "var(--badge-bg)",
          }}
        >
          <QuoteIcon size={24} className="mb-3" />
          <p className="text-lg font-medium leading-relaxed md:text-xl" style={{ color: "var(--text)" }}>
            &bdquo;Z ničeho se mohl udělat něco. Člověk nepotřeboval cihly, nepotřeboval peníze. Potřeboval jenom myšlenku.&ldquo;
          </p>
        </div>
      </div>
    </section>
  );
}
