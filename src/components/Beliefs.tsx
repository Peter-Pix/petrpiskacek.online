"use client";

import { EchoTrigger } from "./ChatBot";

export default function Beliefs() {
  const beliefs = [
    {
      title: "Ani zlý, ani hodný.",
      text: "Jen myšlenka a rychlostroj. (Jen ty a tvůj nástroj.)",
    },
    {
      title: "Neudělá to za tebe. Udělá to, co mu řekneš.",
      text: 'Slyšel jsem názory typu "ono se to udělá samo". Ale ono to udělá jen to, co se tomu řekne. A když se tomu řekne něco špatně, výsledek je takový. A když se tomu řekne něco dobře, výsledek může být fascinující.',
    },
    {
      title: "Dar pro ty, co život milujou",
      text: "Pro někoho, koho moc nebaví život, to asi nebude velká výhra. Ale pro lidi, který život milujou, mají nějaký koníčky nebo práci, který si váží, je to jako dar z nebe. Aplikaci, kterou bych ještě před několika lety psal měsíce, dnes dokážu vytvořit, otestovat a nasadit během víkendu. Sám. Bez týmu.",
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

        <div className="space-y-8">
          {beliefs.map((belief, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <h3 className="mb-2 text-lg font-semibold">{belief.title}</h3>
              <p className="longform">{belief.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
