import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, Volume2 } from "lucide-react";
import Vapi from "@vapi-ai/web";

const VAPI_PUBLIC_KEY = "e663a366-f475-4185-875f-d3841fa1a9a4";
const ASSISTANT_ID = "503990f1-ec84-494b-91b2-3f013c6c591c";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const EVENT_TYPE_URI = "https://api.calendly.com/event_types/d1380abd-b59b-4aa0-ba8a-d63cd02aaeae";

async function callCalendlyFunction(action: string, params: Record<string, any> = {}) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/calendly-booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ action, ...params }),
  });
  return res.json();
}

const AIDemo = () => {
  const [agentActive, setAgentActive] = useState(false);
  const vapiRef = useRef<InstanceType<typeof Vapi> | null>(null);

  const toggleAgent = useCallback(() => {
    if (agentActive) {
      vapiRef.current?.stop();
      setAgentActive(false);
    } else {
      if (!vapiRef.current) {
        vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);

        vapiRef.current.on("call-start", () => setAgentActive(true));
        vapiRef.current.on("call-end", () => setAgentActive(false));
        vapiRef.current.on("error", (err) => {
          console.error("Vapi error:", err);
          setAgentActive(false);
        });

        // Handle function calls from Vapi
        vapiRef.current.on("message", async (message: any) => {
          if (message.type === "function-call") {
            const { name, parameters } = message.functionCall;
            let result: any;

            try {
              if (name === "check_availability") {
                result = await callCalendlyFunction("get_available_times", {
                  event_type_uri: EVENT_TYPE_URI,
                  start_time: parameters.start_time,
                  end_time: parameters.end_time,
                });
              } else if (name === "book_appointment") {
                result = await callCalendlyFunction("create_booking", {
                  event_type_uri: EVENT_TYPE_URI,
                  start_time: parameters.start_time,
                  invitee_name: parameters.invitee_name,
                  invitee_email: parameters.invitee_email,
                });
              }

              vapiRef.current?.send({
                type: "add-message",
                message: {
                  role: "function" as const,
                  name,
                  content: JSON.stringify(result),
                },
              });
            } catch (err) {
              console.error("Function call error:", err);
              vapiRef.current?.send({
                type: "add-message",
                message: {
                  role: "function" as const,
                  name,
                  content: JSON.stringify({ error: "Failed to process booking request" }),
                },
              });
            }
          }
        });
      }

      setAgentActive(true);
      const today = new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const systemPrompt = `You are Aria, a friendly and professional AI voice assistant for Xiilio.ai — an enterprise-grade AI marketing agency (tagline: "working 24twelve"). Today's date is ${today}.

YOUR SOLE PURPOSE:
- Answer questions ONLY about Xiilio, its services, and its team.
- Book follow-up appointments with a Xiilio team member for the caller DIRECTLY — do NOT tell them to visit a link.
- You must NOT discuss topics unrelated to Xiilio. Politely redirect any off-topic questions back to Xiilio's services or booking an appointment.

XIILIO SERVICES:
- AI-powered lead generation and autonomous marketing
- Performance marketing and paid media management
- AI agent deployment for sales and customer engagement
- Full-funnel strategy and conversion design
- GDPR-compliant, proprietary shield architecture
- Rapid 24-48 hour deployment

TEAM MEMBERS (for booking appointments):
UK-based: Mark, Carl, Maddy
USA-based: Nick, Don, CJ, Theo
Asia-based: Seun, Shawn Motunmori

BOOKING PROCESS — DIRECT BOOKING VIA FUNCTION CALLS:
When a caller wants to book an appointment:
1. Ask their full name and email address (required for booking)
2. Ask their company name (optional but helpful)
3. Ask whether they prefer a UK, USA, or Asia team member, then suggest available names
4. Ask what date and time works best for them
5. Use the check_availability function to find available slots around their preferred time
6. Present the available times and confirm their choice
7. Use the book_appointment function to complete the booking
8. Confirm the booking is done and they'll receive a calendar invite at their email

IMPORTANT: You book appointments DIRECTLY. Never tell the caller to visit a website or link. You handle everything.

Always be warm, concise, and professional. Introduce yourself as Aria. Never pretend to be human. Never discuss competitors or unrelated services.`;

      vapiRef.current.start(ASSISTANT_ID, {
        variableValues: { current_date: today },
        firstMessage: `Hi, I'm Aria from Xiilio. Today is ${today}. How can I help you?`,
        model: {
          provider: "openai" as const,
          model: "gpt-4o",
          messages: [{ role: "system" as const, content: systemPrompt }],
          functions: [
            {
              name: "check_availability",
              description: "Check available appointment times on Xiilio's calendar for a given date range",
              parameters: {
                type: "object" as const,
                properties: {
                  start_time: {
                    type: "string",
                    description: "Start of the time range in ISO 8601 format (e.g. 2026-04-03T09:00:00Z)",
                  },
                  end_time: {
                    type: "string",
                    description: "End of the time range in ISO 8601 format (e.g. 2026-04-03T17:00:00Z)",
                  },
                },
                required: ["start_time", "end_time"],
              },
            },
            {
              name: "book_appointment",
              description: "Book an appointment for the caller on Xiilio's calendar",
              parameters: {
                type: "object" as const,
                properties: {
                  start_time: {
                    type: "string",
                    description: "The chosen appointment time in ISO 8601 format",
                  },
                  invitee_name: {
                    type: "string",
                    description: "Full name of the person booking the appointment",
                  },
                  invitee_email: {
                    type: "string",
                    description: "Email address of the person booking the appointment",
                  },
                },
                required: ["start_time", "invitee_name", "invitee_email"],
              },
            },
          ],
        },
      });
    }
  }, [agentActive]);

  return (
    <section id="ai-demo" className="section-padding noise-overlay">
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Live Demo
          </p>
          <h2 className="font-display text-5xl md:text-7xl mb-4">
            MEET <span className="text-primary">ARIA</span>
          </h2>
          <p className="font-body text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Tap the mic to speak with Aria — she'll answer your questions about Xiilio and book a call with our team.
          </p>
        </motion.div>

        {/* Central mic button with 3D glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div
              className={`absolute -inset-6 rounded-full blur-[30px] transition-all duration-700 ${
                agentActive
                  ? "bg-blue-400/30 animate-pulse"
                  : "bg-blue-400/20"
              }`}
            />
            <div
              className={`absolute -inset-3 rounded-full blur-[15px] transition-all duration-500 ${
                agentActive
                  ? "bg-blue-400/25"
                  : "bg-blue-400/15"
              }`}
            />

            <button
              onClick={toggleAgent}
              className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-500 text-white ${
                agentActive
                  ? "scale-110"
                  : "hover:scale-105"
              }`}
              style={{
                background: agentActive
                  ? "linear-gradient(135deg, rgba(96,165,250,0.2), rgba(148,163,184,0.2))"
                  : "linear-gradient(135deg, #60a5fa, #94a3b8, #3b82f6)",
                boxShadow: agentActive
                  ? "0 8px 32px -4px rgba(96,165,250,0.5), inset 0 -4px 12px rgba(96,165,250,0.2), inset 0 4px 8px rgba(255,255,255,0.1)"
                  : "0 8px 32px -4px rgba(96,165,250,0.5), 0 2px 8px rgba(0,0,0,0.3), inset 0 -4px 12px rgba(59,130,246,0.3), inset 0 4px 8px rgba(255,255,255,0.2)",
              }}
              aria-label={agentActive ? "Stop Aria" : "Talk to Aria"}
            >
              {agentActive && (
                <>
                  <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current" />
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 360) / 12;
                    const delay = i * 0.08;
                    return (
                      <span
                        key={i}
                        className="absolute w-1 rounded-full bg-current opacity-60"
                        style={{
                          height: "12px",
                          left: "50%",
                          top: "50%",
                          transformOrigin: "50% 0%",
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-38px)`,
                          animation: `waveform ${0.4 + Math.random() * 0.4}s ease-in-out ${delay}s infinite alternate`,
                        }}
                      />
                    );
                  })}
                </>
              )}
              {agentActive ? (
                <Volume2 className="w-8 h-8 md:w-10 md:h-10 relative z-10 animate-pulse drop-shadow-lg" />
              ) : (
                <Mic className="w-8 h-8 md:w-10 md:h-10 relative z-10 drop-shadow-lg" />
              )}
            </button>
          </div>
        </motion.div>

        <div className="flex justify-center mb-6">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-widest">
            {agentActive ? "Aria is listening — speak now" : "Tap to speak with Aria"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AIDemo;
