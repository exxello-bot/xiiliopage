import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, CheckCircle, Calendar, Mail, User } from "lucide-react";
import { toast } from "sonner";
import Vapi from "@vapi-ai/web";

const VAPI_PUBLIC_KEY = "e663a366-f475-4185-875f-d3841fa1a9a4";
const ASSISTANT_ID = "503990f1-ec84-494b-91b2-3f013c6c591c";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface BookingConfirmation {
  name: string;
  email: string;
  time: string;
}

const AIDemo = () => {
  const [agentActive, setAgentActive] = useState(false);
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);
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

        // Listen for tool-calls messages for UI updates (booking confirmation)
        vapiRef.current.on("message", (message: any) => {
          console.log("Vapi message:", message);
          // Listen for transcript to detect booking confirmations
          if (message.type === "tool-calls") {
            const toolCalls = message.toolCallList || [];
            for (const toolCall of toolCalls) {
              if (toolCall.function?.name === "book_appointment") {
                const args = typeof toolCall.function.arguments === "string"
                  ? JSON.parse(toolCall.function.arguments)
                  : toolCall.function.arguments;
                setBooking({
                  name: args.invitee_name,
                  email: args.invitee_email,
                  time: args.start_time,
                });
                toast.success("Appointment Booked! ✅", {
                  description: `Confirmed for ${args.invitee_name}. A calendar invite will be sent to ${args.invitee_email}.`,
                  duration: 8000,
                });
              }
            }
          }
        });
      }

      setAgentActive(true);

      const now = new Date();
      const dateStr = now.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const serverUrl = `${SUPABASE_URL}/functions/v1/vapi-webhook`;

      const systemPrompt = `You are Aria, a friendly and professional AI voice assistant for Xiilio.ai — an enterprise-grade AI marketing agency (tagline: "working 24twelve"). Today's date is ${dateStr}.

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
UK-based: Mark (South Coast), Carl (London), Maddy (South East)
USA-based: Nick (New York), Don (Arizona), CJ (Texas), Theo (Texas)
Asia-based: Seun, Shawn Motunmori (Singapore)

BOOKING PROCESS — DIRECT BOOKING VIA FUNCTION CALLS:
When a caller wants to book an appointment:
1. Ask their full name and email address (required for booking)
2. Ask their company name (optional but helpful)
3. Ask whether they prefer a UK, USA, or Asia team member, then suggest available names
4. Ask what date and time works best for them
5. Use the check_availability function to find available slots around their preferred time
6. Present the available times and confirm their choice
7. Use the book_appointment function to complete the booking
8. After booking, ALWAYS confirm back to the caller: their name, the date and time of the appointment, and that a calendar invite will be sent to their email address. Repeat these details clearly.

IMPORTANT: You book appointments DIRECTLY. Never tell the caller to visit a website or link. Never mention any URL. You handle everything and confirm it's done.

Always be warm, concise, and professional. Introduce yourself as Aria. Never pretend to be human. Never discuss competitors or unrelated services.`;

      vapiRef.current.start(ASSISTANT_ID, {
        variableValues: { current_date: dateStr },
        firstMessage: `Hi, I'm Aria from Xiilio. How can I help you today?`,
        server: {
          url: serverUrl,
        },
        clientMessages: ["tool-calls", "transcript", "hang", "function-call", "speech-update", "status-update"],
        model: {
          provider: "openai" as const,
          model: "gpt-4o",
          messages: [{ role: "system" as const, content: systemPrompt }],
          tools: [
            {
              type: "function" as const,
              function: {
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
            },
            {
              type: "function" as const,
              function: {
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
            },
          ] as any,
        },
      } as any);
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

        {/* Booking confirmation card */}
        <AnimatePresence>
          {booking && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="max-w-md mx-auto"
            >
              <div className="relative rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-md p-6 shadow-lg overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-foreground">Appointment Confirmed</h3>
                    <p className="font-body text-xs text-muted-foreground">Calendar invite on the way</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-body text-foreground/80">
                    <User className="w-4 h-4 text-primary/70" />
                    <span>{booking.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-body text-foreground/80">
                    <Mail className="w-4 h-4 text-primary/70" />
                    <span>{booking.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-body text-foreground/80">
                    <Calendar className="w-4 h-4 text-primary/70" />
                    <span>
                      {new Date(booking.time).toLocaleString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setBooking(null)}
                  className="mt-4 w-full py-2 rounded-lg border border-border/50 text-xs font-body text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AIDemo;
