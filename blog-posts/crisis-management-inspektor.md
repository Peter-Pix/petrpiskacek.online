---
title: "Crisis Management: Jak jsem si postavil inspektora, co mi čourá do projektů"
date: 2026-07-26
tags: [AI, agenti, audit, devops, local-first, crisis-management, projekty]
---

# Crisis Management: Jak jsem si postavil inspektora, co mi čourá do projektů

## Úvod

Mám 17 projektů v `~/projects/`. Některý jsou aktivní, některý mrtvý, některý čekají na restart. A všechny mají jedno společný: **když do nich po měsíci kouknu, je to jako otevřít lednici po dovolený.** Něco smrdí, něco zplesnivělo a já si říkám: "Jak jsem to mohl nechat takhle?"

Dokumentace chybí. `.env.example` nikde. Working tree je špinavej. TODO markery všude. A občas se mi podaří commitnout merge conflict. Ne proto, že bych byl neschopnej. Ale proto, že když člověk staví 17 věcí najednou, něco uteče.

Tak jsem si řekl: **potřebuju inspektora.** Ne přítele. Ne poradce. Týpka, co přijde, projede všechno prstem, najde každou chybu a řekne mi to bez cukru.

A vznikl **Crisis Management**.

## Co to je

Crisis Management je lokální dashboard, co automaticky audituje všechny moje projekty. Najde problémy, seřadí je podle závažnosti, umožní mi je řešit a když si nejsem jistej, pošle to AI agentovi, kterej navrhne opravu.

Každý nález má dvě verze popisu:

- **Vulgární** — "Working tree je v hajzlu — máš 3 necommitnutý soubory a ještě se divíš, že ti build nejde."
- **Technická** — "The working tree contains uncommitted changes. Commit or stash them to ensure reproducible builds."

Proč dvě verze? Protože já chci slyšet pravdu narovinu, ale AI agenti potřebujou neutrální technický zadání. Inspektor nadává. Agent opravuje.

## Proč jsme to dělali

Protože **opakující se manuální kontrola je na hovno.**

Předtím jsem občas otevřel projekt, zkontroloval git status, podíval se, jestli je README, přečetl pár souborů a řekl si: "Jo, to ještě ujde." Ale 17 projektů? To nezkontroluješ. Ne systematicky. Ne pravidelně.

A pak se stane tohle:

- Najednou zjistíš, že máš v repu hardcoded API key.
- Zjistíš, že `node_modules` jsou commitnutý.
- Zjistíš, že máš 47 TODO markerů, který jsi sliboval vyřešit "někdy".
- Zjistíš, že závislosti jsou rok zastaralý a jeden update ti rozbije celou appku.

Crisis Management tyhle věci najde **dřív, než jsou problém.** A když už jsou problém, dá ti plán, jak je opravit.

## Jak to funguje

### 1. Projde všechny projekty

Aplikace automaticky objeví každý git repo v `~/projects/`. Přidá ho do sledovaných. Pokud projekt ještě nemá audit, vytvoří ho okamžitě.

### 2. Spustí kontroly

Pro každý projekt zkontroluje:

- **Dirty working tree** — necommitnutý změny
- **Chybějící README** — protože budoucnost tebe (a ostatní) poděkuje
- **Chybějící `.env.example`** — když máš `.env.local`, ale nikdo neví, co v něm má být
- **TODO / FIXME / HACK / XXX markery** — "někdy" znamená "nikdy"
- **Merge conflict markery** — ano, občas se commitne `<<<<<<< HEAD`
- **Exposed secrets** — API klíče, tokeny, hesla
- **`node_modules` v gitu** — klasika
- **Zastaralé závislosti** — `npm outdated`

### 3. Vytvoří nálezy

Každá chyba má:

- titul
- kategorii (git, dokumentace, bezpečnost, závislosti, kvalita kódu, konfigurace)
- závažnost (critical / high / medium / low)
- prioritu
- soubor a řádek
- vulgarHuman popis
- technical popis
- stav (open / in-progress / done / ignored)

### 4. Uloží vše do JSON

Žádná databáze. Všechno je v `data/` jako čitelný JSON — projekty, audity, nálezy, AI reporty. Git-friendly, diffable, jednoduchý. Data se generují lokálně a necommitují se do repa.

### 5. Dashboard

Webový rozhraní na `http://localhost:8888` ukazuje:

- přehled všech projektů
- počet kritických a otevřených nálezů
- filtry podle závažnosti a stavu
- historii auditů
- detail každého nálezu s oběma popisy

