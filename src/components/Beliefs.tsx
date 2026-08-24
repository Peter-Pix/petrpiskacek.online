"use client";

import { EchoTrigger } from "./ChatBot";
import { useReveal } from "@/lib/use-reveal";

export default function Beliefs() {
  const { ref: sectionRef, style: sectionStyle } = useReveal({ threshold: 0.1 });
  const beliefs = [
    {
      title: "Ani zlý, ani hodný.",
      text: "Jen myšlenka a rychlostroj.",
    },
    {
      title: "Neudělá to za tebe. Udělá to, co mu řekneš.",
      text: 'Slyšel jsem názory typu "ono se to udělá samo". Ale ono to udělá jen to, co se tomu řekne. A když se tomu řekne něco špatně, výsledek je takový. A když se tomu řekne něco dobře, výsledek může být fascinující.',
    },
    {
      title: "Dar pro ty, co život milujou",
      text: "Pro někoho, koho moc nebaví život, to asi nebude velká výhra. Ale pro lidi, který život milujou, mají nějaký koníčky nebo práci, který si váží, je to jako dar z nebe. Aplikaci, kterou bych ještě před několika lety psal měsíce, dnes dokážu vytvořit, otestovat a nasadit během víkendu. Sám. Bez týmu.",
      link: { href: "/blog/dar-pro-ty-co-zivot-milujou", label: "Přečíst celé" },
    },
    {
      title: "Rutinu nech strojům, kreativitu lidem",
      text: "Rutinní práce se můžou přenechat automatizovaným systémům a člověk se může věnovat tomu, co mu jde nejlíp. Kreativitě, vylepšování, posouvání hranic. Protože AI není konec, je teprve začátek.",
    },
  ];

  return (
    <section data-context-section="beliefs" id="presvedceni" className="section-apple">
      <div className="container-read">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="eyebrow">Přesvědčení</p>
          <EchoTrigger sectionId="beliefs" />
        </div>
        <h2 className="headline-lg mb-8">V co věřím</h2>

        <div ref={sectionRef} style={sectionStyle} className="space-y-8">
          {beliefs.map((belief, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <h3 className="mb-2 text-lg font-semibold">{belief.title}</h3>
              <p className="longform">{belief.text}</p>
              {belief.link && (
                <a
                  href={belief.link.href}
                  className="group mt-3 inline-flex items-center gap-2 text-sm font-medium"
                  style={{ color: "var(--gold)" }}
                >
                  {belief.link.label}
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
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
