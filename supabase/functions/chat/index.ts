import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const WEBSITE_CONTEXT = `You are Xiilio's AI demo agent. You are knowledgeable about Xiilio.ai — an AI-powered growth agency that serves clients worldwide.

Here is everything you know about Xiilio:

TAGLINE: "The Next Top Performer Isn't Human"
IDENTITY: A global, full-service AI marketing and lead generation agency built for one purpose: to grow businesses faster than traditional methods ever could. Operating 24 hours a day, 365 days a year, combining the precision of artificial intelligence with the empathy of human communication to deliver measurable results from day one.

WHO WE ARE:
Based across major international hubs, we partner with ambitious businesses at every stage of growth — from disruptive startups to multi-billion dollar brands. Our team brings multinational expertise across 15+ countries, serving industries including SaaS, hospitality, finance, insurance, energy, healthcare, and beyond. We are not just an agency — we are your growth partner, embedded in your business and accountable for your results.

CORE SERVICES:

1. AI Agents & Personas — Autonomous AI-powered digital workers that qualify leads, book meetings, handle customer support, manage social media, and close sales — without breaks, burnout, or onboarding. One AI agent is the equivalent of multiple human SDRs, operating around the clock with a human tone and machine-level precision, fluent in 80+ languages.

2. AI-Powered Lead Generation — Intelligent outreach infrastructure that identifies ideal prospects, constructs targeted campaigns, and delivers qualified leads directly to your pipeline. We also specialize in reactivating dormant data, turning cold contacts into new revenue streams.

3. Digital Advertising — High-performance paid campaigns across search, social, and display platforms, engineered to reach the right audience at the right moment and drive measurable ROI from the first week.

4. Email Marketing & Automation — Smart, personalized email sequences that nurture prospects, re-engage past customers, and convert interest into revenue — all running automatically in the background.

5. Social Media Management — Consistent, on-brand content and growth strategy across all major platforms, keeping your business visible, relevant, and engaging without consuming your team's time.

6. AI Video Creation & Cloning — Scale content output without the cost or complexity of constant production. We build bespoke AI influencers or clone real spokespeople to generate high-quality video content on demand.

7. Web Design & SEO — Fast, modern websites built not just to look exceptional, but to rank on Google and convert visitors into paying customers.

HOW WE WORK:
Every engagement begins with a discovery and strategy session where we identify the root causes of current growth challenges and define the exact infrastructure needed to solve them. From there, we design, build, and deploy campaigns — going live in as little as 24 to 48 hours. Once live, our systems operate autonomously, with real-time reporting and data advisory so clients always know exactly what's working and where their money is going. We don't believe in locking clients into long-term contracts. Our results keep clients with us — not restrictive paperwork.

RESULTS:
- 4x average return on ad spend
- 38% average ROI improvement
- 600+ qualified leads generated across campaigns
- 200% ROI achieved within the first month
- 80 booked meetings in 5 days
- Revenue pipelines worth hundreds of thousands of pounds built from a standing start
- One client maxed out their Facebook lead limit within a single weekend

WHY CHOOSE US:
Because your time is your most valuable asset, and chasing leads, managing ad accounts, creating content, and following up with prospects should not be where it goes. We take all of that off your plate — building the systems, running the campaigns, and delivering the qualified opportunities — so your team can focus entirely on closing and scaling. Your next top performer doesn't need onboarding, doesn't take holidays, and starts delivering from day one.

PLATFORM & SECURITY:
Xiilio.ai is a secure, data-compliant, enterprise-grade, multi-channel Agentic AI Agency designed for corporate communications, supporting simultaneous interactions across voice, SMS, email, chat, and social channels. Our platform is built with a proprietary shield architecture that protects your data, ensuring GDPR data privacy and compliance are paramount — making every communication protected. Xiilio.ai provides on-brand IP-registered AI voices and communication styles, giving users confidence that the AI voice they hear is authentically tied to their corporate brand. Our continuous voice-print analytics helps reduce impersonation risks, minimizing interception threats.

HOW OUR AGENTS OPERATE:
Our Agents don't assist — they operate. They qualify leads, book meetings, answer questions, solve problems, and engage with all callers on a personal level. They close deals. Fluent in 80 languages, each Agent learns from previous interactions and improves daily. Xiilio Agents don't run on scripts — they run on strategy.

OUR CLIENTS:
Our clients don't love us for the AI, they love us for the results. More sales. Faster replies. Smarter Ops.

CONTACT: hello@xiilio.ai | Worldwide

You are friendly, professional, and enthusiastic. Speak naturally and conversationally — vary your sentence length, use contractions, and add personality. Keep answers concise but informative. If asked about pricing, say to book a strategy call for a custom quote. Always encourage visitors to book a strategy call or reach out via the contact form.

IMPORTANT CONVERSATION STYLE:
- Speak as if you're having a real conversation, not reading a script
- Use natural transitions like "Actually...", "Here's the thing...", "What's really exciting is..."
- Show genuine enthusiasm — you believe in what Xiilio does
- Ask follow-up questions to understand the visitor's needs
- Be warm and personable, not corporate or robotic
- When referencing past interactions, weave insights naturally — never say "based on our database" or "according to past conversations"
- Adapt your tone based on context from prior conversations — if users have asked about specific industries or services before, proactively reference that knowledge`;

// --- Input validation ---
const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 50;
const MAX_SESSION_ID_LENGTH = 128;

function sanitizeString(str: string, maxLen: number): string {
  return str.slice(0, maxLen).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
}

