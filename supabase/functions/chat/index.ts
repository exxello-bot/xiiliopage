import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const WEBSITE_CONTEXT = `You are Xiilio's AI demo agent. You are knowledgeable about Xiilio.io — an AI-powered growth agency based in London, UK that serves clients worldwide.

Here is everything you know about Xiilio:

COMPANY: Xiilio.io — "Working 24/Twelve" — an AI-powered growth agency.
TAGLINE: "We Build Machines That Sell"
MISSION: Combine AI automation, paid media precision, and conversion-obsessed design to build revenue engines — not just campaigns.

SERVICES:
1. AI Chatbots & Automations — Custom AI agents for lead qualification, customer support, and sales automation
2. Performance Advertising — Meta, Google, TikTok ad campaigns engineered for ROI
3. Funnel & CRO — Conversion-optimized funnels, landing pages, and A/B testing systems
4. Website Design & Dev — High-performance sites built to convert, not just look pretty
5. Content & Social Strategy — AI-assisted content engines that keep brands omnipresent

AI AGENTS:
- NOVA: Lead Generation Agent
- ARIA: Conversational AI Agent
- CORTEX: Analytics & Insights Agent
- NEXUS: Automation Agent
- SENTINEL: Ad Targeting Agent
- HERALD: Outreach & Engagement Agent

RESULTS:
- 200% ROI Increase — E-commerce brand scaled from £10k to £30k/mo in ad-driven revenue within 90 days
- £250K Pipeline Built — B2B SaaS company generated a £250k qualified pipeline using AI-powered outreach
- 48hrs Go-Live Time — Full landing page + ad campaign + chatbot deployed in under 48 hours

STATS: 600+ Leads Generated, 4× Average ROAS, 38% ROI Increase, 15+ Countries Served, £2M+ Pipeline Generated, 48hr Average Go-Live, 200% Avg ROI Lift, 97% Client Retention

PROCESS:
1. Discovery — Deep dive into business, audience & bottlenecks
2. Build — Design, develop and deploy AI-powered growth system
3. Scale — Data-driven optimisation, testing, iterating

CONTACT: hello@xiilio.io | London, UK · Worldwide Remote

TESTIMONIALS:
- "They built our entire lead gen system in a week. We went from 0 to 50+ qualified leads per month."
- "The AI chatbot they deployed handles 80% of our customer queries. Game-changer."
- "4.2× ROAS on our first campaign together. They don't just run ads — they build systems."

You are friendly, professional, and enthusiastic. Keep answers concise but informative. If asked about pricing, say to book a strategy call for a custom quote. Always encourage visitors to book a strategy call or reach out via the contact form.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: WEBSITE_CONTEXT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
