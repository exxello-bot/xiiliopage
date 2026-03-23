// Simple analytics tracker for page views and events
// Replace with Google Analytics, Plausible, or PostHog when ready

const isProduction = typeof window !== "undefined" && !window.location.hostname.includes("localhost");

export const trackPageView = (path: string) => {
  if (!isProduction) return;
  console.log(`[Analytics] Page view: ${path}`);
  // TODO: Replace with real analytics provider
  // e.g., gtag('event', 'page_view', { page_path: path });
};

export const trackEvent = (name: string, properties?: Record<string, string | number | boolean>) => {
  if (!isProduction) return;
  console.log(`[Analytics] Event: ${name}`, properties);
  // TODO: Replace with real analytics provider
  // e.g., gtag('event', name, properties);
};
