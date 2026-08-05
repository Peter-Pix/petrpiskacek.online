"use client";

import { ExternalLinkIcon } from "./icons";
import { EchoTrigger } from "./ChatBot";
import { useReveal } from "@/lib/use-reveal";
import { trackEvent } from "@/lib/track";

const projects = [
  {
    id: "karel",
    name: "Karel Robot",
    shot: "/screenshots/karel.jpg",
    description:
      "AI e-mailovej administrátor. Pošleš mu e-mail a on ho analyzuje, roztřídí a napíše odpověď. Rozpozná urgentní zprávy, faktury, newslettery a osobní poštu.",
    detail:
      "Přesně ten typ práce, kterou nikdo nechce dělat — ale někdo musí. A Karel se nikdy neunaví, nevyhoří a neřekne 'to není moje náplň'. Postavil jsem ho, protože mě štvalo trávit hodiny nad mailama, který se daj zvládnout za vteřinu.",
    link: "https://karel.petrpiskacek.cloud",
  },
  {
    id: "sparring",
    name: "Sparring",
    shot: "/screenshots/sparring.jpg",
    description:
      "AI konzultant na projekty. Napíšeš nápad, on se doptá na detaily, pak ti nacení, navrhne stack a časovej plán. Čtyři bloky: jádro, stack, náklady, postup.",
    detail:
      "Vznikl z frustrace z prázdný stránky. Nápad je pocit, ne plán — a Sparring tě z toho pocitu dostane na konkrétní návrh za pár vteřin. Je to jako mít na pohovce AI mentora, kterej tě nenechá mlžit.",
    link: "https://petrpiskacek.cloud/challenge",
  },
  {
    id: "flash-ui",
    name: "Flash UI",
    shot: "/screenshots/flash-ui.jpg",
    description:
      "Generuje UI komponenty z promptu. Napiš, co chceš, a DeepSeek V4 Flash to nakreslí v reálným čase. Tlačítka, formuláře, karty, dashboardy — cokoliv.",
    detail:
      "Design pro váš web. Přidejte nový formulář, chat, ceník. Cokoliv jen chcete. Ušetří to hodiny práce — a hlavně to ukazuje, že design už není o tom, umět klikat ve Figmě, ale vědět, co chceš.",
    link: "https://petrpiskacek.cloud/flash-ui",
  },
  {
    id: "4rap",
    name: "4RAP.CZ",
    shot: "/screenshots/4rap.jpg",
    description:
      "Vědomostní graf české rapové scény. Kdo s kým, kdo kde, co kdy vyšlo. Chaos dostal řád. Přesvědčte se sami.",
    detail:
      "Projekt shromažďuje ověřený informace a ukazuje propojení interpretů, alb, měst, žánrů. Dneska má 1200+ entit a skoro 6000 vazeb. A jo, je to k ničemu — pokud zrovna nechceš vědět, kdo produkoval beat na desku, kterou nikdo neposlouchal. Ale právě v tom je ta krása.",
    link: "https://4rap.cz",
  },
  {
    id: "docbot",
    name: "DocBot",
    shot: "/screenshots/docbot.jpg",
    description:
      "AI právník na český smlouvy. Postaví ti NDA, nájemní nebo pracovní smlouvu podle českého práva. Chatem tě provede krok za krokem, pak to zkontroluje na rizika.",
    detail:
      "Žádné ruční vyplňování. Smlouvy snadno a rychle. Dělejte to jednoduše. Postavil jsem ho, protože právníci jsou drahý a šablony z internetu jsou past — tohle je kompromis, kterej ti nezlomí banku ani nervy.",
    link: "https://docbot.petrpiskacek.cloud",
  },
  {
    id: "terminall",
    name: "Terminall",
    shot: "/screenshots/terminall.jpg",
    description:
      "Trénink příkazovýho řádku. Uč se Linux, macOS a Windows příkazy v bezpečným virtuálním terminálu. Dělej chyby a AI učitel ti je vysvětlí.",
    detail:
      "Naučte se terminál jinak. Učitel opravuje chyby a napovídá. Lekce s příběhem. Vznikl, protože nejlepší způsob, jak se naučit terminál, je v něm chybovat — ale v bezpečí. Tady je to povolený a ještě z toho něco máš.",
    link: "https://terminall.petrpiskacek.cloud",
  },
];

export default function Projects() {
  const { ref: sectionRef, style: sectionStyle } = useReveal({ threshold: 0.1 });
  return (
    <section data-context-section="projects" id="projekty" className="section-apple">
      <div className="container-apple">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="eyebrow">Projekty</p>
          <EchoTrigger sectionId="projects" />
        </div>
        <h2 className="headline-lg mb-4">Co jsem postavil</h2>
        <p className="subhead mb-12">
          Každej projekt má svůj příběh. Tady je vysvětlenej lidsky — ne technicky.
        </p>

        <div ref={sectionRef} style={sectionStyle} className="space-y-16 md:space-y-24">
          {projects.map((project, i) => (
            <article
              key={project.id}
              data-context-project={project.id}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Screenshot — tvář projektu */}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("click_project", { project: project.id, name: project.name })
                }
                className="block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)] transition-all duration-500 hover:border-gold"
              >
                <img
                  src={project.shot}
                  alt={`Screenshot projektu ${project.name}`}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </a>

              {/* Text */}
              <div className="mt-6 md:mt-8">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-2xl font-semibold md:text-3xl">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackEvent("click_project", { project: project.id, name: project.name })
                        }
                        className="inline-flex items-center gap-2 hover:text-gold transition-colors"
                      >
                        {project.name}
                        <ExternalLinkIcon size={16} />
                      </a>
                    ) : (
                      project.name
                    )}
                  </h3>
                  <EchoTrigger projectId={project.id} />
                </div>

                <div className="longform max-w-3xl">
                  <p className="text-lg leading-relaxed md:text-xl" style={{ color: "var(--text-primary)" }}>
                    {project.description}
                  </p>
                  <p className="mt-4" style={{ color: "var(--text-muted)" }}>
                    {project.detail}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="https://petrpiskacek.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-apple btn-apple-secondary"
          >
            Vidět v akci na .cloud <ExternalLinkIcon size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
