"use client";

export default function Beliefs() {
  const beliefs = [
    {
      title: "AI není zlý ani hodný",
      text: "Je to jenom nástroj, stejně jako kladívko, s kterým dokážeme spoustu věcí postavit, ale taky spoustu věcí rozbít. AI dokáže znásobit myšlenku a zefektivnit práci tak jako nikdy nic předtím.",
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
    <section id="presvedceni" className="section-apple">
      <div className="container-read">
        <p className="eyebrow mb-3">Přesvědčení</p>
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
