/**
 * Sdílený GA4 event tracking.
 * Používá globální gtag (injektovaný @next/third-parties GoogleAnalytics).
 *
 * Příklad:
 *   trackEvent("click_project", { project: "karel" });
 *   trackEvent("click_contact");
 */
export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean> = {}
) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", eventName, params);
  }
}
