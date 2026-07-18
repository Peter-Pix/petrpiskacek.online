"use client";

import { ExternalLinkIcon } from "./icons";
import { EchoTrigger } from "./ChatBot";

const projects = [
  {
    id: "vocalbrain",
    name: "VocalBrain",
    description:
      "Projekt založenej na audio transkripci. Člověk prostě zapne nahrávání a mluví o projektu. O něčem, co chce dělat. Nebo prostě jenom o plánek na víkend. Všechny myšlenky se přepíšou, strukturalizujou, vytáhnou se hlavní body, udělají se to-do listy, celej projekt se naplánuje — a to jenom z našeho brainstormingu.",
    detail:
      "Když přijdeme další den a začneme zase o projektu mluvit, systém automaticky pozná, že se jedná o ten týž projekt a přidá nové informace k již rozpracovanému. Takhle můžeme každý den pouze pomocí brainstormingu dopracovat projekty až ke kompletnímu návrhu.",
    link: null,
  },
  {
    id: "stylemorph",
    name: "StyleMorph",
    description:
      "Nástroj, kterej ze starých webů, který nevypadaj zrovna nejmoderněji, udělá moderně vypadající weby během chviličky. Stačí mu říct, jakej se mi líbí styl, a on v reálným čase předělá stránky, který si můžeme hned stáhnout.",
    detail:
      "Ušetří to hodiny, dny, možná týdny, a malým firmám spoustu nákladů. Tento projekt mě zajímá kvůli své relativní jednoduchosti a fascinující efektivitě.",
    link: null,
  },
  {
    id: "autoblog",
    name: "AutoBlog Publisher",
    description:
      "Projekt, kterej jsem už dlouhá léta chtěl zkusit, ale až teď jsem k tomu měl dostatečnou technologickou základnu. Zvolíme téma a AI dohledá, co lidi aktuálně zajímá, podle toho, co hledaj na Google. Na to téma vyhledá informace, zpracuje články, ty po sobě zkontroluje, vylepší je a samo je nasdílí online.",
    detail:
      "Celej web se generuje a buduje sám. Zároveň analyzuje, co už na něm je, aby se to rozvíjelo všemi směry konzistentně. Systém, kterej dokáže vybudovat, spravovat a rozšiřovat webové stránky bez jakéhokoliv zásahu člověka.",
    link: null,
  },
  {
    id: "scrollo",
    name: "Scrollo.cz",
    description:
      "Tohle je takovej můj side projekt, kterej vznikl, protože mě štvalo, když všechny jednoduchý nástroje na internetu maj spoustu vyskakovacích oken, reklam, a i přesto, když se tím člověk prokliká, polovina z nich nefunguje.",
    detail:
      'Jednoho dne jsem se naštval a začal jsem pracovat na tomhle projektu. Jsou tam nástroje, který sám používám, a každej jeden z nich vzniknul právě proto, že jsem ho potřeboval. Všechny fungujou, jsou plně privátní — neukládaj žádná data do databází, všechno je ve vašem prohlížeči — a hlavně jsou úplně bez reklam a zcela zdarma.',
    link: "https://scrollo.cz",
  },
  {
    id: "4rap",
    name: "4RAP.CZ",
    description:
      "Tento projekt začal několik let zpátky, když jsem se začal víc zajímat o rapovou produkci a rap samotnej. Došlo mi, že česká scéna nemá žádnej centralizovanej web, kde by se člověk dozvěděl, kdo je kdo, kdo s kým spolupracoval, co vydal, odkud je.",
    detail:
      "Projekt shromažďuje ověřený informace a ukazuje propojení jednotlivých interpretů, alb, měst, žánrů. Dneska má 1200+ entit a skoro 6000 vazeb. A jo, je to k ničemu — pokud zrovna nechceš vědět, kdo produkoval beat na desku, kterou nikdo neposlouchal. Ale právě v tom je ta krása.",
    link: "https://4rap.cz",
  },
];

export default function Projects() {
  return (
    <section data-context-section="projects" id="projekty" className="section-apple">
      <div className="container-read">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="eyebrow">Projekty</p>
          <EchoTrigger sectionId="projects" />
        </div>
        <h2 className="headline-lg mb-4">Co jsem postavil</h2>
        <p className="subhead mb-12">
          Každej projekt má svůj příběh. Tady je vysvětlenej lidsky — ne technicky.
        </p>

        <div className="space-y-8">
          {projects.map((project, i) => (
            <div
              key={project.id}
              data-context-project={project.id}
              className="glass-card relative p-6 md:p-8 animate-fade-in-up transition-colors hover:border-gold"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold">
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
                    >
                      {project.name}
                      <ExternalLinkIcon size={14} />
                    </a>
                  ) : (
                    project.name
                  )}
                </h3>
                <EchoTrigger projectId={project.id} />
              </div>
              <div className="longform">
                <p>{project.description}</p>
                <p className="mt-4" style={{ color: "var(--text-muted)" }}>
                  {project.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
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