### 6. AI agenti

Když chci nález řešit, můžu ho poslat jednomu ze tří agentů přes Ollama cloud:

- **Strateg** — dá mi plán opravy: kroky, effort, riziko, kdo by to měl udělat
- **CodeFixer** — navrhne konkrétní změnu kódu nebo konfigurace
- **SecurityCop** — analyzuje bezpečnostní dopady a doporučí hardening

Předtím, než AI začne, systém zkontroluje, jestli data nejsou zastaralá. Pokud audit je starší než 8 hodin, AI se odmítne spustit. **Bez aktuálních dat se neopravuje.**

## Na čem to stojí

- **Next.js 14 + TypeScript + Tailwind CSS** — standardní stack, který už používám
- **JSON data store** — žádný server, žádná databáze, všechno lokálně
- **Ollama cloud** — AI agenti běží přes `deepseek-v4-flash` (případně jiný model)
- **Git + cron** — audity každých 8 hodin automaticky

Cílem bylo **local-first, jednoduchý, udržovatelný**. Není to korporátní enterprise řešení. Je to můj osobní inspektor.

## Jak nás to napadlo

Napadlo mě to, když jsem zjistil, že mám v jednom projektu commitnutý `.env.local` s API klíčem. Naštěstí v soukromým repu, ale stejně. Říkal jsem si: "Kdybych měl něco, co mi tohle najde *automaticky* a *pravidelně*, nestane se to."

A pak mi došlo, že to samý platí pro všechno ostatní:

- README není proto, aby se pěkně koukal. Je proto, aby *někdo* za rok pochopil, co to dělá.
- `.env.example` není formalita. Je to mapa, jak projekt rozběhat.
- TODO není poznámka. Je to dluh.
- Dirty tree není realita každýho vývojáře. Je to znamení, že nemáš pořádek.

Chtěl jsem něco, co mi to řekne bez ohledu na to, jestli se mi to chce slyšet.

## Jaký problém to řeší

Crisis Management řeší **zánik kontroly nad vlastníma projektama.**

Když máš jeden projekt, uhlídáš ho. Když jich máš 17, potřebuješ systém. Jinak se začnou hromadit malý průsery, který jednoho dne přerostou ve velký problémy.

A řeší to i **lenost.** Já vím, že bych měl kontrolovat každej projekt. Ale neudělám to. Takže jsem si postavil robota, co to udělá za mě. A k tomu robota, co mi řekne, co s tím.

## Co od toho čekám

- **Méně překvapení.** Žádný "jo, to jsem věděl, že se to jednou rozbije".
- **Rychlejší opravy.** Nález je hned vidět, má prioritu a často i návrh řešení.
- **Lepší dokumentaci.** Když chybí README nebo `.env.example`, uvidím to hned.
- **Čistější repa.** Méně TODO, méně dirty tree, méně zastaralých balíčků.
- **Bezpečnost.** Exposed secrets najdeme dřív, než je někdo najde jinde.

A taky čekám, že se AI agenti postupem času naučí lepší opravy. Čím víc nálezů projdou, tím víc kontextu mají a tím lepší návrhy dávají.

## Jak to používat

```bash
cd ~/projects/crisis-management
npm install
npm run build
npm start
```

Otevři `http://localhost:8888`.

Doporučuju nastavit `.env.local` s Ollama API klíčem, jinak AI agenti nefungujou:

```env
OLLAMA_API_URL=https://ollama.com/api/v1
OLLAMA_API_KEY=tvůj-klíč
OLLAMA_MODEL=deepseek-v4-flash
```

Plánovaný audit běží každých 8 hodin přes cron. Manuálně můžeš spustit "Auditovat všechny" z dashboardu.

## Závěr

Crisis Management není appka, co ti řekne, že jsi skvělej. Je to appka, co ti řekne, kde jsi udělal chybu. A to je mnohem užitečnější.

Není to dokonalý. První verze jeostrej, jednoduchej a lokální. Bude se to iterovat. Přibudou další kontroly, lepší AI agenti, možná nějaký vizualizace. Ale základ je hotovej a už teď mi to pomáhá držet pořádek v 17 projektech.

A jestli si myslíš, že tohle nepotřebuješ — podívej se na svoje `~/projects/`. Jsem ochotnej se vsadit, že tam najdeš alespoň tři věci, co bys měl opravit.

---

*P.S. Následující commit v repu crisis-management už bude čistej. Aspoň doufám. Inspektor to zkontroluje.*
