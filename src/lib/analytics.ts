import { supabase } from "@/integrations/supabase/client";

const SESSION_ID = crypto.randomUUID();

const sendEvent = async (
  eventType: string,
  eventName: string,
  properties?: Record<string, string | number | boolean>
) => {
  try {
    await supabase.functions.invoke("track-analytics", {
      body: {
        event_type: eventType,
        event_name: eventName,
        page_path: window.location.pathname,
        referrer: document.referrer || null,
        properties: properties || {},
        session_id: SESSION_ID,
      },
    });
  } catch (err) {
    // Silently fail — analytics should never break the app
    console.warn("[Analytics] Failed to send event:", err);
  }
};

export const trackPageView = (path: string) => {
  sendEvent("page_view", path, { url: window.location.href });
};

export const trackEvent = (
  name: string,
  properties?: Record<string, string | number | boolean>
) => {
  sendEvent("event", name, properties);
};
