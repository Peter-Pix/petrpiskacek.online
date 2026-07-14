# petrpiskacek.online — Koncept

## Role v ekosystému

Tři weby = tři vrstvy jednoho obrazu:

```
petrpiskacek.cz          →  "Kdo jsem a co dělám"          →  rychlý náhled, důvod se dívat dál
petrpiskacek.cloud       →  "Že to fakt umím"              →  důkaz, live infrastruktura
petrpiskacek.online      →  "Proč to dělám a kam jdu"      →  příběh, vize, člověk za tím
```

.online je nejdůležitější ze všech. Tady se rozhoduje, jestli si tě člověk zapamatuje.

## Proč tahle stránka existuje

Na .cz je strohý profil. Na .cloud je technická demonstrace. Ale chybí **člověk**.

Každej druhej AI konzultant má stejnej web: "Stavíme AI řešení na míru." Nikdo neřekne **proč**. Nikdo neřekne, co ho k tomu přivedlo, čím si prošel, co ho na tý technologii fascinuje a čeho se bojí.

Tahle stránka je přesnej opak. Žádný bullshit. Žádný "we leverage AI to drive synergy". Jenom čistá, upřímná výpověď člověka, kterej těmhle věcem rozumí a má k nim vztah.

## Cíl

Když si to někdo přečte, měl by mít pocit:

- "Tohle není další AI bro s ChatGPT kurzem"
- "Tenhle člověk tomu fakt rozumí, ale umí to vysvětlit"
- "Vidím, co ho žene, a chápu, proč dělá to, co dělá"
- "Chci s ním mluvit"

## Struktura

### 1. Hero — "Pojď dál"

Žádný "Software Developer". Žádný "AI Consultant".

Místo toho něco jako:

```
Nejsem tady, abych ti prodal AI.
Jsem tady, abych ti ukázal, co s ní jde dělat.
A proč si myslím, že to má smysl.
```

Pod tím: jméno, fotka (stejná jako na .cz), tlačítko "Přečíst si příběh" / "Prozkoumat".

### 2. Příběh — "Jak jsem se sem dostal"

Tahle sekce je čistě textová. Žádný karty, žádný gridy. Jenom text, kterej se čte.

Měla by obsahovat:

- **Impuls:** Co tě přimělo začít se AI vážně věnovat? Byl to konkrétní moment? Projekt? Selhání?
- **Cesta:** Jak ses od prvního promptu dostal k agentním architekturám, knowledge graphům, voice cloningu?
- **Přesvědčení:** Proč věříš, že AI není buzzword? Co tě na ní fascinuje? Čeho se bojíš?
- **Vize:** Kam to podle tebe směřuje? Co stavíš teď a co budeš stavět za rok?

Tohle není životopis. Tohle je **manifest**.

### 3. Projekty — "Co jsem postavil"

Každej projekt z .cloud timeline, ale tady je vysvětlenej **lidsky**.

Místo:
> "Knowledge Graph — entity-relation graf s D3-force vizualizací"

Něco jako:
> "Českej rap má stovky interpretů, desek, labelů. Nikdo to nikdy nesystematizoval. Tak jsem postavil knowledge graph, kterej ty vztahy mapuje. Dneska má 1200+ entit a skoro 6000 vazeb. A jo, je to k ničemu — pokud zrovna nechceš vědět, kdo produkoval beat na desku, kterou nikdo neposlouchal. Ale právě v tom je ta krása."

Každej projekt má:
- Název
- Lidskej popis (3-5 vět)
- Co mě to naučilo
- Link na .cloud nebo GitHub

### 4. Přesvědčení — "V co věřím"

Sekce, kde shrneš svůj pohled na AI. Může to být pár bodů, může to být esej.

Příklady:
- "AI není kouzlo. Je to nová vrstva abstrakce, stejně jako cloud nebo internet."
- "Největší hodnota AI není v nahrazování lidí, ale v eliminaci zbytečný práce."
- "Lokální modely > cloud API, pokud ti záleží na soukromí a nákladech."
- "Agentní architektury jsou další krok. Ne chatboti, ale systémy, který něco dělají."

### 5. Blog / Myšlenky — "Co mě zrovna trápí"

Volná sekce. Může to být pár odstavců, může to být prázdný. Tady budeš psát, co tě zrovna napadá.