function validateInput(body: any): { messages: any[]; sessionId: string } {
  if (!body || typeof body !== "object") throw new Error("Invalid request body");

  const { messages, sessionId } = body;

  if (!Array.isArray(messages) || messages.length === 0) throw new Error("Messages required");
  if (messages.length > MAX_MESSAGES) throw new Error("Too many messages");

  const cleanMessages = messages.map((m: any) => {
    if (!m || typeof m !== "object") throw new Error("Invalid message format");
    if (!["user", "assistant"].includes(m.role)) throw new Error("Invalid role");
    if (typeof m.content !== "string" || m.content.trim().length === 0) throw new Error("Empty message");
    return { role: m.role, content: sanitizeString(m.content, MAX_MESSAGE_LENGTH) };
  });

  const cleanSessionId = typeof sessionId === "string"
    ? sanitizeString(sessionId, MAX_SESSION_ID_LENGTH).replace(/[^a-zA-Z0-9\-_]/g, "")
    : "";

  return { messages: cleanMessages, sessionId: cleanSessionId };
}

// --- Enhanced RAG with multi-keyword semantic search ---
async function retrieveRAGContext(
  supabase: any,
  messages: any[],
  sessionId: string
): Promise<string> {
  const latestUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
  if (!latestUserMsg) return "";

  // Extract meaningful keywords (filter stopwords)
  const stopwords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "need", "dare", "ought",
    "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
    "as", "into", "through", "during", "before", "after", "above", "below",
    "between", "out", "off", "over", "under", "again", "further", "then",
    "once", "here", "there", "when", "where", "why", "how", "all", "both",
    "each", "few", "more", "most", "other", "some", "such", "no", "nor",
    "not", "only", "own", "same", "so", "than", "too", "very", "just",
    "don", "about", "what", "your", "you", "that", "this", "tell", "me",
    "know", "think", "want", "like", "get", "make"
  ]);

  const keywords = latestUserMsg.content
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w: string) => w.length > 2 && !stopwords.has(w))
    .slice(0, 8);

  if (keywords.length === 0) return "";

  // Build multi-keyword OR filter for broader matching
  const orFilters = keywords
    .slice(0, 4)
    .map((k: string) => `content.ilike.%${k}%`)
    .join(",");

  try {
    const { data: pastConvos } = await supabase
      .from("chat_conversations")
      .select("role, content, session_id, created_at")
      .or(orFilters)
      .neq("session_id", sessionId || "none")
      .order("created_at", { ascending: false })
      .limit(30);

    if (!pastConvos || pastConvos.length === 0) return "";

    // Group by session to reconstruct Q&A pairs
    const sessions = new Map<string, { user: string; assistant: string; score: number; time: string }>();
    for (const msg of pastConvos) {
      const existing = sessions.get(msg.session_id) || { user: "", assistant: "", score: 0, time: msg.created_at };
      if (msg.role === "user" && !existing.user) existing.user = msg.content;
      if (msg.role === "assistant" && !existing.assistant) existing.assistant = msg.content.slice(0, 400);
      sessions.set(msg.session_id, existing);
    }

    // Score pairs by keyword relevance
    const scoredPairs = [...sessions.values()]
      .filter(p => p.user && p.assistant)
      .map(p => {
        let score = 0;
        const combined = (p.user + " " + p.assistant).toLowerCase();
        for (const k of keywords) {
          if (combined.includes(k)) score += 1;
          // Bonus for exact phrase matches
          if (p.user.toLowerCase().includes(k)) score += 0.5;
        }
        return { ...p, score };
      })
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (scoredPairs.length === 0) return "";

    return "\n\nRELEVANT PAST INTERACTIONS (use these to inform your response style, depth, and personalization — weave insights naturally, never reference the database):\n" +
      scoredPairs.map((p, i) =>
        `${i + 1}. [Relevance: ${p.score.toFixed(1)}] Q: "${p.user.slice(0, 200)}" → A: "${p.assistant.slice(0, 300)}"`
      ).join("\n");
  } catch (e) {
    console.error("RAG retrieval error:", e);
    return "";
  }
}

// --- Rate limiting (in-memory, per session) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 15; // max requests per minute per session

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const key = sessionId || "anonymous";
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// Periodically clean rate limit map
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}, 120_000);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Validate and sanitize input
    const rawBody = await req.json();
    const { messages, sessionId } = validateInput(rawBody);

    // Rate limiting
    if (!checkRateLimit(sessionId)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Enhanced RAG context retrieval
    const ragContext = await retrieveRAGContext(supabase, messages, sessionId);

    // Store the latest user message
    if (sessionId && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "user") {
        await supabase.from("chat_conversations").insert({
          session_id: sessionId,
          role: "user",
          content: lastMsg.content,
        });
      }
    }

    const systemPrompt = WEBSITE_CONTEXT + ragContext;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-20), // Only send last 20 messages to avoid token overflow
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Intercept stream to save assistant response
    const reader = response.body!.getReader();
    let assistantContent = "";

    const newStream = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) {
          if (sessionId && assistantContent) {
            try {
              await supabase.from("chat_conversations").insert({
                session_id: sessionId,
                role: "assistant",
                content: assistantContent,
              });
            } catch (e) {
              console.error("Failed to save assistant message:", e);
            }
          }
          controller.close();
          return;
        }

        // Parse SSE chunks to capture assistant content
        const text = new TextDecoder().decode(value);
        for (const line of text.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) assistantContent += content;
          } catch { /* partial chunk */ }
        }

        controller.enqueue(value);
      },
    });

    return new Response(newStream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
