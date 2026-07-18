# Ekosystém petrpiskacek — Roadmapa

## Stav k 14. 7. 2026

Všechny tři weby:
- ✅ Live na vlastních doménách
- ✅ Jednotný design system (Tailwind 4, gold #c8962e, Apple-style)
- ✅ SiteSwitcher — rychlé přepínání mezi weby
- ✅ .cz: Doofy chatbot s pamětí
- ✅ .cloud: Terminál hero, Live AI Lab, Timeline, Challenge Me
- ✅ .online: Příběh, přesvědčení, projekty, chatbot dvojník

---

## Fáze 1 — Obsah a dolaďování (1-2 týdny)

### .cz — Doofy vylepšení
- [ ] **Doofy paměť napříč weby** — když uživatel mluví s Doofym na .cz a pak přijde na .online, chatbot by měl vědět, co se řešilo. Sdílená cookie / localStorage napříč subdoménami.
- [ ] **Doofy zná .online a .cloud** — když se ho zeptáš "Co je na .online?", umí o tom mluvit. Potřebuje to v promptu.
- [ ] **Vylepšená detekce konverze** — Doofy už umí poznat, kdy je uživatel ready. Může automaticky otevřít kalendář/email.

### .cloud — Reálné endpointy
- [ ] **Image generation** — nasadit reálný endpoint (Stability AI / Replicate API). Už nebude fake.
- [ ] **Speech recognition** — nasadit Whisper endpoint. Už nebude fake.
- [ ] **OCR** — nasadit Tesseract / Google Vision. Už nebude fake.
- [ ] **Workflow Engine** — napojit na n8n nebo Temporal, ukázat reálné workflow.
- [ ] **Challenge Me výstup** — místo textu generovat Mermaid diagramy, tabulky, vizuální roadmapu.

### .online — Další obsah
- [ ] **Blog / myšlenky** — první článek. Téma: "Proč si myslím, že agenti jsou další krok."
- [ ] **Projekty — detailní stránky** — každý projekt má vlastní `/projekty/[slug]` stránku s víc detaily.
- [ ] **Chatbot — lepší kontext** — přidat RAG: chatbot bude umět odpovídat na základě všech textů na webu.

---

## Fáze 2 — Propojení a automatizace (2-4 týdny)

### Sdílená infrastruktura
- [ ] **Monorepo** — všechny tři weby v jednom repu s `packages/ui` pro sdílené komponenty (Nav, Footer, SiteSwitcher, icons, CSS). Už nebude nutné kopírovat změny ručně.
- [ ] **Sdílený design token** — jeden CSS soubor, který se importuje do všech tří webů.
- [ ] **Sdílený chatbot backend** — jeden API endpoint na .cloud, kterej obsluhuje Doofyho i dvojníka. Liší se jen promptem.

### Automatizace
- [ ] **Auto-deploy z GitHubu** — push na main → automatický deploy na Vercel. Už žádný ruční `vercel --prod`.
- [ ] **Health monitoring** — endpoint, kterej kontroluje všechny tři weby a posílá notifikaci, když něco spadne.
- [ ] **Analytika** — nasadit Plausible / Umami (self-hosted). Žádný Google Analytics.

### Cross-site features
- [ ] **Sdílená paměť** — uživatel mluví s Doofym na .cz, přijde na .online, chatbot ví, kdo je a co se řešilo.
- [ ] **Jednotné přihlášení** — pokud by někdy bylo potřeba (zatím ne).

---

## Fáze 3 — Wow efekty (1-2 měsíce)

### Challenge Me 2.0
- [ ] **Mermaid diagramy** — místo textové architektury generovat vizuální diagram.
- [ ] **Export PDF** — vygenerované řešení jde stáhnout jako PDF.
- [ ] **Historie** — uživatel vidí svá předchozí zadání a řešení.
- [ ] **Více modelů** — přepínač: Claude / GPT-4o / Gemini. Uživatel vidí, jak se liší výstupy.

### Live AI Lab 2.0
- [ ] **Reálné metriky** — místo fake "1.2s avg" ukazovat reálnou latenci z posledních 100 requestů.
- [ ] **Grafy** — vývoj latence za posledních 24h (Chart.js / Recharts).
- [ ] **Webhook status** — když služba spadne, pošle se notifikace.

### Timeline 2.0
- [ ] **GitHub aktivita** — automaticky tahat commity z GitHubu a ukazovat je na timeline.
- [ ] **Live progress** — propojit s GitHub Projects / Linear, aby se progress bary aktualizovaly samy.

### .online — Interaktivní prvky
- [ ] **Čtení s progresem** — dlouhé texty mají ukazatel, kde člověk je.
- [ ] **Audio verze** — každý text má tlačítko "Přehrát" — přečte to Petrův hlas (voice cloning).
- [ ] **Newsletter** — jednoduchý formulář "Dej mi vědět, když napíšu novej článek."

---

## Fáze 4 — Škálování (3+ měsíce)

### Nové weby
- [ ] **petrpiskacek.online → anglická verze** — celý web v angličtině pro zahraniční klienty.
- [ ] **petrpiskacek.io** — API dokumentace, technické specifikace, open source projekty.

### AI funkce
- [ ] **Doofy na všech webech** — nejen na .cz, ale i na .cloud a .online. Každý má svou verzi.
- [ ] **Multi-agentní systém** — Doofy, dvojník, challenge generator — každý je samostatný agent, který může spolupracovat.
- [ ] **Vlastní fine-tuned model** — natrénovat model na Petrovi textech, aby chatbot mluvil ještě přirozeněji.

### Monetizace (volitelné)
- [ ] **Placené konzultace** — booking systém přes Calendly, platba přes Stripe.
- [ ] **Challenge Me PRO** — delší výstupy, export, historie za předplatné.
- [ ] **API přístup** — platný přístup k live endpointům pro B2B.

---

## Co bych dělal jako první

1. **Reálné endpointy na .cloud** — největší wow efekt za nejmíň práce. Image generation + speech recognition.
2. **Monorepo** — ušetří čas při každé změně designu.
3. **První blog post na .online** — obsah je to, co dělá web autentickým.
4. **Auto-deploy** — protože ruční deploy je otrava.

---

## Co NEdělat (zatím)

- ❌ Vlastní fine-tuned model — drahý, složitej, zatím zbytečnej.
- ❌ Newsletter — pokud nemáš co pravidelně psát.
- ❌ Placené funkce — dokud není jasné, jestli o to je zájem.
- ❌ Anglická verze — dokud není obsah hotový česky.