Inspirace: Stratechery by Ben Thompson. Dlouhý, promyšlený texty. Žádný "5 tipů jak na AI".

### 6. Chatbot — "Zeptej se mě"

Tady je klíčovej rozdíl oproti .cz.

Na .cz je Doofy — lehkej, vtipnej, občas drzej. Dělá first contact.

Na .online je **druhej chatbot**, kterej zná všechny tvoje projekty, tvůj příběh, tvoje přesvědčení. Není to Doofy. Je to **tvůj digitální dvojník**, kterej o tobě umí mluvit normální lidskou řečí.

Může se jmenovat nějak jinak. Třeba "Petr" nebo "Pix" nebo něco, co dává smysl.

Funguje takhle:
- "Co Petr dělá?" → "Staví AI systémy. Konkrétně teď dělá na knowledge graphu pro českej rap, agentní architektuře a voice cloningu."
- "Proč začal s AI?" → "Měl projekt, kterej ručně trval 3 dny. S AI to bylo 3 hodiny. To ho nakoplo."
- "Co si myslí o budoucnosti AI?" → "Že agenti jsou další krok. Ne chatboti, ale systémy, který něco dělají."

Tenhle chatbot není pro zábavu. Je pro **vysvětlení**. Když si někdo nechce číst celej web, zeptá se chatbota a dostane stejnou kvalitu odpovědi.

### 7. Kontakt — "Pojďme to probrat"

Jednoduchej footer s odkazama na .cz, .cloud, email, GitHub. Stejnej jako na .cloud.

## Design

Identickej design system jako .cz a .cloud:
- Tailwind 4, gold #c8962e
- bg-zinc-950, glass karty
- SF Pro typografie
- Apple-style spacing

Rozdíl: .online bude **víc textová, míň technická**. Víc bílýho místa, větší písmo, delší řádky. Žádný progress bary, žádný live statusy. Jenom text, kterej se čte.

## Chatbot — technická implementace

### Data source

Chatbot bude mít přístup k:
1. **Tvému příběhu** (markdown soubor v projektu)
2. **Projektům** (seznam s popisama)
3. **Přesvědčením** (body/věci, který zastáváš)
4. **Blog postům** (pokud nějaký jsou)

Tohle všechno se pošle jako system prompt nebo RAG kontext.

### Prompt

Místo Doofyho stylu (drzej, vtipnej) bude mít tenhle chatbot **tvůj hlas**. Normální, přirozenej, českej. Mluví jako ty, ne jako AI.

### API

Stejnej OpenRouter endpoint jako Doofy, jinej prompt. Může bejt na stejný doméně nebo separátní — zatím separátní, ať se nepletou.

## Vztah mezi weby

```
petrpiskacek.cz
├── Hero + About + Services + Projects + Skills + Contact
├── Doofy chatbot (first contact, lehkej)
└── Odkazy na .cloud a .online

petrpiskacek.cloud
├── Terminál hero + Live AI Lab
├── Timeline s progress bary
├── Challenge Me generator
└── Odkazy na .cz a .online

petrpiskacek.online
├── Příběh + vize + manifest
├── Projekty (lidsky)
├── Přesvědčení
├── Blog / myšlenky
├── Chatbot (digitální dvojník)
└── Odkazy na .cz a .cloud
```

## Co chybí k dokončení

- [ ] Tvůj příběh (text, kterej napíšeš ty)
- [ ] Tvoje přesvědčení (body, co zastáváš)
- [ ] Projekty (lidský popisy)
- [ ] Případnej blog post nebo myšlenka

Já postavím strukturu, design, komponenty a chatbot. Ale obsah musíš napsat ty — to je ta část, která dělá ten web autentickej.

## Odhad času

| Úkol | Čas |
|------|-----|
| Inicializace + design system | 10 min |
| Layout + Nav + Footer | 10 min |
| Hero sekce | 15 min |
| Příběh sekce (s tvojim textem) | 15 min |
| Projekty sekce (lidsky) | 15 min |
| Přesvědčení sekce | 10 min |
| Blog sekce | 10 min |
| Chatbot komponenta + API | 30 min |
| Deploy | 10 min |
| **Celkem** | **~2 hodiny** |
