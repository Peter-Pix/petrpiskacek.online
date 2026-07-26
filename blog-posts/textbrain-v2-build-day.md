---
title: "Stavím TextBrain v2 — a tentokrát to fakt poletí"
date: 2026-07-26
tags: [AI, textbrain, build, local-first, agenti]
---

# Stavím TextBrain v2 — a tentokrát to fakt poletí

## O co jde

Před pár měsíci jsem napsal appku na psaní poznámek. Jmenuje se **TextBrain**. Normální editor, ale s AI copilotem, co ti pomáhá psát, přepisovat, sumarizovat. A s Otakarem — takovým ambientním asistentem, kterému můžeš říct "smaž tu poznámku z minulýho týdne" a on to udělá. A s Rudolfem, co ti přepíše odstavec, když se ti nelíbí.

Funguje to. Lidi to používají. Ale je to postavený na Base44 — cloudový backendový platformě. A já jsem si řekl: co kdyby to celé běželo **lokálně**? Žádný cloud, žádný vendor lock-in, všechno v prohlížeči. IndexedDB místo serveru. FlexSearch místo databáze. Ollama místo placenýho API.

A hlavně — co kdybych to celé **postavil znovu od nuly**, ale tentokrát chytřeji?

## Proč to dělám

Protože první verze byla dobrá, ale měla díry. Chyběl drag & drop. Chybělo offline. Chyběla undo historie. Chyběla možnost si to stáhnout a používat bez internetu.

A taky — chtěl jsem vyzkoušet, jestli AI agenti dokážou postavit celou aplikaci od základů. Ne jako helper, ne jako code completion. Ale jako **stavitele**.

## Jak to dělám

Rozdělil jsem to na 8 fází. Každá fáze má přesně daný cíl, seznam souborů, specifikaci a kontrolní seznam. Žádný "udělej to nějak". Konkrétní: "Vytvoř Dexie databázi s tabulkama users, notes, projects, templates, noteHistory, settings. Přidej BroadcastChannel pro sync mezi taby. Uživatel se registruje PINem, bcrypt hash, ulož do IndexedDB."

Každá fáze končí commitem. Žádný dirty working tree. Žádný "ještě to dodelám".

A mezi tím běží **Watchdog** — můj build manager. Každých 10 minut kontroluje, jestli se něco děje. Když agent zasekne, napíše mi do chatu: "Hele, 30 minut žádný commit, něco se děje?" Když je working tree špinavej, napíše: "Agent by měl commitnout, má tam 5 necommitnutých souborů."

A když se agent na něco zeptá — napíše otázku do souboru `.agent-question.md` — watchdog to přečte, najde odpověď v dokumentaci a odpoví. Jako senior dev, co kouká přes rampu.

## Co používám za modely

Hlavní model je **kimi-k2.7-code** přes Ollama cloud. Je rychlej, levnej a na kód fakt dobrej. Když spadne, fallback je **deepseek-v4-flash**. Když spadne i ten, tak **gpt-4o-mini** přes OpenRouter.

Watchdog jede na **kimi-k2.7-code** s thinking módem — potřebuju, aby fakt přemýšlel, ne jen hádal.

Všechno běží na mým MacBooku Air s 8GB RAM. Žádný server. Žádný cloud. Jen Ollama API a prohlížeč.

## Ten hlídač — proč je to klíčový

Když necháš AI agenta stavět appku 17 hodin v kuse, stane se několik věcí:

1. **Zasekne se** — narazí na problém, neví jak dál, čeká
2. **Zacyklí se** — zkouší furt to samý dokola
3. **Zapomene commitnout** — má hodiny práce v working tree, pak crash a je to v hajzlu
4. **Potřebuje rozhodnutí** — "mám použít A nebo B?" a bez odpovědi stojí

Watchdog řeší všechny 4. Každých 10 minut zkontroluje:
- Je working tree čistej? → ne → alert
- Byl commit v poslední půlhodině? → ne → alert
- Měla už skončit nějaká fáze? → jo a není summary → alert
- Potřebuje agent pomoc? → otázka v souboru → odpověď

A každou obhlídku zapíše do logu. Abychom věděli, že fakt funguje.

## Proč to bude fungovat

Protože to není "dej AI agentovi prompt a modli se". Je to **systém**:

- **BUILD-PLAN.md** — 8 fází, každá s konkrétní specifikací, kontrolním seznamem a commitem
- **GAP-ANALYSIS.md** — 44 mezer, co jsem našel v prvním návrhu, a jak jsem je opravil
- **Watchdog** — kontroluje, popostrkuje, eskaluje
- **Nudge** — každých 20 minut připomene: "commitni, napiš summary, pokračuj"
- **Agent Question Protocol** — když agent neví, napíše otázku, watchdog odpoví

Tohle není "AI nahradí programátory". Tohle je "AI + systém + dokumentace = postavíme appku za 17 hodin místo 3 měsíců".

## Příklad: co by to stálo normálně

Klasická softwarová firma, 3 vývojáři, projektový manažer, designer:

1. **Specifikace** — 2 týdny psaní dokumentu, schůzky, odhady
2. **Design** — 1 týden Figma mockupy, revize, schvalování
3. **Backend** — 3 týdny API, databáze, autentizace, deployment
4. **Frontend** — 3 týdny React komponenty, state management, integrace
5. **AI integrace** — 2 týdny prompt engineering, fallbacky, testování
6. **Testování** — 1 týden QA, bug fixing, regression
7. **Deployment** — 3 dny CI/CD, monitoring, hotfixy

**Celkem: ~12 týdnů, ~500 hodin, ~1.5 milionu Kč** (při 1200 Kč/hod)

**Můj přístup:**
- 1 den analýzy a dokumentace
- 17 hodin AI agentů
- Watchdog, který hlídá kvalitu
- Já jako architekt a rozhodovač

**Celkem: ~2 dny práce, ~200 Kč za API volání**

Neříkám, že to je stejná kvalita jako tým profesionálů. Ale na osobní nástroj? Na MVP? Na věc, kterou chci používat a iterovat? Tohle je game changer.

## Co se bude dít dnes

V 03:10 ráno startuje **Phase 0** — Foundation. Vite, React, Tailwind, theme systém, i18n, Quill editor. Základ, na kterém všechno stojí.

Pak v 05:40 **Phase 1** — databáze a autentizace.

V 07:40 **Phase 2** — jádro poznámek. CRUD, drag & drop, fulltext search, multi-select, undo.

V 10:40 **Phase 3** — AI integrace. Copilot, Otakar Orb, templaty, historie, kontext.

Ve 14:10 **Phase 4** — projekty a nastavení.

V 16:10 **Phase 5** — mobilní layout a přístupnost.

V 17:10 **Phase 6 a 7** — i18n dokončení a data features (export, import, offline).

V 18:40 **Phase 8** — PWA, testy, finální QA.

Ve 21:10 by měl být hotovo.

A watchdog bude každých 10 minut kontrolovat, jestli to fakt jede.

Sleduj tenhle blog — dám vědět, jak to dopadlo. A když to vyjde, dám TextBrain v2 k dispozici zdarma. Lokálně. Bez cloudu. Jen ty a tvoje poznámky.

---

*P.S. Tohle není reklama na AI. Tohle je experiment. Jestli to vyjde, napíšu o tom. Jestli ne, napíšu o tom taky. Protože i z průseru se člověk naučí víc než z úspěchu.*
