/**
 * Sdílený GA4 event tracking.
 * Používá globální gtag (injektovaný @next/third-parties GoogleAnalytics).
 *
 * Příklad:
 *   trackEvent("click_project", { project: "karel" });
 *   trackEvent("click_contact");
 */
// Známé boty/crawlers, které nemá smysl počítat jako uživatele.
// Internal Traffic filtr v GA4 (traffic_type = internal) je pak vyloučí.
const BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /slurp/i, /googlebot/i, /bingbot/i,
  /duckduckbot/i, /baiduspider/i, /yandex/i, /semrush/i, /ahrefs/i,
  /mj12/i, /pingdom/i, /uptimerobot/i, /headless/i, /phantom/i,
  /puppeteer/i, /playwright/i, /curl/i, /wget/i, /python-requests/i,
  /go-http-client/i,
];

let botDetected: boolean | null = null;

/** Ne-automatizovaný traffic (boty, headless, vývojáře). Výsledek se cachuje. */
function isBot(): boolean {
  if (botDetected !== null) return botDetected;
  botDetected = false;
  try {
    const ua = navigator.userAgent || "";
    if (BOT_PATTERNS.some((re) => re.test(ua))) { botDetected = true; return botDetected; }
    const nav = navigator as unknown as Record<string, unknown>;
    if (nav.webdriver === true) botDetected = true;
    if (typeof (window as unknown as Record<string, unknown>)._phantom !== "undefined") botDetected = true;
    if (Object.prototype.hasOwnProperty.call(window, "callPhantom") || Object.prototype.hasOwnProperty.call(window, "__phantomas")) botDetected = true;
    if (navigator.languages === undefined || navigator.languages.length === 0) botDetected = true;
  } catch { /* default false */ }
  return botDetected;
}

export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean> = {}
) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    const enriched = isBot() ? { ...params, traffic_type: "internal" } : params;
    gtag("event", eventName, enriched);
  }
}
