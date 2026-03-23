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
- Be warm and personable, not corporate or robotic`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, sessionId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Retrieve relevant past conversations for RAG context
    let ragContext = "";
    if (messages.length > 0) {
      const latestUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
      if (latestUserMsg) {
        // Search for similar past conversations by keyword matching
        const keywords = latestUserMsg.content
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .split(/\s+/)
          .filter((w: string) => w.length > 3)
          .slice(0, 5);

        if (keywords.length > 0) {
          // Find past Q&A pairs that match user's topic
          const searchPattern = keywords.join("|");
          const { data: pastConvos } = await supabase
            .from("chat_conversations")
            .select("role, content, session_id, created_at")
            .or(`content.ilike.%${keywords[0]}%${keywords.length > 1 ? `,content.ilike.%${keywords[1]}%` : ""}`)
            .neq("session_id", sessionId || "")
            .order("created_at", { ascending: false })
            .limit(10);

          if (pastConvos && pastConvos.length > 0) {
            // Group by session to get Q&A pairs
            const sessions = new Map<string, { user: string; assistant: string }>();
            for (const msg of pastConvos) {
              const existing = sessions.get(msg.session_id) || { user: "", assistant: "" };
              if (msg.role === "user" && !existing.user) existing.user = msg.content;
              if (msg.role === "assistant" && !existing.assistant) existing.assistant = msg.content.slice(0, 200);
              sessions.set(msg.session_id, existing);
            }

            const relevantPairs = [...sessions.values()]
              .filter(p => p.user && p.assistant)
              .slice(0, 3);

            if (relevantPairs.length > 0) {
              ragContext = "\n\nRELEVANT PAST INTERACTIONS (use these to inform your response style and depth, but don't repeat them verbatim):\n" +
                relevantPairs.map((p, i) => `${i + 1}. Q: "${p.user}" → A: "${p.assistant}"`).join("\n");
            }
          }
        }
      }
    }

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
          ...messages,
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

    // We need to intercept the stream to save the assistant response
    const originalBody = response.body!;
    const reader = originalBody.getReader();
    let assistantContent = "";

    const newStream = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) {
          // Save the complete assistant response
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
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
