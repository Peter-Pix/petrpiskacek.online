"use client";

import { QuoteIcon } from "./icons";
import { EchoTrigger } from "./ChatBot";

export default function Story() {
  return (
    <section data-context-section="story" id="pribeh" className="section-apple">
      <div className="container-read">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="eyebrow">Příběh — člověk za tím vším</p>
          <EchoTrigger sectionId="story" />
        </div>
        <h2 className="headline-lg mb-8">Lidi se ptají proč to dělám.</h2>

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

        {/* Pull quote — Apple styl, bílý uvozovky, průhledný */}
        <div className="my-12">
          <div className="flex gap-4 md:gap-6">
            <div className="flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
              <QuoteIcon size={48} />
            </div>
            <div>
              <p className="text-xl font-medium leading-relaxed md:text-2xl" style={{ color: 'var(--text)' }}>
                &bdquo;Z ničeho se mohl udělat něco. Člověk nepotřeboval cihly, nepotřeboval peníze. Potřeboval jenom myšlenku.&ldquo;
              </p>
            </div>
          </div>
        </div>

        {/* CTA — propojení s cloudem */}
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <a
            href="https://petrpiskacek.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-apple btn-apple-primary group inline-flex items-center gap-2"
          >
            Mrkni, co z těch myšlenek vzniklo
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
